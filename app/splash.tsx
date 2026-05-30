import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import rnAuth from '@react-native-firebase/auth';
import { hydrateFromFirestore } from '@/lib/firestore';
import { useProductStore } from '@/stores/useProductStore';
import { logEvent, EVENTS } from '@/lib/analytics';

const appIcon = require('@/assets/icon.png');

export default function SplashScreen() {
  const router = useRouter();
  const iconScale = useSharedValue(0.6);

  useEffect(() => {
    iconScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 100 }));

    const currentUser = rnAuth().currentUser;
    logEvent(EVENTS.APP_OPENED, { is_authenticated: !!currentUser });

    if (!currentUser) {
      const t = setTimeout(() => router.replace('/language'), 2500);
      return () => clearTimeout(t);
    }

    const minSplash = new Promise((r) => setTimeout(r, 2500));
    const hydrate = hydrateFromFirestore(currentUser.uid).catch(() => {});
    const hardTimeout = new Promise((r) => setTimeout(r, 5000));

    useProductStore.getState().hydrate();
    useProductStore.getState().syncFromStorage();

    Promise.all([minSplash, Promise.race([hydrate, hardTimeout])]).then(() => {
      router.replace('/(tabs)');
    });
  }, []);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }] }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#E07856',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <StatusBar style="light" />
      <Animated.View style={iconStyle}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 44 }}>✨</Text>
        </View>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(400).springify()}
        style={{ fontSize: 48, fontFamily: 'Fraunces_700Bold', color: 'white', letterSpacing: -1 }}
      >
        GlowUp
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.delay(500).springify()}
        style={{
          fontSize: 14,
          fontFamily: 'Fraunces_700Bold_Italic',
          color: 'rgba(255,255,255,0.8)',
          letterSpacing: 0.5,
        }}
      >
        Your skin care partner
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.delay(600).springify()}
        style={{
          fontSize: 15,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: 'rgba(255,255,255,0.7)',
          marginTop: 4,
        }}
      >
        Glowing skin for everyone
      </Animated.Text>
    </View>
  );
}
