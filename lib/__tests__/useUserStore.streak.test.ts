import { computeNextStreak } from '../../stores/useUserStore';

describe('computeNextStreak', () => {
  const today = '2026-05-25';
  const yesterday = '2026-05-24';
  const twoDaysAgo = '2026-05-23';

  it('is a no-op when lastOpenedAt is today', () => {
    const result = computeNextStreak({ current: 5, lastOpenedAt: today }, today);
    expect(result).toEqual({ current: 5, lastOpenedAt: today });
  });

  it('increments when lastOpenedAt is yesterday', () => {
    const result = computeNextStreak({ current: 5, lastOpenedAt: yesterday }, today);
    expect(result).toEqual({ current: 6, lastOpenedAt: today });
  });

  it('resets to 1 when gap is more than one day', () => {
    const result = computeNextStreak({ current: 10, lastOpenedAt: twoDaysAgo }, today);
    expect(result).toEqual({ current: 1, lastOpenedAt: today });
  });

  it('sets streak to 1 on first ever open (empty lastOpenedAt)', () => {
    const result = computeNextStreak({ current: 0, lastOpenedAt: '' }, today);
    expect(result).toEqual({ current: 1, lastOpenedAt: today });
  });
});
