import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult } from '@/lib/gemini';

export interface ScanRecord extends ScanResult {
  id: string;
  createdAt: string;
  imageUrl?: string;
  wasReady?: boolean;
}

interface ScanStore {
  currentScan: ScanRecord | null;
  scanHistory: ScanRecord[];
  setCurrentScan: (scan: ScanRecord) => void;
  addToHistory: (scan: ScanRecord) => void;
  setHistory: (scans: ScanRecord[]) => void;
}

export const useScanStore = create<ScanStore>()(
  persist(
    (set) => ({
      currentScan: null,
      scanHistory: [],
      setCurrentScan: (scan) => set({ currentScan: scan }),
      addToHistory: (scan) =>
        set((state) => ({ scanHistory: [scan, ...state.scanHistory] })),
      setHistory: (scans) => set({ scanHistory: scans }),
    }),
    {
      name: 'glowup-scans',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/** Returns fractional days since the most recent scan, or null if no scans. */
export function daysSinceLastScan(history: ScanRecord[]): number | null {
  if (history.length === 0) return null;
  const latest = history[0]; // history is desc by createdAt
  const msPerDay = 1000 * 60 * 60 * 24;
  return (Date.now() - new Date(latest.createdAt).getTime()) / msPerDay;
}

/** Returns the count of scans whose createdAt is within the last n days. */
export function scansInLastNDays(history: ScanRecord[], n: number): number {
  const cutoff = Date.now() - n * 24 * 60 * 60 * 1000;
  return history.filter((s) => new Date(s.createdAt).getTime() >= cutoff).length;
}

/**
 * Returns up to the last n overall_score values, oldest first.
 * history is assumed sorted desc (newest first).
 */
export function scoreHistoryLastN(history: ScanRecord[], n: number): number[] {
  return history
    .slice(0, n)
    .map((s) => s.overall_score)
    .reverse();
}
