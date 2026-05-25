import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, ImageBackground } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/stores/useUserStore';
import { useScanStore } from '@/stores/useScanStore';
import { analyzeSkin } from '@/lib/gemini';

const { width, height } = Dimensions.get('window');
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
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const { setCurrentScan, addToHistory } = useScanStore();

  const scanY = useSharedValue(0);
  const scanStyle = useAnimatedStyle(() => ({ transform: [{ translateY: scanY.value }] }));

  const factIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setState('camera');
  }

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo) await processImage(photo.uri);
  }

  async function processImage(uri: string) {
    setCapturedUri(uri);
    setState('analyzing');
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
        user?.skinType ?? 'normal'
      );
      const scan = { ...result, id: `scan_${Date.now()}`, createdAt: new Date().toISOString(), imageUrl: uri };
      setCurrentScan(scan);
      addToHistory(scan);
      stopScanning();
      router.replace('/results');
    } catch (e: any) {
      stopScanning();
      console.error('[SCAN ERROR]', e?.message ?? e);
      Alert.alert('Scan failed', e?.message ?? String(e));
      setState('choice');
    }
  }

  if (state === 'camera') {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front">
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, marginBottom: 20 }}>
              {t('position_face')}
            </Text>
            <View
              style={{
                width: 240,
                height: 320,
                borderRadius: 120,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.5)',
                borderStyle: 'dashed',
              }}
            />
          </View>
          <View style={{ paddingBottom: 60, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={takePhoto}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'white',
                borderWidth: 4,
                borderColor: 'rgba(255,255,255,0.5)',
              }}
            />
          </View>
        </CameraView>
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
