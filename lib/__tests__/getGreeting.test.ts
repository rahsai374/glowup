import { getGreeting } from '../home/getGreeting';

describe('getGreeting', () => {
  it('returns morning for hour 5', () => {
    expect(getGreeting(5)).toBe('morning');
  });
  it('returns morning for hour 11', () => {
    expect(getGreeting(11)).toBe('morning');
  });
  it('returns afternoon for hour 12', () => {
    expect(getGreeting(12)).toBe('afternoon');
  });
  it('returns afternoon for hour 16', () => {
    expect(getGreeting(16)).toBe('afternoon');
  });
  it('returns evening for hour 17', () => {
    expect(getGreeting(17)).toBe('evening');
  });
  it('returns evening for hour 21', () => {
    expect(getGreeting(21)).toBe('evening');
  });
  it('returns night for hour 22', () => {
    expect(getGreeting(22)).toBe('night');
  });
  it('returns night for hour 4', () => {
    expect(getGreeting(4)).toBe('night');
  });
  it('returns night for hour 0', () => {
    expect(getGreeting(0)).toBe('night');
  });
});
