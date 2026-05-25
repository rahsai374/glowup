import { daysSinceLastScan, scansInLastNDays, scoreHistoryLastN } from '../../stores/useScanStore';
import { ScanRecord } from '../../stores/useScanStore';

const makeRecord = (daysAgo: number, score: number): ScanRecord => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: `scan-${daysAgo}`,
    overall_score: score,
    skin_type: 'oily',
    skin_age: 25,
    metrics: {
      hydration: 70, blemish_prone: 30, redness: 20, oiliness: 60,
      dark_spots: 25, radiance: 65, texture: 70, firmness: 75, wrinkles: 15, dark_circles: 30,
    },
    top_concern: 'Acne',
    top_win: 'Great hydration',
    advice: 'Keep going',
    createdAt: d,
  };
};

describe('useScanStore selectors', () => {
  describe('daysSinceLastScan', () => {
    it('returns null for empty history', () => {
      expect(daysSinceLastScan([])).toBeNull();
    });
    it('returns ~0 for a scan done today', () => {
      const result = daysSinceLastScan([makeRecord(0, 80)]);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result!).toBeLessThan(1);
    });
    it('returns ~3 for a scan done 3 days ago', () => {
      const result = daysSinceLastScan([makeRecord(3, 80)]);
      expect(result!).toBeGreaterThanOrEqual(2.9);
      expect(result!).toBeLessThan(4);
    });
  });

  describe('scansInLastNDays', () => {
    it('returns 0 for empty history', () => {
      expect(scansInLastNDays([], 7)).toBe(0);
    });
    it('counts scans within window', () => {
      const history = [makeRecord(1, 80), makeRecord(5, 75), makeRecord(10, 70)];
      expect(scansInLastNDays(history, 7)).toBe(2);
    });
    it('excludes scans outside window', () => {
      const history = [makeRecord(8, 80)];
      expect(scansInLastNDays(history, 7)).toBe(0);
    });
  });

  describe('scoreHistoryLastN', () => {
    it('returns empty array for empty history', () => {
      expect(scoreHistoryLastN([], 5)).toEqual([]);
    });
    it('returns scores oldest-first', () => {
      const history = [makeRecord(0, 85), makeRecord(3, 80), makeRecord(7, 75)];
      expect(scoreHistoryLastN(history, 3)).toEqual([75, 80, 85]);
    });
    it('limits to N scores', () => {
      const history = [
        makeRecord(0, 90), makeRecord(1, 85), makeRecord(2, 80),
        makeRecord(3, 75), makeRecord(4, 70), makeRecord(5, 65), makeRecord(6, 60), makeRecord(7, 55),
      ];
      const result = scoreHistoryLastN(history, 5);
      expect(result).toHaveLength(5);
      expect(result[result.length - 1]).toBe(90); // most recent is last
    });
  });
});
