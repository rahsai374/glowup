import { db, doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, getDocs, query, orderBy, limit } from '@/lib/firebase';
import { useUserStore, type UserProfile, type StreakData } from '@/stores/useUserStore';
import { useScanStore, type ScanRecord } from '@/stores/useScanStore';
import i18n from '@/i18n';

export async function saveScan(uid: string, scan: ScanRecord): Promise<void> {
  try {
    const { imageUrl, ...data } = scan;
    await setDoc(doc(db, 'users', uid, 'scans', scan.id), data);
  } catch (e) {
    console.warn('[firestore] saveScan failed:', e);
  }
}

export async function saveProfile(
  uid: string,
  profile: { name: string; phone: string; language: string; mainConcern: string; skinType: string; waterIntake: string; sunscreenHabit: string; ageRange: string }
): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid), { ...profile, createdAt: serverTimestamp() });
  } catch (e) {
    console.warn('[firestore] saveProfile failed:', e);
  }
}

export async function updateProfileField(uid: string, partial: Record<string, unknown>): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), partial);
  } catch (e) {
    console.warn('[firestore] updateProfileField failed:', e);
  }
}

export async function updateStreak(uid: string, streak: StreakData): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), { streak });
  } catch (e) {
    console.warn('[firestore] updateStreak failed:', e);
  }
}

export async function hydrateFromFirestore(uid: string): Promise<void> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return;

  const data = snap.data();

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
  };

  useUserStore.getState().setUser(profile);

  if (data.streak && typeof data.streak.current === 'number') {
    useUserStore.setState({ streak: data.streak as StreakData });
  }

  i18n.changeLanguage(profile.language);

  const scansRef = collection(db, 'users', uid, 'scans');
  const q = query(scansRef, orderBy('createdAt', 'desc'), limit(50));
  const scansSnap = await getDocs(q);

  const scans: ScanRecord[] = scansSnap.docs.map((d) => d.data() as ScanRecord);
  useScanStore.getState().setHistory(scans);

  if (scans.length > 0) {
    useScanStore.getState().setCurrentScan(scans[0]);
  }
}
