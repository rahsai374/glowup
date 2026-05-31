import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { getLocales } from 'expo-localization';
import { Platform } from 'react-native';

export interface DeviceMetadata {
  appVersion: string;
  deviceOS: string;
  deviceOSVersion: string;
  deviceModel: string;
  locale: string;
}

export function getDeviceMetadata(): DeviceMetadata {
  const locales = getLocales();
  return {
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    deviceOS: Platform.OS,
    deviceOSVersion: Platform.Version.toString(),
    deviceModel: Device.modelName ?? 'unknown',
    locale: locales[0]?.languageTag ?? 'en-IN',
  };
}
