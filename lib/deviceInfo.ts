import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, NativeModules } from 'react-native';

export interface DeviceMetadata {
  appVersion: string;
  deviceOS: string;
  deviceOSVersion: string;
  deviceModel: string;
  locale: string;
}

function getDeviceLocale(): string {
  try {
    // Android: read locale from native settings without expo-localization
    if (Platform.OS === 'android') {
      const locale =
        NativeModules.I18nManager?.localeIdentifier ??
        NativeModules.SettingsManager?.settings?.AppleLocale;
      if (locale) return locale.replace('_', '-');
    }
    // iOS fallback
    if (Platform.OS === 'ios') {
      const locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ??
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
      if (locale) return locale.replace('_', '-');
    }
  } catch {}
  return 'en-IN';
}

export function getDeviceMetadata(): DeviceMetadata {
  return {
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    deviceOS: Platform.OS,
    deviceOSVersion: Platform.Version.toString(),
    deviceModel: Device.modelName ?? 'unknown',
    locale: getDeviceLocale(),
  };
}
