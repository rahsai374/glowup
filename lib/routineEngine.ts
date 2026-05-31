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

export function getRoutine(
  skinType: string,
  topConcern: string,
  gender?: string,
): RoutineByTime {
  const concern = validateConcern(topConcern);
  const st = skinType as SkinType;
  const isMale = gender === 'male';

  const matchesStep = (step: RoutineStep): boolean => {
    const skinMatch =
      step.skinTypes.includes(st) || step.skinTypes.includes('all');
    const concernMatch =
      step.concerns.includes(concern) || step.concerns.includes('all');
    return skinMatch && concernMatch;
  };

  let sorted = STEP_POOL.filter(matchesStep).sort(
    (a, b) => a.priority - b.priority,
  );

  // Males get a simplified routine: drop priority-2 steps (toning,
  // spot treatments, concern-specific masks). Keeps cleanse (p1),
  // moisturise/nourish (p3), sunscreen (p4), exfoliate (p1).
  if (isMale) {
    sorted = sorted.filter((s) => s.priority !== 2);
  }

  const morning = sorted.filter((s) => s.timeOfDay === 'morning');
  const night = sorted.filter((s) => s.timeOfDay === 'night');
  const weekly = sorted.filter((s) => s.timeOfDay === 'weekly');

  // Backfill: ensure each slot has a minimum number of steps.
  // Males need only 1 step per slot; others need at least 2.
  const minSteps = isMale ? 1 : 2;
  const backfill = (
    slot: RoutineStep[],
    time: 'morning' | 'night' | 'weekly',
  ): RoutineStep[] => {
    if (slot.length >= minSteps) return slot;
    const extras = STEP_POOL.filter(
      (s) =>
        s.timeOfDay === time &&
        (!isMale || s.priority !== 2) &&
        (s.skinTypes.includes(st) || s.skinTypes.includes('all')) &&
        s.concerns.includes('all') &&
        !slot.some((existing) => existing.id === s.id),
    );
    return [...slot, ...extras].sort((a, b) => a.priority - b.priority);
  };

  return {
    morning: backfill(morning, 'morning'),
    night: backfill(night, 'night'),
    weekly: backfill(weekly, 'weekly'),
  };
}
