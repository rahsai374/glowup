import { rescoreSkinMatch } from '../../scripts/rescore-products';

describe('rescoreSkinMatch', () => {
  it('maps an excellent 95 into the 78-85 tier proportionally', () => {
    const out = rescoreSkinMatch({ suitability: 'excellent', matchScore: 95 }, ['dermat-recommended']);
    expect(out.suitability).toBe('excellent');
    expect(out.matchScore).toBeLessThanOrEqual(85);
    expect(out.matchScore).toBeGreaterThanOrEqual(78);
  });

  it('gives dermat-recommended products the top of the excellent band', () => {
    const a = rescoreSkinMatch({ suitability: 'excellent', matchScore: 90 }, ['dermat-recommended']);
    const b = rescoreSkinMatch({ suitability: 'excellent', matchScore: 90 }, ['bestseller']);
    expect(a.matchScore).toBeGreaterThan(b.matchScore);
  });

  it('maps good (70-89 raw) into 65-77 tier', () => {
    const out = rescoreSkinMatch({ suitability: 'good', matchScore: 85 }, []);
    expect(out.matchScore).toBeGreaterThanOrEqual(65);
    expect(out.matchScore).toBeLessThanOrEqual(77);
  });

  it('maps caution into 45-59 tier', () => {
    const out = rescoreSkinMatch({ suitability: 'caution', matchScore: 55 }, []);
    expect(out.matchScore).toBeGreaterThanOrEqual(45);
    expect(out.matchScore).toBeLessThanOrEqual(59);
  });

  it('maps avoid into 25-44 tier', () => {
    const out = rescoreSkinMatch({ suitability: 'avoid', matchScore: 30 }, []);
    expect(out.matchScore).toBeGreaterThanOrEqual(25);
    expect(out.matchScore).toBeLessThanOrEqual(44);
  });

  it('preserves relative order: higher input maps to higher (or equal) output', () => {
    const a = rescoreSkinMatch({ suitability: 'excellent', matchScore: 95 }, ['bestseller']);
    const b = rescoreSkinMatch({ suitability: 'excellent', matchScore: 80 }, ['bestseller']);
    expect(a.matchScore).toBeGreaterThanOrEqual(b.matchScore);
  });

  it('never exceeds the base cap of 85', () => {
    const out = rescoreSkinMatch({ suitability: 'excellent', matchScore: 99 }, ['dermat-recommended']);
    expect(out.matchScore).toBeLessThanOrEqual(85);
  });
});
