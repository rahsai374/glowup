import type { Product, ProductSuitability } from './productTypes';
import type { ScanResult } from './gemini';

const DAMPING_FACTOR = 0.75;
export const MAX_SCORE = 85;
const MAX_CONCERN_BONUS = 15;

export interface PersonalizedScore {
  matchScore: number;
  suitability: ProductSuitability;
  concernMatches: string[];
}

function getConcernSeverity(
  concern: string,
  metrics: ScanResult['metrics']
): number {
  switch (concern) {
    case 'acne':
      return metrics.blemish_prone;
    case 'dark_spots':
      return metrics.dark_spots;
    case 'pigmentation':
      return (metrics.dark_spots + (100 - metrics.radiance)) / 2;
    case 'dryness':
      return 100 - metrics.hydration;
    case 'anti_aging':
      return (metrics.wrinkles + (100 - metrics.firmness)) / 2;
    default:
      return 0;
  }
}

function severityToBonus(severity: number): number {
  if (severity > 60) return 5;
  if (severity > 40) return 3;
  return 1;
}

function scoreToSuitability(score: number): ProductSuitability {
  if (score >= 70) return 'excellent';
  if (score >= 55) return 'good';
  if (score >= 35) return 'caution';
  return 'avoid';
}

export function getPersonalizedScore(
  product: Product,
  scanResult: ScanResult | null
): PersonalizedScore {
  if (!scanResult) {
    const bestScore = Math.max(
      ...Object.values(product.skinTypeMatch).map((m) => m.matchScore)
    );
    const baseScore = Math.round(bestScore * DAMPING_FACTOR);
    const clamped = Math.max(0, Math.min(MAX_SCORE, baseScore));
    return {
      matchScore: clamped,
      suitability: scoreToSuitability(clamped),
      concernMatches: [],
    };
  }

  const skinType = scanResult.skin_type;
  const staticMatch =
    product.skinTypeMatch[skinType] ?? product.skinTypeMatch['all'];
  const baseScore = Math.round(staticMatch.matchScore * DAMPING_FACTOR);

  const concernMatches: string[] = [];
  let totalBonus = 0;

  for (const concern of product.concerns) {
    const severity = getConcernSeverity(concern, scanResult.metrics);
    if (severity === 0) continue; // unrecognized concern — no bonus, no match
    const bonus = severityToBonus(severity);
    totalBonus += bonus;
    concernMatches.push(concern);
  }

  const cappedBonus = Math.min(totalBonus, MAX_CONCERN_BONUS);
  const finalScore = Math.max(0, Math.min(MAX_SCORE, baseScore + cappedBonus));

  return {
    matchScore: finalScore,
    suitability: scoreToSuitability(finalScore),
    concernMatches,
  };
}
