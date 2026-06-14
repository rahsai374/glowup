import type { Product, ProductSuitability } from './productTypes';
import type { ScanResult } from './gemini';

const IRRELEVANCE_PENALTY = 0.7;
const PRE_SCAN_DAMPING = 0.85;
export const MAX_SCORE = 100;
const MAX_CONCERN_BONUS = 10;

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

function isRelevant(suitability: ProductSuitability): boolean {
  return suitability === 'excellent' || suitability === 'good';
}

function scoreToSuitability(score: number): ProductSuitability {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 45) return 'caution';
  return 'avoid';
}

export function getPersonalizedScore(
  product: Product,
  scanResult: ScanResult | null
): PersonalizedScore {
  if (!scanResult) {
    const bestMatch = Object.values(product.skinTypeMatch).reduce((a, b) =>
      a.matchScore > b.matchScore ? a : b
    );
    const baseScore = isRelevant(bestMatch.suitability)
      ? Math.round(bestMatch.matchScore * PRE_SCAN_DAMPING)
      : Math.round(bestMatch.matchScore * IRRELEVANCE_PENALTY);
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
  const baseScore = isRelevant(staticMatch.suitability)
    ? Math.min(staticMatch.matchScore, MAX_SCORE - MAX_CONCERN_BONUS)
    : Math.round(staticMatch.matchScore * IRRELEVANCE_PENALTY);

  const concernMatches: string[] = [];
  let totalBonus = 0;

  for (const concern of product.concerns) {
    const severity = getConcernSeverity(concern, scanResult.metrics);
    if (severity === 0) continue;
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
