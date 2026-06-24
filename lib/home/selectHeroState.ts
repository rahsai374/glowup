import { HeroState } from './types';

export interface SelectHeroStateArgs {
  scanCount: number;
  daysSinceLastScan: number | null;
  lastScanTopConcern: string | null;
  nowHour: number;
  routineToday: {
    am: { done: number; total: number };
    pm: { done: number; total: number };
  };
  focusTip?: string;
}

/**
 * Derives the correct dynamic hero card state from app context.
 * Precedence: first-scan → routine-in-progress → stale-scan → fresh-scan → default-rescan
 */
export function selectHeroState(args: SelectHeroStateArgs): HeroState {
  const { scanCount, daysSinceLastScan, lastScanTopConcern, nowHour, routineToday, focusTip } = args;

  // 1. No scans at all
  if (scanCount === 0) return { kind: 'first-scan' };

  // 2. Morning routine incomplete
  if (nowHour >= 5 && nowHour <= 11 && routineToday.am.done < routineToday.am.total) {
    return {
      kind: 'routine-in-progress',
      period: 'am',
      done: routineToday.am.done,
      total: routineToday.am.total,
      focusTip,
    };
  }

  // 3. Evening routine incomplete
  if (nowHour >= 18 && nowHour <= 23 && routineToday.pm.done < routineToday.pm.total) {
    return {
      kind: 'routine-in-progress',
      period: 'pm',
      done: routineToday.pm.done,
      total: routineToday.pm.total,
      focusTip,
    };
  }

  // 4. Stale scan (> 7 days)
  if (daysSinceLastScan !== null && daysSinceLastScan > 7) {
    return { kind: 'stale-scan', daysSince: Math.round(daysSinceLastScan) };
  }

  // 5. Fresh scan (< 1 day) with a valid concern
  if (daysSinceLastScan !== null && daysSinceLastScan < 1 && lastScanTopConcern !== null) {
    return { kind: 'fresh-scan', topConcern: lastScanTopConcern };
  }

  return { kind: 'default-rescan' };
}
