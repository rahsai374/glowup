import { MicroTip, SkinConcern } from './types';

interface SelectDailyTipArgs {
  tips: MicroTip[];
  userConcern: SkinConcern | null;
  dayOfYear: number; // 1–366, caller provides — no date logic here
}

/**
 * Selects a daily tip deterministically based on concern and day of year.
 * Falls back to 'general' tips when concern is null or yields no results.
 */
export function selectDailyTip({ tips, userConcern, dayOfYear }: SelectDailyTipArgs): MicroTip {
  let filtered = userConcern ? tips.filter((t) => t.concerns.includes(userConcern)) : [];

  if (filtered.length === 0) {
    filtered = tips.filter((t) => t.concerns.includes('general'));
  }

  // Safety: if still empty (malformed data), return first tip
  if (filtered.length === 0) return tips[0];

  return filtered[dayOfYear % filtered.length];
}
