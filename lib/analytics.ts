import analytics from '@react-native-firebase/analytics';
import { AppEventsLogger } from 'react-native-fbsdk-next';

export const EVENTS = {
  APP_OPENED: 'app_opened',
  LANGUAGE_SELECTED: 'language_selected',
  ONBOARDING_SLIDE_VIEWED: 'onboarding_slide_viewed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_SKIPPED: 'onboarding_skipped',
  OTP_REQUESTED: 'otp_requested',
  OTP_VERIFIED: 'otp_verified',
  ONBOARDING_Q_ANSWERED: 'onboarding_q_answered',
  ONBOARDING_Q_COMPLETED: 'onboarding_q_completed',

  SCAN_STARTED: 'scan_started',
  SCAN_PHOTO_CAPTURED: 'scan_photo_captured',
  SCAN_COMPLETED: 'scan_completed',
  SCAN_FAILED: 'scan_failed',
  RESULTS_VIEWED: 'results_viewed',
  ROUTINE_VIEWED: 'routine_viewed',
  SHARE_OPENED: 'share_opened',
  SHARE_COMPLETED: 'share_completed',

  PAYWALL_SHOWN: 'paywall_shown',
  PAYWALL_CONVERTED: 'paywall_converted',
  PAYWALL_DISMISSED: 'paywall_dismissed',

  TAB_VIEWED: 'tab_viewed',
  PRODUCT_LINK_TAPPED: 'product_link_tapped',
  PROFILE_UPDATED: 'profile_updated',
} as const;

export async function logEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    await analytics().logEvent(name, params);
  } catch {}
  try {
    AppEventsLogger.logEvent(name, params as Record<string, string | number>);
  } catch {}
}

export async function setUserId(uid: string): Promise<void> {
  try {
    await analytics().setUserId(uid);
  } catch {}
  try {
    AppEventsLogger.setUserID(uid);
  } catch {}
}

export async function setUserProperty(
  key: string,
  value: string | null,
): Promise<void> {
  try {
    await analytics().setUserProperty(key, value);
  } catch {}
}

export async function setUserProperties(
  props: Record<string, string | null>,
): Promise<void> {
  try {
    await analytics().setUserProperties(props);
  } catch {}
}

export async function logSignUp(method: string = 'phone'): Promise<void> {
  try {
    await analytics().logSignUp({ method });
  } catch {}
  try {
    AppEventsLogger.logEvent('fb_mobile_complete_registration', {
      fb_registration_method: method,
    });
  } catch {}
}

export async function logLogin(method: string = 'phone'): Promise<void> {
  try {
    await analytics().logLogin({ method });
  } catch {}
  try {
    AppEventsLogger.logEvent('fb_mobile_login', {
      fb_login_method: method,
    });
  } catch {}
}
