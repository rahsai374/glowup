import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, ImageBackground, Platform, Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { useFaceDetectorOutput } from 'react-native-vision-camera-face-detector';
import { Camera as VisionCamera, useCameraDevice, usePhotoOutput } from 'react-native-vision-camera';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/stores/useUserStore';
import { useScanStore } from '@/stores/useScanStore';
import { analyzeSkin } from '@/lib/gemini';
import { saveScan } from '@/lib/firestore';
import { useFaceGuide } from '@/lib/useFaceGuide';
import { logEvent, EVENTS } from '@/lib/analytics';
import type { Face } from 'react-native-vision-camera-face-detector';

const { width, height } = Dimensions.get('window');
const OVAL_W = 240;
const OVAL_H = 320;
const OVAL_CENTER_X = width / 2;
const OVAL_CENTER_Y = height * 0.4;

const FACTS = [
  'Your skin has 3 layers and renews itself every 28 days.',
  'Melanin production can be regulated with consistent SPF use.',
  'Hydration levels affect how light reflects off your skin.',
  'Collagen production drops 1% per year after age 25.',
];

type ScanState = 'choice' | 'camera' | 'analyzing';

export default function ScanScreen() {
  const [state, setState] = useState<ScanState>('choice');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [factIdx, setFactIdx] = useState(0);
  const [nudgeKey, setNudgeKey] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const hapticFired = useRef(false);
  const readySince = useRef<number | null>(null);
  const pendingNudge = useRef<string | null>(null);
  const pendingNudgeSince = useRef<number>(0);
  const router = useRouter();
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const { setCurrentScan, addToHistory, scanHistory } = useScanStore();
  const device = useCameraDevice('front');
  const factIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastScanTime = useRef<number>(0);
  const SCAN_COOLDOWN_MS = 30_000;

  React.useEffect(() => {
    return () => {
      if (factIntervalRef.current) {
        clearInterval(factIntervalRef.current);
        factIntervalRef.current = null;
      }
    };
  }, []);

  const ovalBounds = useMemo(
    () => ({ width: OVAL_W, height: OVAL_H, centerX: OVAL_CENTER_X, centerY: OVAL_CENTER_Y }),
    []
  );
  const evaluateFace = useFaceGuide(ovalBounds);

  const handleFacesDetected = useCallback(
    (faces: Face[]) => {
      const result = evaluateFace(faces);
      if (!result) return;

      const now = Date.now();
      if (result.nudgeKey !== pendingNudge.current) {
        pendingNudge.current = result.nudgeKey;
        pendingNudgeSince.current = now;
      }
      const elapsed = now - pendingNudgeSince.current;
      if (result.nudgeKey !== nudgeKey && elapsed < 1000) return;

      setNudgeKey(result.nudgeKey);
      setIsReady(result.isReady);

      if (result.isReady) {
        if (!readySince.current) readySince.current = Date.now();
        if (!hapticFired.current && Date.now() - readySince.current > 1000) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          hapticFired.current = true;
        }
      } else {
        readySince.current = null;
        hapticFired.current = false;
      }
    },
    [evaluateFace]
  );

  const photoOutput = usePhotoOutput();
  const faceDetectorOptions = useMemo(() => ({
    onFacesDetected: handleFacesDetected,
    onError: (e: Error) => console.warn('[FACE_DETECT]', e),
    cameraFacing: 'front' as const,
    autoMode: true,
    windowWidth: width,
    windowHeight: height,
    performanceMode: 'fast' as const,
  }), [handleFacesDetected]);
  const faceOutput = useFaceDetectorOutput(faceDetectorOptions);

  const scanY = useSharedValue(0);
  const scanStyle = useAnimatedStyle(() => ({ transform: [{ translateY: scanY.value }] }));

  function startScanning() {
    scanY.value = withRepeat(withTiming(height * 0.6, { duration: 2500 }), -1, true);
    factIntervalRef.current = setInterval(() => setFactIdx((i) => (i + 1) % FACTS.length), 3000);
  }

  function stopScanning() {
    if (factIntervalRef.current) {
      clearInterval(factIntervalRef.current);
      factIntervalRef.current = null;
    }
  }

  async function openCamera() {
    if (!permission?.granted) {
      if (permission?.canAskAgain === false) {
        Alert.alert(
          'Camera Access Required',
          'GlowUp needs camera access to scan your skin. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    logEvent(EVENTS.SCAN_STARTED, { source: 'camera' });
    setState('camera');
  }

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      logEvent(EVENTS.SCAN_STARTED, { source: 'gallery' });
      await processImage(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    if (!photoOutput) return;
    const photo = await photoOutput.capturePhotoToFile({}, {});
    const uri = Platform.OS === 'android' ? `file://${photo.filePath}` : photo.filePath;
    await processImage(uri, isReady);
  }

  async function processImage(uri: string, wasReady = false) {
    const now = Date.now();
    const elapsed = now - lastScanTime.current;
    if (elapsed < SCAN_COOLDOWN_MS) {
      const remaining = Math.ceil((SCAN_COOLDOWN_MS - elapsed) / 1000);
      Alert.alert('Please wait', `You can scan again in ${remaining} second${remaining === 1 ? '' : 's'}.`);
      return;
    }
    lastScanTime.current = now;
    setCapturedUri(uri);
    setState('analyzing');
    logEvent(EVENTS.SCAN_PHOTO_CAPTURED);
    startScanning();
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      if (!compressed.base64) throw new Error('base64 missing from manipulator');
      const result = await analyzeSkin(
        compressed.base64,
        'image/jpeg',
        user?.mainConcern ?? 'general',
        user?.skinType ?? 'normal',
        user?.ageRange ?? '',
        scanHistory[0] ?? null
      );
      const scan = {
        ...result,
        id: `scan_${Date.now()}`,
        createdAt: new Date().toISOString(),
        imageUrl: uri,
        wasReady,
      };
      setCurrentScan(scan);
      addToHistory(scan);
      if (user?.uid) saveScan(user.uid, scan).catch(() => {});
      logEvent(EVENTS.SCAN_COMPLETED, {
        overall_score: scan.overall_score,
        skin_type: scan.skin_type,
        top_concern: scan.top_concern,
      });
      stopScanning();
      // TODO: Insert paywall gate here before navigating to results
      router.replace('/results');
    } catch (e: any) {
      stopScanning();
      logEvent(EVENTS.SCAN_FAILED, { error_message: (e?.message ?? String(e)).slice(0, 100) });
      console.error('[SCAN ERROR]', e?.message ?? e);
      Alert.alert('Scan failed', e?.message ?? String(e));
      setState('choice');
    }
  }

  if (state === 'camera') {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar style="light" />
        {device ? (
          <VisionCamera
            style={{ flex: 1 }}
            device={device}
            isActive={state === 'camera'}
            outputs={[photoOutput, faceOutput].filter(Boolean)}
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontFamily: 'PlusJakartaSans_400Regular' }}>
              Camera not available
            </Text>
          </View>
        )}

        {/* Oval guide overlay */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: OVAL_CENTER_Y - OVAL_H / 2,
            left: OVAL_CENTER_X - OVAL_W / 2,
            width: OVAL_W,
            height: OVAL_H,
            borderRadius: OVAL_W / 2,
            borderWidth: isReady ? 3 : 2,
            borderColor: isReady ? '#4ADE80' : 'rgba(255,255,255,0.5)',
            borderStyle: isReady ? 'solid' : 'dashed',
          }}
        />

        {/* Nudge label */}
        {nudgeKey && (
          <Animated.Text
            key={nudgeKey}
            entering={FadeInUp.duration(200)}
            exiting={FadeOutDown.duration(200)}
            style={{
              position: 'absolute',
              top: OVAL_CENTER_Y + OVAL_H / 2 + 20,
              left: 32,
              right: 32,
              textAlign: 'center',
              color: isReady ? '#4ADE80' : 'rgba(255,255,255,0.85)',
              fontSize: 14,
              fontFamily: 'PlusJakartaSans_500Medium',
              lineHeight: 20,
            }}
          >
            {t(nudgeKey)}
          </Animated.Text>
        )}

        {/* Shutter button with quality dot */}
        <View style={{ position: 'absolute', bottom: 60, left: 0, right: 0, alignItems: 'center' }}>
          <TouchableOpacity onPress={takePhoto}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'white',
                borderWidth: 4,
                borderColor: 'rgba(255,255,255,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              position: 'absolute',
              bottom: -8,
              right: width / 2 - 52,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: isReady ? '#4ADE80' : '#F59E0B',
            }}
          />
        </View>

        {/* Close button */}
        <TouchableOpacity
          onPress={() => setState('choice')}
          style={{ position: 'absolute', top: 56, left: 20, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 10 }}
        >
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium' }}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (state === 'analyzing') {
    return (
      <ImageBackground source={{ uri: capturedUri ?? '' }} resizeMode="cover" style={{ flex: 1 }}>
        <StatusBar style="light" />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(224,120,86,0.3)' }} />
        <Animated.View
          style={[scanStyle, { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#E07856', shadowColor: '#E07856', shadowRadius: 12, shadowOpacity: 1 }]}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 24, padding: 28, marginHorizontal: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' }}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>🔬</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: 'white', marginBottom: 8 }}>
              {t('analyzing')}
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'PlusJakartaSans_400Regular', textAlign: 'center', lineHeight: 20 }}>
              {FACTS[factIdx]}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <View style={{ position: 'absolute', top: -60, right: -60, width: 288, height: 288, borderRadius: 144, backgroundColor: 'rgba(224,120,86,0.13)' }} pointerEvents="none" />

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: 'absolute', top: 56, left: 24, zIndex: 20, backgroundColor: 'white', borderRadius: 20, padding: 10, shadowColor: '#2D1810', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}
      >
        <Text style={{ fontSize: 16 }}>←</Text>
      </TouchableOpacity>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 120, zIndex: 10 }}>
        <Animated.Text
          entering={FadeInDown.springify()}
          style={{ fontSize: 30, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 8 }}
        >
          {t('scan_title')}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(80).springify()}
          style={{ fontSize: 14, fontFamily: 'Fraunces_700Bold_Italic', color: 'rgba(45,24,16,0.5)', marginBottom: 40 }}
        >
          Choose how to capture your skin
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(160).springify()}>
          <TouchableOpacity
            onPress={openCamera}
            style={{
              backgroundColor: '#E07856',
              borderRadius: 24,
              padding: 32,
              marginBottom: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📸</Text>
            <Text style={{ fontSize: 20, fontFamily: 'Fraunces_700Bold', color: 'white' }}>{t('camera')}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'PlusJakartaSans_400Regular', marginTop: 4 }}>
              Best results in natural light
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).springify()}>
          <TouchableOpacity
            onPress={openGallery}
            style={{
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: 'rgba(224,120,86,0.2)',
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🖼️</Text>
            <Text style={{ fontSize: 20, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>{t('gallery')}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(45,24,16,0.5)', fontFamily: 'PlusJakartaSans_400Regular', marginTop: 4 }}>
              Upload an existing photo
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={{ fontSize: 11, color: 'rgba(45,24,16,0.4)', fontFamily: 'PlusJakartaSans_400Regular', textAlign: 'center', marginTop: 24 }}>
          {t('not_medical')}
        </Text>
      </View>
    </View>
  );
}
