import { create } from 'zustand';
import { ScanResult } from '@/lib/gemini';

export interface ScanRecord extends ScanResult {
  id: string;
  createdAt: Date;
  imageUrl?: string;
}

interface ScanStore {
  currentScan: ScanRecord | null;
  scanHistory: ScanRecord[];
  setCurrentScan: (scan: ScanRecord) => void;
  addToHistory: (scan: ScanRecord) => void;
  setHistory: (scans: ScanRecord[]) => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  currentScan: null,
  scanHistory: [],
  setCurrentScan: (scan) => set({ currentScan: scan }),
  addToHistory: (scan) =>
    set((state) => ({ scanHistory: [scan, ...state.scanHistory] })),
  setHistory: (scans) => set({ scanHistory: scans }),
}));
