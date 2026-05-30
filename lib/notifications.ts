import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Router } from 'expo-router';
import { db, doc, setDoc, serverTimestamp } from '@/lib/firebase';
import { logEvent, EVENTS } from '@/lib/analytics';
import { useNotificationStore } from '@/stores/useNotificationStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'GlowUp Notifications',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('[notifications] Skipping push registration on simulator');
    return null;
  }

  await logEvent(EVENTS.PUSH_OPTIN_PROMPT);

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  const granted = finalStatus === 'granted';
  await logEvent(EVENTS.PUSH_OPTIN_RESPONSE, { granted });
  useNotificationStore.getState().setPermissionStatus(granted ? 'granted' : 'denied');

  if (!granted) return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    console.warn('[notifications] Missing EAS projectId');
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  console.log('[notifications] Expo push token:', token);
  useNotificationStore.getState().setExpoPushToken(token);
  return token;
}

export async function savePushToken(uid: string, token: string): Promise<void> {
  await setDoc(doc(db, 'users', uid), { pushToken: token, pushTokenUpdatedAt: serverTimestamp() }, { merge: true });
}

const KNOWN_ROUTES = new Set([
  '/(tabs)',
  '/(tabs)/progress',
  '/(tabs)/tips',
  '/(tabs)/profile',
  '/scan',
  '/results',
  '/routine',
  '/product-check',
  '/notifications',
]);

export function handleNotificationTap(
  response: Notifications.NotificationResponse,
  router: Router,
): void {
  const data = response.notification.request.content.data as Record<string, unknown> | undefined;
  const route = (data?.route as string) || '/(tabs)';
  const type = (data?.type as string) || 'general';

  logEvent(EVENTS.NOTIFICATION_TAPPED, { type, route }).catch(() => {});

  const target = KNOWN_ROUTES.has(route) ? route : '/(tabs)';
  router.push(target as any);
}
