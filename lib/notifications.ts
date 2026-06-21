import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Router, type Href } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
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

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    // Only log prompt event when the OS dialog is actually being shown
    await logEvent(EVENTS.PUSH_OPTIN_PROMPT);
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
  await firestore().collection('users').doc(uid).set(
    { pushToken: token, pushTokenUpdatedAt: firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
}

// iOS returns APNs token, not FCM — needs @react-native-firebase/messaging for iOS support
export async function registerFcmTokenAsync(): Promise<string | null> {
  if (Platform.OS !== 'android') return null;
  if (!Device.isDevice) return null;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return null;

  try {
    const { data: token } = await Notifications.getDevicePushTokenAsync();
    console.log('[notifications] FCM device token:', token);
    return token;
  } catch (e) {
    console.warn('[notifications] Failed to get FCM token:', e);
    return null;
  }
}

export async function saveFcmToken(uid: string, token: string): Promise<void> {
  await firestore().collection('users').doc(uid).set(
    { fcmToken: token, fcmTokenUpdatedAt: firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
}

type StringHref = Extract<Href, string>;

const VALID_ROUTES: readonly StringHref[] = [
  '/(tabs)',
  '/(tabs)/progress',
  '/(tabs)/product-check',
  '/(tabs)/profile',
  '/scan',
  '/(tabs)/results',
  '/(tabs)/routine',
  '/(tabs)/notifications',
] as const;

function isValidRoute(route: string): route is StringHref {
  return (VALID_ROUTES as readonly string[]).includes(route);
}

export function handleNotificationTap(
  response: Notifications.NotificationResponse,
  router: Router,
): void {
  const data = response.notification.request.content.data as Record<string, unknown> | undefined;
  const route = (data?.route as string) || '/(tabs)';
  const type = (data?.type as string) || 'general';

  logEvent(EVENTS.NOTIFICATION_TAPPED, { type, route }).catch(() => {});

  const target: StringHref = isValidRoute(route) ? route : '/(tabs)';
  router.push(target);
}
