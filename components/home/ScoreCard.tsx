import React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface ScoreCardProps {
  currentScore: number;
  previousScore: number | null;
  onPress: () => void;
  onScanPress: () => void;
}

export default function ScoreCard({ currentScore, previousScore, onPress, onScanPress }: ScoreCardProps) {
  const { t } = useTranslation();
  const delta = previousScore !== null ? currentScore - previousScore : null;
  const pressScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));

  const deltaLabel = () => {
    if (delta === null) return null;
    if (delta > 0) return `▲ +${Math.round(delta)}`;
    if (delta < 0) return `▼ ${Math.round(Math.abs(delta))}`;
    return '—';
  };

  const subtitle = () => {
    if (delta === null) return t('score_trend_baseline');
    if (delta > 0) return t('score_trend_up');
    if (delta < 0) return t('score_trend_down');
    return t('score_trend_same');
  };

  const deltaBg = () => {
    if (delta === null) return 'transparent';
    if (delta > 0) return '#DCFCE7';
    if (delta < 0) return '#FEF3C7';
    return '#F5F5F4';
  };

  const deltaColor = () => {
    if (delta === null) return '#2D1810';
    if (delta > 0) return '#16A34A';
    if (delta < 0) return '#D97706';
    return '#78716C';
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
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(45,24,16,0.45)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
          {t('glow_score')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 48, fontFamily: 'Fraunces_700Bold', color: '#E07856', lineHeight: 56 }}>
              {Math.round(currentScore)}
            </Text>
            {delta !== null && (
              <View style={{ backgroundColor: deltaBg(), borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: deltaColor() }}>
                  {deltaLabel()}
                </Text>
              </View>
            )}
          </View>
          <Animated.View style={buttonStyle}>
            <Pressable
              onPress={onScanPress}
              onPressIn={() => { pressScale.value = withSpring(0.96); }}
              onPressOut={() => { pressScale.value = withSpring(1); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                backgroundColor: '#E07856',
                borderRadius: 999,
                paddingHorizontal: 20,
                paddingVertical: 12,
                shadowColor: '#E07856',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'white' }}>
                ✨ {t('scan_again')}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.55)', marginTop: 8 }}>
          {subtitle()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
