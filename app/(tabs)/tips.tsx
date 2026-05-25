import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/stores/useUserStore';
import AmbientBlobs from '@/components/AmbientBlobs';

const CONCERNS = [
  { label: 'Acne', icon: '🔴', color: '#FEE2E2' },
  { label: 'Dark Spots', icon: '🟤', color: '#FEF3C7' },
  { label: 'Dryness', icon: '💧', color: '#DBEAFE' },
  { label: 'Anti-aging', icon: '⏳', color: '#F3E8FF' },
];

const TIPS = [
  { emoji: '☀️', category: 'Sun Protection', title: 'Apply SPF 30+ every morning', body: 'Even on cloudy days, UV rays penetrate and cause premature aging and dark spots.' },
  { emoji: '💧', category: 'Hydration', title: 'Double cleanse at night', body: 'Oil cleanser followed by water cleanser removes sunscreen, makeup, and impurities thoroughly.' },
  { emoji: '🌙', category: 'Night Routine', title: 'Retinol — the gold standard', body: 'Start with 0.025% retinol 2x per week to boost cell turnover and fade hyperpigmentation.' },
  { emoji: '🥗', category: 'Diet', title: 'Eat antioxidant-rich foods', body: 'Vitamin C from citrus and turmeric from Indian spices help brighten and protect skin from within.' },
  { emoji: '😴', category: 'Lifestyle', title: '7–9 hours of sleep', body: 'Skin repairs itself overnight. Poor sleep raises cortisol, causing breakouts and dullness.' },
  { emoji: '🧖🏽‍♀️', category: 'Weekly Care', title: 'Exfoliate once a week', body: 'A gentle AHA/BHA exfoliant removes dead cells and allows your serums to absorb better.' },
];

export default function TipsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />
      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 30, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 4 }}>
          {t('tips_title')}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'Fraunces_700Bold_Italic', color: 'rgba(45,24,16,0.5)', marginBottom: 28 }}>
          Personalized for {user?.name || 'you'}
        </Text>

        <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 12 }}>
          Browse by Concern
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
          {CONCERNS.map((c, i) => (
            <Animated.View
              key={c.label}
              entering={FadeInDown.delay(i * 60).springify()}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: c.color,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Text style={{ fontSize: 16 }}>{c.icon}</Text>
                <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 12 }}>
          Daily Tips
        </Text>
        {TIPS.map((tip, i) => (
          <Animated.View
            key={tip.title}
            entering={FadeInDown.delay(i * 80).springify()}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 18,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: 'rgba(224,120,86,0.08)',
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <View
              style={{
                backgroundColor: '#FFF5EE',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
                alignSelf: 'flex-start',
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#E07856', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {tip.category}
              </Text>
            </View>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>{tip.emoji}</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 6 }}>
              {tip.title}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.65)', lineHeight: 20 }}>
              {tip.body}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}
