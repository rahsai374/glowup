import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useScanStore } from '@/stores/useScanStore';
import ScoreCircle from '@/components/ScoreCircle';
import MetricBar from '@/components/MetricBar';
import { logEvent, EVENTS } from '@/lib/analytics';

const METRIC_LABELS: Record<string, string> = {
  hydration: 'Hydration',
  blemish_prone: 'Blemish-Prone',
  redness: 'Redness',
  oiliness: 'Oiliness',
  dark_spots: 'Dark Spots',
  radiance: 'Radiance',
  texture: 'Texture',
  firmness: 'Firmness',
  wrinkles: 'Wrinkles',
  dark_circles: 'Dark Circles',
};

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const scan = useScanStore((s) => s.currentScan);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!scan) {
      router.replace('/(tabs)');
      return;
    }
    if (!loggedRef.current) {
      loggedRef.current = true;
      logEvent(EVENTS.RESULTS_VIEWED, {
        overall_score: scan.overall_score,
        skin_type: scan.skin_type,
      });
    }
  }, [scan]);

  if (!scan) return null;

  const metrics = Object.entries(scan.metrics);

  return (
    <View style={{ flex: 1, backgroundColor: '#F0E6DF' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero panel */}
        <View
          style={{
            backgroundColor: 'white',
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            paddingTop: insets.top + 16,
            paddingBottom: 32,
            paddingHorizontal: 24,
            alignItems: 'center',
            shadowColor: '#2D1810',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 40,
            elevation: 10,
            overflow: 'hidden',
          }}
        >
          <View style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(224,120,86,0.08)' }} pointerEvents="none" />

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ alignSelf: 'flex-start', marginBottom: 16, backgroundColor: '#FFF5EE', borderRadius: 16, padding: 10 }}
          >
            <Text style={{ fontSize: 16 }}>←</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#E07856', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 20 }}>
            {t('results_title')}
          </Text>

          <ScoreCircle score={scan.overall_score} size={160} />

          <View style={{ flexDirection: 'row', gap: 16, marginTop: 20 }}>
            <View style={{ alignItems: 'center', backgroundColor: '#FFF5EE', borderRadius: 16, padding: 14, flex: 1 }}>
              <Text style={{ fontSize: 22, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>{scan.skin_age}</Text>
              <Text style={{ fontSize: 11, color: 'rgba(45,24,16,0.55)', fontFamily: 'PlusJakartaSans_500Medium', marginTop: 2 }}>{t('skin_age')}</Text>
            </View>
            <View style={{ alignItems: 'center', backgroundColor: '#FFF5EE', borderRadius: 16, padding: 14, flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', textTransform: 'capitalize' }}>{scan.skin_type}</Text>
              <Text style={{ fontSize: 11, color: 'rgba(45,24,16,0.55)', fontFamily: 'PlusJakartaSans_500Medium', marginTop: 2 }}>{t('skin_type')}</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          {/* Top concern + win */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={{ flex: 1, backgroundColor: '#FEE2E2', borderRadius: 16, padding: 14 }}>
                <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#F87171', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  {t('top_concern')}
                </Text>
                <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
                  {scan.top_concern}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#DCFCE7', borderRadius: 16, padding: 14 }}>
                <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#4ADE80', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  {t('top_win')}
                </Text>
                <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
                  {scan.top_win}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Advice */}
          <Animated.View entering={FadeInDown.delay(280).springify()}>
            <View style={{ backgroundColor: '#FBF2E0', borderRadius: 20, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(212,165,116,0.2)' }}>
              <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#2D1810', lineHeight: 20 }}>
                💡 {scan.advice}
              </Text>
            </View>
          </Animated.View>

          {/* Skin scores */}
          <Animated.View entering={FadeInDown.delay(360).springify()}>
            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(224,120,86,0.08)' }}>
              <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 16 }}>
                Skin Scores
              </Text>
              {metrics.map(([key, score], i) => (
                <MetricBar key={key} label={METRIC_LABELS[key] ?? key} score={score} delay={i * 80} />
              ))}
            </View>
          </Animated.View>

          {/* Dark CTA */}
          <Animated.View entering={FadeInDown.delay(440).springify()}>
            <View style={{ backgroundColor: '#2D1810', borderRadius: 24, padding: 24, marginBottom: 20 }}>
              <Text style={{ fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#D4A574', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                ✨ {t('customized_regimen')}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.7)', lineHeight: 20 }}>
                {t('regimen_body')}
              </Text>
            </View>
          </Animated.View>

          {/* CTAs */}
          <TouchableOpacity
            onPress={() => router.push('/routine')}
            style={{ backgroundColor: '#E07856', borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginBottom: 12 }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' }}>
              {t('see_routine')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/share')}
            style={{ borderRadius: 20, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#E07856' }}
          >
            <Text style={{ color: '#E07856', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' }}>
              {t('share_score')}
            </Text>
          </TouchableOpacity>

          <View style={{ backgroundColor: 'rgba(224,120,86,0.07)', borderRadius: 16, padding: 14, marginTop: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Text style={{ fontSize: 14 }}>⚕️</Text>
            <Text style={{ flex: 1, fontSize: 12, color: 'rgba(45,24,16,0.6)', fontFamily: 'PlusJakartaSans_400Regular', lineHeight: 18 }}>
              {t('not_medical')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
