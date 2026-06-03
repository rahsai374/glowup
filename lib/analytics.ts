import { AppEventsLogger } from 'react-native-fbsdk-next';
import PostHog from 'posthog-react-native';
import { Mixpanel } from 'mixpanel-react-native';

export const posthog = new PostHog('phc_kNMobEnPZYUTjeTjAyNGfu3DuPWEZRtVXy4sSsddJndH', {
  host: 'https://us.i.posthog.com',
});

const mixpanelToken = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
export const mixpanel = mixpanelToken ? new Mixpanel(mixpanelToken, true) : null;
mixpanel?.init();

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

  // Product Check
  PRODUCT_CHECK_OPENED: 'product_check_opened',
  PRODUCT_SEARCHED: 'product_searched',
  PRODUCT_SEARCH_NO_RESULTS: 'product_search_no_results',
  PRODUCT_SELECTED: 'product_selected',
  PRODUCT_VERDICT_VIEWED: 'product_verdict_viewed',
  PRODUCT_BARCODE_TAPPED: 'product_barcode_tapped',
  PRODUCT_CHECK_ANOTHER: 'product_check_another',

  // Routine
  ROUTINE_TAB_SWITCHED: 'routine_tab_switched',
  ROUTINE_STEP_EXPANDED: 'routine_step_expanded',

  // Scan history
  SCAN_HISTORY_CARD_TAPPED: 'scan_history_card_tapped',
  SCAN_HISTORY_FULL_ANALYSIS: 'scan_history_full_analysis',

  // Push notifications
  PUSH_OPTIN_PROMPT: 'push_optin_prompt',
  PUSH_OPTIN_RESPONSE: 'push_optin_response',
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_TAPPED: 'notification_tapped',
} as const;

export async function logEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    AppEventsLogger.logEvent(name, params as Record<string, string | number>);
  } catch {}
  try {
    posthog.capture(name, params);
  } catch {}
  try {
    mixpanel?.track(name, params);
  } catch {}
}

export async function setUserId(uid: string): Promise<void> {
  try {
    AppEventsLogger.setUserID(uid);
  } catch {}
  try {
    posthog.identify(uid);
  } catch {}
  try {
    mixpanel?.identify(uid);
  } catch {}
}

export async function setUserProperty(
  key: string,
  value: string | null,
): Promise<void> {
  try {
    posthog.identify(undefined, { [key]: value });
  } catch {}
  try {
    mixpanel?.getPeople()?.set(key, value ?? '');
  } catch {}
}

export async function setUserProperties(
  props: Record<string, string | null>,
): Promise<void> {
  try {
    posthog.identify(undefined, props);
  } catch {}
  try {
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(props)) cleaned[k] = v ?? '';
    mixpanel?.getPeople()?.set(cleaned);
  } catch {}
}

export async function logSignUp(method: string = 'phone'): Promise<void> {
  try {
    AppEventsLogger.logEvent('fb_mobile_complete_registration', {
      fb_registration_method: method,
    });
  } catch {}
  try {
    posthog.capture('sign_up', { method });
  } catch {}
  try {
    mixpanel?.track('sign_up', { method });
  } catch {}
}

export async function logLogin(method: string = 'phone'): Promise<void> {
  try {
    AppEventsLogger.logEvent('fb_mobile_login', {
      fb_login_method: method,
    });
  } catch {}
  try {
    posthog.capture('login', { method });
  } catch {}
  try {
    mixpanel?.track('login', { method });
  } catch {}
}
