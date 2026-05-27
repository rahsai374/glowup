import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useScanStore } from '@/stores/useScanStore';
import ScoreCircle from '@/components/ScoreCircle';
import AmbientBlobs from '@/components/AmbientBlobs';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const history = useScanStore((s) => s.scanHistory);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />
      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 30, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 4 }}>
          {t('progress_title')}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'Fraunces_700Bold_Italic', color: 'rgba(45,24,16,0.5)', marginBottom: 28 }}>
          {t('progress_subtitle')}
        </Text>

        {history.length === 0 ? (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 40,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(224,120,86,0.1)',
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📈</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', textAlign: 'center', marginBottom: 8 }}>
              No scans yet
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(45,24,16,0.55)', textAlign: 'center', fontFamily: 'PlusJakartaSans_400Regular' }}>
              Take your first skin scan to start tracking your progress.
            </Text>
          </View>
        ) : (
          <>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 24,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: 'rgba(224,120,86,0.08)',
                shadowColor: '#2D1810',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 20,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 16 }}>
                Score History
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {history.map((scan, i) => (
                  <View
                    key={scan.id}
                    style={{
                      backgroundColor: '#FFF5EE',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center',
                      minWidth: 60,
                    }}
                  >
                    <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: '#E07856' }}>
                      {scan.overall_score}
                    </Text>
                    <Text style={{ fontSize: 10, color: 'rgba(45,24,16,0.5)', fontFamily: 'PlusJakartaSans_400Regular' }}>
                      Scan {i + 1}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {history.map((scan, i) => (
              <Animated.View
                key={scan.id}
                entering={FadeInDown.delay(i * 100).springify()}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(224,120,86,0.08)',
                }}
              >
                <ScoreCircle score={scan.overall_score} size={64} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: 'rgba(45,24,16,0.5)', fontFamily: 'PlusJakartaSans_400Regular', marginBottom: 4 }}>
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </Text>
                  <View style={{ backgroundColor: '#FEE2E2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 4 }}>
                    <Text style={{ fontSize: 11, color: '#F87171', fontFamily: 'PlusJakartaSans_500Medium' }}>
                      {scan.top_concern}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#DCFCE7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 11, color: '#4ADE80', fontFamily: 'PlusJakartaSans_500Medium' }}>
                      {scan.top_win}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
