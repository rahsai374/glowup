// stores/useRoutineStore.ts
import { create } from 'zustand';

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

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  completions: {},
  toggleStep: (date, period, stepId) =>
    set({ completions: computeToggleStep(get().completions, date, period, stepId) }),
  markTipDone: (date, tipId) =>
    set({ completions: computeMarkTipDone(get().completions, date, tipId) }),
}));
