import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import Sparkline from './Sparkline';

interface ScoreTrendCardProps {
  currentScore: number;
  previousScore: number | null;
  history: number[]; // oldest first, up to 7 values
  onPress: () => void;
}

export default function ScoreTrendCard({ currentScore, previousScore, history, onPress }: ScoreTrendCardProps) {
  const { t } = useTranslation();
  const delta = previousScore !== null ? currentScore - previousScore : null;

  const deltaLabel = () => {
    if (delta === null) return null;
    if (delta > 0) return `▲ +${Math.round(delta)}`;
    if (delta < 0) return `▼ ${Math.round(Math.abs(delta))}`;
    return '— same';
  };

  const deltaBg = () => {
    if (delta === null) return 'transparent';
    if (delta > 0) return '#DCFCE7';
    if (delta < 0) return '#FEF3C7';
    return '#F5F5F4';
  };

  const deltaColor = () => {
    if (delta === null) return '#2D1810';
    if (delta > 0) return '#4ADE80';
    if (delta < 0) return '#D97706';
    return '#78716C';
  };

  const subtitle = () => {
    if (delta === null) return t('score_trend_baseline');
    if (delta > 0) return t('score_trend_up');
    if (delta < 0) return t('score_trend_down');
    return t('score_trend_same');
  };

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 20,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: 'rgba(224,120,86,0.08)',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Score + delta */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 48, fontFamily: 'Fraunces_700Bold', color: '#E07856', lineHeight: 56 }}>
              {currentScore}
            </Text>
            {delta !== null && (
              <View style={{ backgroundColor: deltaBg(), borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: deltaColor() }}>
                  {deltaLabel()}
                </Text>
              </View>
            )}
          </View>
          {/* Sparkline */}
          <Sparkline data={history} width={80} height={28} color="#E07856" />
        </View>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.55)', marginTop: 8 }}>
          {subtitle()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
