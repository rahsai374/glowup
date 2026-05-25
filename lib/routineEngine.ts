import { STEP_POOL, RoutineStep, SkinType, Concern } from './routineData';

const VALID_CONCERNS: Concern[] = [
  'acne', 'dark_spots', 'pigmentation', 'dryness', 'anti_aging',
];

export function validateConcern(raw: string): Concern {
  return (VALID_CONCERNS as string[]).includes(raw) ? (raw as Concern) : 'all';
}

export interface RoutineByTime {
  morning: RoutineStep[];
  night: RoutineStep[];
  weekly: RoutineStep[];
}

export function getRoutine(skinType: string, topConcern: string): RoutineByTime {
  const concern = validateConcern(topConcern);
  const st = skinType as SkinType;

  const matchesStep = (step: RoutineStep): boolean => {
    const skinMatch =
      step.skinTypes.includes(st) || step.skinTypes.includes('all');
    const concernMatch =
      step.concerns.includes(concern) || step.concerns.includes('all');
    return skinMatch && concernMatch;
  };

  const sorted = STEP_POOL.filter(matchesStep).sort(
    (a, b) => a.priority - b.priority
  );

  const morning = sorted.filter(s => s.timeOfDay === 'morning');
  const night   = sorted.filter(s => s.timeOfDay === 'night');
  const weekly  = sorted.filter(s => s.timeOfDay === 'weekly');

  // Backfill: if any slot has fewer than 2 steps, add 'all'-concern base steps
  const backfill = (
    slot: RoutineStep[],
    time: 'morning' | 'night' | 'weekly'
  ): RoutineStep[] => {
    if (slot.length >= 2) return slot;
    const extras = STEP_POOL.filter(
      s =>
        s.timeOfDay === time &&
        (s.skinTypes.includes(st) || s.skinTypes.includes('all')) &&
        s.concerns.includes('all') &&
        !slot.some(existing => existing.id === s.id)
    );
    return [...slot, ...extras].sort((a, b) => a.priority - b.priority);
  };

  return {
    morning: backfill(morning, 'morning'),
    night:   backfill(night, 'night'),
    weekly:  backfill(weekly, 'weekly'),
  };
}
