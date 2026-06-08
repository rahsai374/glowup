import { AppEventsLogger } from 'react-native-fbsdk-next';
import PostHog from 'posthog-react-native';
import { Mixpanel } from 'mixpanel-react-native';

const posthogKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
export const posthog = posthogKey ? new PostHog(posthogKey, {
  host: 'https://us.i.posthog.com',
}) : null;

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

type FBMapping = {
  event: string;
  mapParams?: (p: Record<string, string | number>) => Record<string, string | number>;
};

const P = AppEventsLogger.AppEventParams;

const FB_EVENT_MAP: Partial<Record<string, FBMapping>> = {
  [EVENTS.ONBOARDING_COMPLETED]: { event: AppEventsLogger.AppEvents.CompletedTutorial },
  [EVENTS.SCAN_STARTED]: { event: AppEventsLogger.AppEvents.InitiatedCheckout },
  [EVENTS.SCAN_COMPLETED]: {
    event: AppEventsLogger.AppEvents.AchievedLevel,
    mapParams: (p) => ({ [P.Level]: String(p.overall_score ?? '') }),
  },
  [EVENTS.RESULTS_VIEWED]: {
    event: AppEventsLogger.AppEvents.ViewedContent,
    mapParams: () => ({ [P.ContentType]: 'scan_results' }),
  },
  [EVENTS.ROUTINE_VIEWED]: {
    event: AppEventsLogger.AppEvents.ViewedContent,
    mapParams: () => ({ [P.ContentType]: 'routine' }),
  },
  [EVENTS.PRODUCT_VERDICT_VIEWED]: {
    event: AppEventsLogger.AppEvents.ViewedContent,
    mapParams: (p) => ({ [P.ContentType]: 'product_verdict', [P.ContentID]: String(p.product_id ?? '') }),
  },
  [EVENTS.PRODUCT_SEARCHED]: {
    event: AppEventsLogger.AppEvents.Searched,
    mapParams: (p) => ({ [P.SearchString]: String(p.query ?? '') }),
  },
  [EVENTS.SHARE_COMPLETED]: { event: AppEventsLogger.AppEvents.UnlockedAchievement },
  [EVENTS.PRODUCT_SELECTED]: {
    event: AppEventsLogger.AppEvents.AddedToWishlist,
    mapParams: (p) => ({ [P.ContentID]: String(p.product_id ?? ''), [P.ContentType]: 'product' }),
  },
};

export async function logEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    const mapping = FB_EVENT_MAP[name];
    if (mapping) {
      const fbParams = mapping.mapParams && params
        ? mapping.mapParams(params as Record<string, string | number>)
        : undefined;
      AppEventsLogger.logEvent(mapping.event, fbParams as Record<string, string | number>);
    }
  } catch {}
  try {
    posthog?.capture(name, params);
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
    posthog?.identify(uid);
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
    posthog?.identify(undefined, { [key]: value });
  } catch {}
  try {
    mixpanel?.getPeople()?.set(key, value ?? '');
  } catch {}
}

export async function setUserProperties(
  props: Record<string, string | null>,
): Promise<void> {
  try {
    posthog?.identify(undefined, props);
  } catch {}
  try {
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(props)) cleaned[k] = v ?? '';
    mixpanel?.getPeople()?.set(cleaned);
  } catch {}
}

export async function logSignUp(method: string = 'phone'): Promise<void> {
  try {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      fb_registration_method: method,
    });
  } catch {}
  try {
    posthog?.capture('sign_up', { method });
  } catch {}
  try {
    mixpanel?.track('sign_up', { method });
  } catch {}
}

export async function logLogin(method: string = 'phone'): Promise<void> {
  try {
    posthog?.capture('login', { method });
  } catch {}
  try {
    mixpanel?.track('login', { method });
  } catch {}
}

export function setAdvancedMatching(phone: string): void {
  try {
    AppEventsLogger.setUserData({ phone });
  } catch {}
}
