import firestore from '@react-native-firebase/firestore';
import { useUserStore, type UserProfile, type StreakData, type Gender } from '@/stores/useUserStore';
import { useScanStore, type ScanRecord } from '@/stores/useScanStore';
import i18n from '@/i18n';
import { type DeviceMetadata } from '@/lib/deviceInfo';
import { type RoutineStep } from '@/lib/routineData';

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

export async function saveDeviceInfo(uid: string, device: DeviceMetadata): Promise<void> {
  try {
    await firestore().collection('users').doc(uid).set(
      { device, deviceUpdatedAt: firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    console.warn('[firestore] saveDeviceInfo failed:', e);
  }
}

export async function saveOnboardingCompleted(uid: string): Promise<void> {
  try {
    await firestore().collection('users').doc(uid).set(
      { onboardingCompletedAt: firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    console.warn('[firestore] saveOnboardingCompleted failed:', e);
  }
}

export async function saveRoutine(
  uid: string,
  morning: RoutineStep[],
  night: RoutineStep[],
  weekly: RoutineStep[],
  inputs: { skinType: string; topConcern: string; gender: string },
): Promise<void> {
  try {
    const data = {
      morning: morning.map((s) => ({ id: s.id, title: s.title })),
      night: night.map((s) => ({ id: s.id, title: s.title })),
      weekly: weekly.map((s) => ({ id: s.id, title: s.title })),
      generatedAt: firestore.FieldValue.serverTimestamp(),
      inputs,
    };
    await firestore().collection('users').doc(uid).collection('routine').doc('current').set(data);
  } catch (e) {
    console.warn('[firestore] saveRoutine failed:', e);
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
