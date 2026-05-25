import { selectDailyTip } from '../home/selectDailyTip';
import { MicroTip, SkinConcern } from '../home/types';

const makeTip = (id: string, concerns: SkinConcern[]): MicroTip => ({
  id,
  emoji: '✨',
  category: 'Test',
  title: `Tip ${id}`,
  body: `Body ${id}`,
  concerns,
});

const TIPS: MicroTip[] = [
  makeTip('acne-1', ['acne']),
  makeTip('acne-2', ['acne']),
  makeTip('general-1', ['general']),
  makeTip('general-2', ['general']),
  makeTip('spots-1', ['darkSpots']),
];

describe('selectDailyTip', () => {
  it('filters by userConcern and picks deterministically', () => {
    const tip = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 1 });
    expect(tip.concerns).toContain('acne');
  });

  it('returns a different tip for a different dayOfYear (modulo rotation)', () => {
    const tip1 = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 1 });
    const tip2 = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 2 });
    // 2 acne tips: day 1 → index 1%2=1, day 2 → index 2%2=0 — different
    expect(tip1.id).not.toBe(tip2.id);
  });

  it('returns same tip for same dayOfYear (deterministic)', () => {
    const tip1 = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 42 });
    const tip2 = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 42 });
    expect(tip1.id).toBe(tip2.id);
  });

  it('falls back to general tips when userConcern is null', () => {
    const tip = selectDailyTip({ tips: TIPS, userConcern: null, dayOfYear: 1 });
    expect(tip.concerns).toContain('general');
  });

  it('falls back to general when concern has no matching tips', () => {
    const tip = selectDailyTip({ tips: TIPS, userConcern: 'dullness', dayOfYear: 1 });
    expect(tip.concerns).toContain('general');
  });

  it('returns a tip even when dayOfYear is 1 (no off-by-one crash)', () => {
    expect(() =>
      selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 1 })
    ).not.toThrow();
  });
});
