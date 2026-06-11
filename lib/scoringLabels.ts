import type { TFunction } from 'i18next';

export const CONCERN_I18N_KEYS: Record<string, string> = {
  acne: 'concern_acne',
  dark_spots: 'concern_dark_spots',
  pigmentation: 'concern_pigmentation',
  dryness: 'concern_dryness',
  anti_aging: 'concern_anti_aging',
};

export function concernLabel(t: TFunction, value: string | undefined): string {
  if (!value) return '';
  const key = CONCERN_I18N_KEYS[value];
  if (key) return t(key);
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function truncateWin(value: string | undefined, maxChars = 32): string {
  if (!value) return '';
  const clean = value.trim();
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, maxChars - 1).trimEnd() + '…';
}
