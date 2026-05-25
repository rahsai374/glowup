import { validateConcern, getRoutine } from '../routineEngine';

describe('validateConcern', () => {
  it('returns valid concern as-is', () => {
    expect(validateConcern('acne')).toBe('acne');
    expect(validateConcern('dark_spots')).toBe('dark_spots');
    expect(validateConcern('pigmentation')).toBe('pigmentation');
    expect(validateConcern('dryness')).toBe('dryness');
    expect(validateConcern('anti_aging')).toBe('anti_aging');
  });

  it('returns all for any unknown string', () => {
    expect(validateConcern('random string')).toBe('all');
    expect(validateConcern('')).toBe('all');
    expect(validateConcern('uneven skin tone')).toBe('all');
  });
});

describe('getRoutine', () => {
  it('returns steps grouped by time of day', () => {
    const result = getRoutine('oily', 'acne');
    expect(result).toHaveProperty('morning');
    expect(result).toHaveProperty('night');
    expect(result).toHaveProperty('weekly');
  });

  it('morning steps include oily cleanser for oily skin', () => {
    const { morning } = getRoutine('oily', 'acne');
    expect(morning.some(s => s.id === 'morning-cleanse-oily')).toBe(true);
  });

  it('does not include oily cleanser for dry skin', () => {
    const { morning } = getRoutine('dry', 'acne');
    expect(morning.some(s => s.id === 'morning-cleanse-oily')).toBe(false);
    expect(morning.some(s => s.id === 'morning-cleanse-dry')).toBe(true);
  });

  it('includes concern-specific steps when concern matches', () => {
    const { morning } = getRoutine('oily', 'acne');
    expect(morning.some(s => s.id === 'morning-acne-spot-oily')).toBe(true);
  });

  it('does not include acne steps when concern is dryness', () => {
    const { morning } = getRoutine('oily', 'dryness');
    expect(morning.some(s => s.id === 'morning-acne-spot-oily')).toBe(false);
    expect(morning.some(s => s.id === 'morning-dryness-treatment')).toBe(true);
  });

  it('steps are sorted by priority within each slot', () => {
    const { morning } = getRoutine('oily', 'acne');
    for (let i = 1; i < morning.length; i++) {
      expect(morning[i].priority).toBeGreaterThanOrEqual(morning[i - 1].priority);
    }
  });

  it('every skin type + concern combo has at least 2 morning and 2 night steps', () => {
    const skinTypes = ['oily', 'dry', 'combination', 'normal'] as const;
    const concerns = ['acne', 'dark_spots', 'pigmentation', 'dryness', 'anti_aging', 'all'] as const;
    for (const st of skinTypes) {
      for (const c of concerns) {
        const { morning, night, weekly } = getRoutine(st, c);
        expect(morning.length).toBeGreaterThanOrEqual(2);
        expect(night.length).toBeGreaterThanOrEqual(2);
        expect(weekly.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('unknown concern falls back to all-concern routine', () => {
    const result1 = getRoutine('oily', 'all');
    const result2 = getRoutine('oily', 'unknown_thing');
    expect(result1.morning.length).toBe(result2.morning.length);
    expect(result1.night.length).toBe(result2.night.length);
  });
});
