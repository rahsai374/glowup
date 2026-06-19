import '../global.css';
import '../i18n';
import '@/lib/notifications';
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import crashlytics from '@react-native-firebase/crashlytics';
import { useTranslation } from 'react-i18next';
import { setupAndroidChannel, handleNotificationTap } from '@/lib/notifications';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { logEvent, EVENTS, posthog } from '@/lib/analytics';
import { PostHogProvider } from 'posthog-react-native';
import {
  Fraunces_700Bold,
  Fraunces_700Bold_Italic,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Hind_400Regular,
  Hind_500Medium,
  Hind_600SemiBold,
} from '@expo-google-fonts/hind';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// TODO: Re-enable ATT + FB advertiser tracking once FB App ID credentials are configured.
// See analytics TODOs in MEMORY.md. Requires: requestTrackingPermissionsAsync (expo-tracking-transparency)
// and Settings.setAdvertiserTrackingEnabled (react-native-fbsdk-next).

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const { t } = useTranslation();
  useEffect(() => {
    crashlytics().recordError(error);
  }, [error]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Text style={{ fontSize: 40, marginBottom: 16 }}>😥</Text>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#2D1810', marginBottom: 8, textAlign: 'center' }}>
        {t('error_boundary_title')}
      </Text>
      <Text style={{ fontSize: 14, color: 'rgba(45,24,16,0.6)', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
        {error.message}
      </Text>
      <TouchableOpacity
        onPress={retry}
        style={{ backgroundColor: '#E07856', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 32 }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{t('try_again')}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Fraunces_700Bold,
    Fraunces_700Bold_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    Hind_400Regular,
    Hind_500Medium,
    Hind_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontsError]);


  useEffect(() => {
    setupAndroidChannel();
  }, []);

  const router = useRouter();

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body, data } = notification.request.content;
      useNotificationStore.getState().addNotification({
        id: notification.request.identifier,
        title: title || '',
        body: body || '',
        data: data as Record<string, unknown>,
        receivedAt: new Date().toISOString(),
      });
      logEvent(EVENTS.NOTIFICATION_RECEIVED, { type: (data?.type as string) || 'general' }).catch(() => {});
    });

    return () => { receivedSub.remove(); };
  }, []);

  // Handles both cold-start and warm taps via useLastNotificationResponse
  const lastResponse = Notifications.useLastNotificationResponse();
  const lastHandledId = useRef<string | null>(null);

  useEffect(() => {
    if (!lastResponse) return;
    const responseId = lastResponse.notification.request.identifier;
    if (responseId === lastHandledId.current) return;
    lastHandledId.current = responseId;

    // Add tapped notification to store (covers background-received notifications)
    const { title, body, data } = lastResponse.notification.request.content;
    const store = useNotificationStore.getState();
    const alreadyInStore = store.notifications.some((n) => n.id === responseId);
    if (!alreadyInStore) {
      store.addNotification({
        id: responseId,
        title: title || '',
        body: body || '',
        data: data as Record<string, unknown>,
        receivedAt: new Date().toISOString(),
      });
    }

    handleNotificationTap(lastResponse, router);
  }, [lastResponse, router]);

  if (!fontsLoaded && !fontsError) return null;

  return (
    <PostHogProvider client={posthog ?? undefined} autocapture={{ captureScreens: true }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
      </GestureHandlerRootView>
    </PostHogProvider>
  );
}
