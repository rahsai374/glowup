import firestore from '@react-native-firebase/firestore';
import { useUserStore, type UserProfile, type StreakData, type Gender } from '@/stores/useUserStore';
import { useScanStore, type ScanRecord } from '@/stores/useScanStore';
import i18n from '@/i18n';

export async function saveScan(uid: string, scan: ScanRecord): Promise<void> {
  try {
    const { imageUrl, ...data } = scan;
    await firestore().collection('users').doc(uid).collection('scans').doc(scan.id).set(data);
  } catch (e) {
    console.warn('[firestore] saveScan failed:', e);
  }
}

export async function saveProfile(
  uid: string,
  profile: { name: string; phone: string; language: string; mainConcern: string; skinType: string; waterIntake: string; sunscreenHabit: string; ageRange: string; gender: string }
): Promise<void> {
  try {
    await firestore().collection('users').doc(uid).set({ ...profile, createdAt: firestore.FieldValue.serverTimestamp() });
  } catch (e) {
    console.warn('[firestore] saveProfile failed:', e);
  }
}

export async function updateProfileField(uid: string, partial: Record<string, unknown>): Promise<void> {
  try {
    await firestore().collection('users').doc(uid).update(partial);
  } catch (e) {
    console.warn('[firestore] updateProfileField failed:', e);
  }
}

export async function updateStreak(uid: string, streak: StreakData): Promise<void> {
  try {
    await firestore().collection('users').doc(uid).update({ streak });
  } catch (e) {
    console.warn('[firestore] updateStreak failed:', e);
  }
}

export async function deleteAccount(uid: string): Promise<void> {
  const scansSnap = await firestore().collection('users').doc(uid).collection('scans').get();
  await Promise.all(scansSnap.docs.map((d) => d.ref.delete()));
  await firestore().collection('users').doc(uid).delete();
}

export async function hydrateFromFirestore(uid: string): Promise<void> {
  const snap = await firestore().collection('users').doc(uid).get();
  if (!snap.exists()) return;

  const data = snap.data()!;

  const profile: UserProfile = {
    uid,
    name: data.name ?? '',
    phone: data.phone ?? '',
    language: (data.language as 'en' | 'hi') ?? 'en',
    skinType: data.skinType ?? '',
    mainConcern: data.mainConcern ?? '',
    waterIntake: data.waterIntake ?? '',
    sunscreenHabit: data.sunscreenHabit ?? '',
    ageRange: data.ageRange ?? '',
    gender: (data.gender as Gender) ?? 'unspecified',
  };

  useUserStore.getState().setUser(profile);

  if (data.streak && typeof data.streak.current === 'number') {
    useUserStore.setState({ streak: data.streak as StreakData });
  }

  i18n.changeLanguage(profile.language);

  const scansSnap = await firestore()
    .collection('users').doc(uid).collection('scans')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  const scans: ScanRecord[] = scansSnap.docs.map((d) => d.data() as ScanRecord);
  useScanStore.getState().setHistory(scans);

  if (scans.length > 0) {
    useScanStore.getState().setCurrentScan(scans[0]);
  }
}
