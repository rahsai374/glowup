import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import AmbientBlobs from '@/components/AmbientBlobs';
import { logEvent, EVENTS } from '@/lib/analytics';

const { width } = Dimensions.get('window');

const slides = [
  { key: 'onboarding_1', icon: '🔬', title: 'onboarding_1_title', body: 'onboarding_1_body', chips: ['Hydration 71', 'Radiance 78', 'Wrinkles 90'] },
  { key: 'onboarding_2', icon: '🌿', title: 'onboarding_2_title', body: 'onboarding_2_body', chips: [] },
  { key: 'onboarding_3', icon: '📈', title: 'onboarding_3_title', body: 'onboarding_3_body', chips: [] },
];

export default function OnboardingScreen() {
  const [idx, setIdx] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();
  const slide = slides[idx];

  React.useEffect(() => {
    logEvent(EVENTS.ONBOARDING_SLIDE_VIEWED, { slide_index: idx });
  }, [idx]);

  function next() {
    if (idx < slides.length - 1) {
      setIdx(idx + 1);
    } else {
      logEvent(EVENTS.ONBOARDING_COMPLETED);
      router.replace('/auth');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />

      <TouchableOpacity
        onPress={() => {
          logEvent(EVENTS.ONBOARDING_SKIPPED, { skipped_at_slide: idx });
          router.replace('/auth');
        }}
        style={{ position: 'absolute', top: 56, right: 24, zIndex: 20 }}
      >
        <Text style={{ fontSize: 14, color: '#2D1810', opacity: 0.5, fontFamily: 'PlusJakartaSans_500Medium' }}>
          {t('skip')}
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, zIndex: 10 }}>
        <Animated.View
          key={slide.key}
          entering={FadeInRight.springify()}
          style={{ alignItems: 'center' }}
        >
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: 'white',
              borderWidth: 4,
              borderColor: 'rgba(224,120,86,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
              shadowColor: '#E07856',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 44 }}>{slide.icon}</Text>
          </View>

          {slide.chips.length > 0 && (
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              {slide.chips.map((chip, i) => (
                <Animated.View
                  key={chip}
                  entering={FadeInDown.delay(300 + i * 150).springify()}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: 'rgba(224,120,86,0.2)',
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#E07856', fontFamily: 'PlusJakartaSans_600SemiBold' }}>
                    {chip}
                  </Text>
                </Animated.View>
              ))}
            </View>
          )}

          <Text
            style={{
              fontSize: 26,
              fontFamily: 'Fraunces_700Bold',
              color: '#2D1810',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {t(slide.title)}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'PlusJakartaSans_400Regular',
              color: '#2D1810',
              opacity: 0.65,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            {t(slide.body)}
          </Text>
        </Animated.View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 48, zIndex: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                height: 8,
                width: i === idx ? 32 : 8,
                borderRadius: 4,
                backgroundColor: i === idx ? '#E07856' : 'rgba(224,120,86,0.2)',
              }}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={next}
          style={{
            backgroundColor: '#E07856',
            borderRadius: 20,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' }}>
            {idx === slides.length - 1 ? t('continue') : t('next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
