/**
 * Pure deterministic functions for Today's Focus selection.
 * Same day → same result. No side effects, fully testable.
 */

import type { RoutineStep } from '@/lib/routineData';
import { FOCUS_TIPS, type FocusTip } from '@/lib/dailyFocusData';

export interface DailyFocus {
  /** The step spotlighted today */
  focusStepId: string;
  /** Today's micro-tip (related to the focus step when possible) */
  tip: FocusTip;
}

/** Day-of-year: 1–366. Pure — only depends on the date argument. */
function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Check if a tip is related to a step by comparing the tip's relatedTitles
 * against the step's title (case-insensitive).
 */
function tipMatchesStep(tip: FocusTip, step: RoutineStep): boolean {
  if (tip.relatedTitles.length === 0) return false;
  const stepTitleLower = step.title.toLowerCase();
  return tip.relatedTitles.some((t) => stepTitleLower.includes(t.toLowerCase()));
}

/**
 * Deterministic daily selection of a focus step + micro-tip.
 *
 * @param steps - The user's current routine steps (AM + PM only, not weekly)
 * @param date  - Defaults to today; pass a fixed date for testing
 * @returns     - The focus step ID and a related micro-tip
 */
export function getTodaysFocus(
  steps: RoutineStep[],
  date: Date = new Date(),
): DailyFocus | null {
  // Only consider AM/PM steps (not weekly — those aren't daily)
  const dailySteps = steps.filter((s) => s.timeOfDay !== 'weekly');
  if (dailySteps.length === 0) return null;

  const doy = dayOfYear(date);

  // Pick focus step: rotate through daily steps by day-of-year
  const stepIndex = doy % dailySteps.length;
  const focusStep = dailySteps[stepIndex];

  // Find tips related to this step
  const matchingTips = FOCUS_TIPS.filter((tip) => tipMatchesStep(tip, focusStep));

  let tip: FocusTip;
  if (matchingTips.length > 0) {
    // Rotate through matching tips
    const tipIndex = doy % matchingTips.length;
    tip = matchingTips[tipIndex];
  } else {
    // Fallback: pick from general tips (relatedTitles === [])
    const generalTips = FOCUS_TIPS.filter((t) => t.relatedTitles.length === 0);
    if (generalTips.length === 0) {
      // Ultimate fallback: first tip in pool
      tip = FOCUS_TIPS[0];
    } else {
      tip = generalTips[doy % generalTips.length];
    }
  }

  return { focusStepId: focusStep.id, tip };
}

/**
 * Get the focus step's title for notification/hero card display.
 * Pure convenience — avoids repeating the lookup in multiple call sites.
 */
export function getFocusStepTitle(
  steps: RoutineStep[],
  date: Date = new Date(),
): string | null {
  const focus = getTodaysFocus(steps, date);
  if (!focus) return null;
  const step = steps.find((s) => s.id === focus.focusStepId);
  return step?.title ?? null;
}
