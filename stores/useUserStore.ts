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

interface UserStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  updateUser: (partial) =>
    set((state) => ({ user: state.user ? { ...state.user, ...partial } : null })),
  setLanguage: (lang) =>
    set((state) => ({ user: state.user ? { ...state.user, language: lang } : null })),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
