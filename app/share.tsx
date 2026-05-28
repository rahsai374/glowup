import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useScanStore } from '@/stores/useScanStore';
import { useUserStore } from '@/stores/useUserStore';
import ScoreCircle from '@/components/ScoreCircle';
import { logEvent, EVENTS } from '@/lib/analytics';

export default function ShareScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const scan = useScanStore((s) => s.currentScan);
  const user = useUserStore((s) => s.user);
  const cardScale = useSharedValue(0.9);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.value }] }));

  React.useEffect(() => {
    if (!scan) return;
    logEvent(EVENTS.SHARE_OPENED, { overall_score: scan.overall_score });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 100 });
  }, []);

  React.useEffect(() => {
    if (!scan) router.back();
  }, [scan]);

  if (!scan) return null;

  async function shareWhatsApp() {
    await Share.share({
      message: `I just got my skin score on GlowUp! 🌟 My overall score is ${scan!.overall_score}/100. Skin type: ${scan!.skin_type}. Download GlowUp for your personalized skin analysis!`,
    });
    logEvent(EVENTS.SHARE_COMPLETED);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 16, left: 24, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 10, zIndex: 20 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>←</Text>
      </TouchableOpacity>

      <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Fraunces_700Bold', textAlign: 'center', marginTop: insets.top + 16, marginBottom: 32 }}>
        {t('share_title')}
      </Text>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Animated.View
          style={[cardStyle, {
            aspectRatio: 1,
            backgroundColor: '#FFF5EE',
            borderRadius: 32,
            padding: 28,
            width: '100%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.4,
            shadowRadius: 60,
            elevation: 20,
            overflow: 'hidden',
          }]}
        >
          <View style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(224,120,86,0.12)' }} pointerEvents="none" />
          <View style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(212,165,116,0.12)' }} pointerEvents="none" />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20, alignSelf: 'flex-start' }}>
            <Text style={{ fontSize: 18, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>
              {user?.name || 'My Score'}
            </Text>
            <View style={{ backgroundColor: '#E07856', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 10, color: 'white', fontFamily: 'PlusJakartaSans_700Bold' }}>GlowUp</Text>
            </View>
          </View>

          <ScoreCircle score={scan.overall_score} size={160} />

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 12, flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, fontFamily: 'Fraunces_700Bold', color: '#2D1810', textTransform: 'capitalize' }}>{scan.skin_type}</Text>
              <Text style={{ fontSize: 10, color: 'rgba(45,24,16,0.5)', fontFamily: 'PlusJakartaSans_400Regular' }}>Skin Type</Text>
            </View>
            <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 12, flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>{scan.skin_age}</Text>
              <Text style={{ fontSize: 10, color: 'rgba(45,24,16,0.5)', fontFamily: 'PlusJakartaSans_400Regular' }}>Skin Age</Text>
            </View>
          </View>

          <Text style={{ fontSize: 11, color: 'rgba(45,24,16,0.4)', fontFamily: 'PlusJakartaSans_400Regular', marginTop: 16, textAlign: 'center' }}>
            glowup.app • AI estimate, not medical advice
          </Text>
        </Animated.View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24, gap: 12 }}>
        <TouchableOpacity
          onPress={shareWhatsApp}
          style={{ backgroundColor: '#25D366', borderRadius: 20, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
        >
          <Text style={{ fontSize: 18 }}>💬</Text>
          <Text style={{ color: 'white', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' }}>
            {t('share_whatsapp')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
