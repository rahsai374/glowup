import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ProductSuitability } from '@/lib/productTypes';

type Tier = 'topPick' | 'strong' | 'good' | 'caution' | 'avoid';

function getTier(score: number, suitability: ProductSuitability): Tier {
  if (suitability === 'avoid') return 'avoid';
  if (suitability === 'caution') return 'caution';
  if (score >= 95) return 'topPick';
  if (score >= 85) return 'strong';
  return 'good';
}

const TIER_STYLE: Record<Tier, { bg: string; text: string; border: string; emoji: string; key: string }> = {
  topPick: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', emoji: '⭐', key: 'tier_top_pick' },
  strong:  { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', emoji: '✓',  key: 'tier_strong_match' },
  good:    { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', emoji: '✓',  key: 'tier_good_match' },
  caution: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', emoji: '⚠',  key: 'tier_caution' },
  avoid:   { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA', emoji: '✕',  key: 'tier_avoid' },
};

export interface ProductScoreBadgeProps {
  score: number;
  suitability: ProductSuitability;
}

export function ProductScoreBadge({ score, suitability }: ProductScoreBadgeProps) {
  const { t, i18n } = useTranslation();
  const hindi = i18n.language === 'hi';
  const tier = getTier(score, suitability);
  const style = TIER_STYLE[tier];
  const label = t(style.key);
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: style.bg,
        borderColor: style.border,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 12 }}>{style.emoji}</Text>
      <Text
        style={{
          fontFamily: hindi ? 'Hind_600SemiBold' : 'PlusJakartaSans_700Bold',
          fontSize: 11,
          color: style.text,
          letterSpacing: hindi ? 0 : 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
