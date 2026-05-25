import { selectHeroState, SelectHeroStateArgs } from '../home/selectHeroState';

const base: SelectHeroStateArgs = {
  scanCount: 1,
  daysSinceLastScan: 3,
  lastScanTopConcern: 'Dark spots',
  nowHour: 14,
  routineToday: {
    am: { done: 2, total: 3 },
    pm: { done: 0, total: 3 },
  },
};

describe('selectHeroState', () => {
  it('returns first-scan when scanCount is 0', () => {
    const result = selectHeroState({ ...base, scanCount: 0 });
    expect(result).toEqual({ kind: 'first-scan' });
  });

  it('returns routine-in-progress am when morning and am routine incomplete', () => {
    const result = selectHeroState({
      ...base,
      nowHour: 8,
      routineToday: { am: { done: 1, total: 4 }, pm: { done: 0, total: 4 } },
    });
    expect(result).toEqual({ kind: 'routine-in-progress', period: 'am', done: 1, total: 4 });
  });

  it('does NOT return routine-in-progress am when morning routine is complete', () => {
    const result = selectHeroState({
      ...base,
      nowHour: 9,
      routineToday: { am: { done: 3, total: 3 }, pm: { done: 0, total: 3 } },
    });
    expect(result.kind).not.toBe('routine-in-progress');
  });

  it('returns routine-in-progress pm when evening and pm routine incomplete', () => {
    const result = selectHeroState({
      ...base,
      nowHour: 20,
      daysSinceLastScan: 3,
      routineToday: { am: { done: 3, total: 3 }, pm: { done: 1, total: 4 } },
    });
    expect(result).toEqual({ kind: 'routine-in-progress', period: 'pm', done: 1, total: 4 });
  });

  it('returns stale-scan when last scan is more than 7 days ago', () => {
    const result = selectHeroState({ ...base, daysSinceLastScan: 9, nowHour: 14 });
    expect(result).toEqual({ kind: 'stale-scan', daysSince: 9 });
  });

  it('returns fresh-scan when scan is <1 day old and has topConcern', () => {
    const result = selectHeroState({
      ...base,
      daysSinceLastScan: 0.5,
      lastScanTopConcern: 'Dark spots',
      nowHour: 14,
    });
    expect(result).toEqual({ kind: 'fresh-scan', topConcern: 'Dark spots' });
  });

  it('falls through to default-rescan when scan is fresh but topConcern is null', () => {
    const result = selectHeroState({
      ...base,
      daysSinceLastScan: 0.5,
      lastScanTopConcern: null,
      nowHour: 14,
    });
    expect(result).toEqual({ kind: 'default-rescan' });
  });

  it('returns default-rescan for a 3-day-old scan at afternoon', () => {
    const result = selectHeroState({ ...base, nowHour: 14, daysSinceLastScan: 3 });
    expect(result).toEqual({ kind: 'default-rescan' });
  });

  it('first-scan takes priority over everything else', () => {
    const result = selectHeroState({
      ...base,
      scanCount: 0,
      daysSinceLastScan: 0.1,
      nowHour: 8,
    });
    expect(result).toEqual({ kind: 'first-scan' });
  });
});
