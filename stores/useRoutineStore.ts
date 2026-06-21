// stores/useRoutineStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '@/stores/useUserStore';

export type DateKey = string; // YYYY-MM-DD local

export type Completions = Record<DateKey, { am: string[]; pm: string[]; tips: string[] }>;

interface RoutineStore {
  completions: Completions;
  toggleStep: (date: DateKey, period: 'am' | 'pm', stepId: string) => void;
  markTipDone: (date: DateKey, tipId: string) => void;
}

function emptyDay(): { am: string[]; pm: string[]; tips: string[] } {
  return { am: [], pm: [], tips: [] };
}

/** Pure — exported for testing */
export function computeToggleStep(
  completions: Completions,
  date: DateKey,
  period: 'am' | 'pm',
  stepId: string
): Completions {
  const day = completions[date] ?? emptyDay();
  const current = day[period];
  const updated = current.includes(stepId)
    ? current.filter((id) => id !== stepId)
    : [...current, stepId];
  return { ...completions, [date]: { ...day, [period]: updated } };
}

/** Pure — exported for testing */
export function computeMarkTipDone(
  completions: Completions,
  date: DateKey,
  tipId: string
): Completions {
  const day = completions[date] ?? emptyDay();
  if (day.tips.includes(tipId)) return completions; // idempotent
  return { ...completions, [date]: { ...day, tips: [...day.tips, tipId] } };
}

/** Pure — exported for testing. todayStr is YYYY-MM-DD. */
export function todayProgress(
  completions: Completions,
  todayStr: DateKey,
  amStepIds: string[],
  pmStepIds: string[]
): { am: { done: number; total: number }; pm: { done: number; total: number } } {
  const day = completions[todayStr] ?? emptyDay();
  return {
    am: { done: amStepIds.filter((id) => day.am.includes(id)).length, total: amStepIds.length },
    pm: { done: pmStepIds.filter((id) => day.pm.includes(id)).length, total: pmStepIds.length },
  };
}

/** Pure — exported for testing. Returns 0-100. */
export function weeklyConsistency(
  completions: Completions,
  amStepIds: string[],
  pmStepIds: string[],
  today: Date = new Date()
): number {
  const stepsPerDay = amStepIds.length + pmStepIds.length + 1; // +1 tip bonus slot
  let totalDone = 0;
  let totalExpected = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const day = completions[key];
    totalExpected += stepsPerDay;
    if (day) {
      const amDone = amStepIds.filter((id) => day.am.includes(id)).length;
      const pmDone = pmStepIds.filter((id) => day.pm.includes(id)).length;
      const tipDone = day.tips.length > 0 ? 1 : 0;
      totalDone += amDone + pmDone + tipDone;
    }
  }

  if (totalExpected === 0) return 0;
  return Math.round((totalDone / totalExpected) * 100);
}

/** Pure — exported for testing. Counts consecutive days ending at `todayStr` that have ≥1 completion. */
export function computeRoutineStreak(completions: Completions, todayStr: DateKey): number {
  let streak = 0;
  const d = new Date(todayStr + 'T00:00:00');
  for (let i = 0; i < 365; i++) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const day = completions[key];
    if (day && (day.am.length > 0 || day.pm.length > 0)) {
      streak++;
    } else if (i > 0) {
      // Allow today (i===0) to be incomplete — streak counts up to yesterday + today if started
      break;
    } else {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      completions: {},
      toggleStep: (date, period, stepId) => {
        const prev = get().completions;
        const next = computeToggleStep(prev, date, period, stepId);
        set({ completions: next });

        // Tick streak on first completion of the day (not on unchecks)
        const prevDay = prev[date];
        const prevTotal = prevDay ? prevDay.am.length + prevDay.pm.length : 0;
        const nextDay = next[date];
        const nextTotal = nextDay ? nextDay.am.length + nextDay.pm.length : 0;
        if (prevTotal === 0 && nextTotal > 0) {
          useUserStore.getState().tickStreak();
        }
      },
      markTipDone: (date, tipId) =>
        set({ completions: computeMarkTipDone(get().completions, date, tipId) }),
    }),
    {
      name: 'glowup-routine',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
