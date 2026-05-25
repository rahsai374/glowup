export type SkinConcern =
  | 'acne'
  | 'darkSpots'
  | 'dryness'
  | 'aging'
  | 'dullness'
  | 'general';

export interface MicroTip {
  id: string;
  emoji: string;
  category: string;
  title: string;
  body: string;
  concerns: SkinConcern[];
}

export type HeroState =
  | { kind: 'first-scan' }
  | { kind: 'routine-in-progress'; period: 'am' | 'pm'; done: number; total: number }
  | { kind: 'stale-scan'; daysSince: number }
  | { kind: 'fresh-scan'; topConcern: string }
  | { kind: 'default-rescan' };
