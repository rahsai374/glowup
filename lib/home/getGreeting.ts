// lib/home/getGreeting.ts

export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Returns the greeting period for a given local hour (0-23).
 * Caller maps the result to an i18n key.
 */
export function getGreeting(hour: number): GreetingPeriod {
  if (hour >= 5 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 16) return 'afternoon';
  if (hour >= 17 && hour <= 21) return 'evening';
  return 'night';
}
