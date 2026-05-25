import { todayProgress, weeklyConsistency, computeToggleStep, computeMarkTipDone } from '../../stores/useRoutineStore';

type Completions = Record<string, { am: string[]; pm: string[]; tips: string[] }>;

const AM_STEPS = ['step-a', 'step-b', 'step-c'];
const PM_STEPS = ['step-d', 'step-e'];

describe('todayProgress', () => {
  it('returns 0 done for empty completions', () => {
    const result = todayProgress({}, '2026-05-25', AM_STEPS, PM_STEPS);
    expect(result).toEqual({ am: { done: 0, total: 3 }, pm: { done: 0, total: 2 } });
  });

  it('counts completed steps for today', () => {
    const completions: Completions = {
      '2026-05-25': { am: ['step-a', 'step-b'], pm: ['step-d'], tips: [] },
    };
    const result = todayProgress(completions, '2026-05-25', AM_STEPS, PM_STEPS);
    expect(result).toEqual({ am: { done: 2, total: 3 }, pm: { done: 1, total: 2 } });
  });

  it('ignores other dates', () => {
    const completions: Completions = {
      '2026-05-24': { am: ['step-a', 'step-b', 'step-c'], pm: ['step-d', 'step-e'], tips: [] },
    };
    const result = todayProgress(completions, '2026-05-25', AM_STEPS, PM_STEPS);
    expect(result.am.done).toBe(0);
  });
});

describe('weeklyConsistency', () => {
  it('returns 0 for no completions', () => {
    expect(weeklyConsistency({}, AM_STEPS, PM_STEPS)).toBe(0);
  });

  it('returns 100 for all steps done every day this week', () => {
    const completions: Completions = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      completions[key] = { am: [...AM_STEPS], pm: [...PM_STEPS], tips: ['some-tip'] };
    }
    expect(weeklyConsistency(completions, AM_STEPS, PM_STEPS)).toBe(100);
  });
});

describe('computeToggleStep', () => {
  it('adds a step id when not present', () => {
    const result = computeToggleStep({}, '2026-05-25', 'am', 'step-a');
    expect(result['2026-05-25'].am).toContain('step-a');
  });

  it('removes a step id when already present (toggle off)', () => {
    const existing: Completions = { '2026-05-25': { am: ['step-a'], pm: [], tips: [] } };
    const result = computeToggleStep(existing, '2026-05-25', 'am', 'step-a');
    expect(result['2026-05-25'].am).not.toContain('step-a');
  });
});

describe('computeMarkTipDone', () => {
  it('adds tip id to completions', () => {
    const result = computeMarkTipDone({}, '2026-05-25', 'tip-123');
    expect(result['2026-05-25'].tips).toContain('tip-123');
  });

  it('is idempotent — does not duplicate', () => {
    const existing: Completions = { '2026-05-25': { am: [], pm: [], tips: ['tip-123'] } };
    const result = computeMarkTipDone(existing, '2026-05-25', 'tip-123');
    expect(result['2026-05-25'].tips.filter((t) => t === 'tip-123')).toHaveLength(1);
  });
});
