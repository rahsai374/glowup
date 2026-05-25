import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/stores/useUserStore';
import { useScanStore } from '@/stores/useScanStore';
import ScoreCircle from '@/components/ScoreCircle';
import AmbientBlobs from '@/components/AmbientBlobs';

const INSIGHTS = [
  { icon: '💧', label: 'Hydration tip', bg: '#FFF0E8' },
  { icon: '☀️', label: 'SPF reminder', bg: '#FFFBF0' },
  { icon: '🌙', label: 'Night routine', bg: '#F0F4FF' },
  { icon: '🥤', label: 'Drink water', bg: '#F0FFF4' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const lastScan = useScanStore((s) => s.scanHistory[0] ?? null);
  const scanScale = useSharedValue(1);

  const scanStyle = useAnimatedStyle(() => ({ transform: [{ scale: scanScale.value }] }));

  function onScanPress() {
    scanScale.value = withSpring(0.97, { damping: 15 });
    setTimeout(() => { scanScale.value = withSpring(1); router.push('/scan'); }, 100);
  }

  const name = user?.name || 'Friend';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />
      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <View>
            <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#E07856', letterSpacing: 2.5, textTransform: 'uppercase' }}>
              {t('home_greeting')}
            </Text>
            <Text style={{ fontSize: 28, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>{name} ✨</Text>
            <Text style={{ fontSize: 14, fontFamily: 'Fraunces_700Bold_Italic', color: 'rgba(45,24,16,0.5)' }}>
              {t('home_subtitle')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 22 }}>👩🏽</Text>
          </TouchableOpacity>
        </View>

        {/* Scan CTA */}
        <Animated.View style={scanStyle}>
          <TouchableOpacity
            onPress={onScanPress}
            style={{
              backgroundColor: '#E07856',
              borderRadius: 32,
              padding: 32,
              marginBottom: 20,
              overflow: 'hidden',
            }}
            activeOpacity={0.9}
          >
            <View
              style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            />
            <Text style={{ fontSize: 44, marginBottom: 12 }}>🔍</Text>
            <Text style={{ fontSize: 26, fontFamily: 'Fraunces_700Bold', color: 'white', marginBottom: 4 }}>
              {t('scan_skin')}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 12, color: 'white', fontFamily: 'PlusJakartaSans_500Medium' }}>
                  {t('scan_subtitle')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => router.push('/product-check')}
            style={{
              flex: 1,
              borderRadius: 20,
              padding: 20,
              backgroundColor: '#FFEFE3',
              borderWidth: 1,
              borderColor: 'rgba(224,120,86,0.1)',
            }}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>🧴</Text>
            <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#2D1810' }}>
              {t('check_product')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/routine')}
            style={{
              flex: 1,
              borderRadius: 20,
              padding: 20,
              backgroundColor: '#FBF2E0',
              borderWidth: 1,
              borderColor: 'rgba(212,165,116,0.2)',
            }}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>🌿</Text>
            <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#2D1810' }}>
              {t('my_routine')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last Scan Card */}
        {lastScan && (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
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
              <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#E07856', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                {t('last_scan')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <ScoreCircle score={lastScan.overall_score} size={80} />
                <View style={{ flex: 1 }}>
                  <View style={{ backgroundColor: '#FEE2E2', borderRadius: 8, padding: 6, marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: '#F87171', fontFamily: 'PlusJakartaSans_500Medium' }}>
                      ⚠️ {lastScan.top_concern}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#DCFCE7', borderRadius: 8, padding: 6 }}>
                    <Text style={{ fontSize: 12, color: '#4ADE80', fontFamily: 'PlusJakartaSans_500Medium' }}>
                      ✓ {lastScan.top_win}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Insights Grid */}
        <Text style={{ fontSize: 18, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 12 }}>
          Daily Insights
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          {INSIGHTS.map((item, i) => (
            <Animated.View
              key={item.label}
              entering={FadeInDown.delay(i * 80).springify()}
              style={{
                width: '47%',
                backgroundColor: item.bg,
                borderRadius: 16,
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</Text>
              <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
                {item.label}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Daily Tip */}
        <View
          style={{
            borderRadius: 20,
            padding: 20,
            backgroundColor: '#FBF2E0',
            borderWidth: 1,
            borderColor: 'rgba(212,165,116,0.2)',
          }}
        >
          <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#D4A574', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            {t('daily_tip')}
          </Text>
          <Text style={{ fontSize: 24, marginBottom: 8 }}>💦</Text>
          <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 4 }}>
            Hydrate from within
          </Text>
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.65)', lineHeight: 20 }}>
            Drinking 8 glasses of water daily can improve skin elasticity and reduce fine lines by up to 30%.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
