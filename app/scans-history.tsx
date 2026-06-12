import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import { useScanStore } from '@/stores/useScanStore';
import ScanHistoryCard from '@/components/progress/ScanHistoryCard';
import { logEvent, EVENTS } from '@/lib/analytics';

const ESPRESSO = '#2D1810';
const PRIMARY = '#E07856';
const ACCENT = '#D4A574';

export default function ScansHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const history = useScanStore((s) => s.scanHistory);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      {/* Ambient blobs */}
      <View
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: PRIMARY,
          opacity: 0.12,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 440,
          left: -80,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: ACCENT,
          opacity: 0.15,
        }}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingTop: insets.top + 12,
          paddingBottom: 6,
          paddingHorizontal: 20,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18l-6-6 6-6"
              stroke={ESPRESSO}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
        <View>
          <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 26, color: ESPRESSO }}>
            {t('scans_history_title')}
          </Text>
          {history.length > 0 && (
            <Text
              style={{
                fontFamily: 'Fraunces_700Bold_Italic',
                fontSize: 13,
                color: 'rgba(45,24,16,0.45)',
                marginTop: 1,
              }}
            >
              {t('progress_journey_total', { count: history.length })}
            </Text>
          )}
        </View>
      </View>

      {history.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'PlusJakartaSans_500Medium',
              color: 'rgba(45,24,16,0.55)',
              textAlign: 'center',
            }}
          >
            {t('scans_history_empty')}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          style={{ zIndex: 10 }}
        >
          {history.map((scan, i) => (
            <Animated.View
              key={scan.id}
              entering={FadeInDown.delay(i * 80).springify()}
            >
              <ScanHistoryCard
                scan={scan}
                previousScan={history[i + 1]}
                isBaseline={i === history.length - 1}
                onPress={(s) => {
                  logEvent(EVENTS.SCAN_HISTORY_CARD_TAPPED, {
                    scan_id: s.id,
                    score: s.overall_score,
                  });
                  router.push(`/(tabs)/results?scanId=${s.id}`);
                }}
              />
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
