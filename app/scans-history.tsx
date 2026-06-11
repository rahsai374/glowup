import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import { useScanStore, ScanRecord } from '@/stores/useScanStore';
import ScanHistoryCard from '@/components/progress/ScanHistoryCard';

const ESPRESSO = '#2D1810';

export default function ScansHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const history = useScanStore((s) => s.scanHistory);

  const handlePress = (_scan: ScanRecord) => {
    // No-op for now; detail navigation TBD
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingTop: insets.top + 12,
          paddingBottom: 12,
          paddingHorizontal: 20,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
          accessibilityRole="button"
          accessibilityLabel="Back"
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
        <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 26, color: ESPRESSO }}>
          {t('scans_history_title')}
        </Text>
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {history.map((scan, i) => (
            <ScanHistoryCard
              key={scan.id}
              scan={scan}
              previousScan={history[i + 1]}
              isBaseline={i === history.length - 1}
              onPress={handlePress}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
