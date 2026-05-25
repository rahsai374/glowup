import { create } from 'zustand';

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  language: 'en' | 'hi';
  skinType: string;
  mainConcern: string;
  waterIntake: string;
  sunscreenHabit: string;
  ageRange: string;
}

export interface StreakData {
  current: number;
  lastOpenedAt: string; // YYYY-MM-DD local date
}

interface UserStore {
  user: UserProfile | null;
  streak: StreakData;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  tickStreak: () => void;
  logout: () => void;
}

/** Pure function — exported for testing. Returns the next streak state given today's local date string. */
export function computeNextStreak(streak: StreakData, today: string): StreakData {
  if (streak.lastOpenedAt === today) return streak;

  const last = streak.lastOpenedAt ? new Date(streak.lastOpenedAt) : null;
  const todayDate = new Date(today);

  if (last) {
    const diffDays = (todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diffDays) === 1) {
      return { current: streak.current + 1, lastOpenedAt: today };
    }
  }

  return { current: 1, lastOpenedAt: today };
}

function localDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  streak: { current: 0, lastOpenedAt: '' },
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  updateUser: (partial) =>
    set((state) => ({ user: state.user ? { ...state.user, ...partial } : null })),
  setLanguage: (lang) =>
    set((state) => ({ user: state.user ? { ...state.user, language: lang } : null })),
  tickStreak: () => {
    const today = localDateString();
    const next = computeNextStreak(get().streak, today);
    set({ streak: next });
  },
  logout: () => set({ user: null, isAuthenticated: false, streak: { current: 0, lastOpenedAt: '' } }),
}));
