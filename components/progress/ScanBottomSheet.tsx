import React, { useEffect, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ScanRecord } from '@/stores/useScanStore';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';

const PRIMARY = '#E07856';
const DISMISS_THRESHOLD = 80;

const KEY_METRICS: { key: keyof ScanRecord['metrics']; label: string }[] = [
  { key: 'hydration', label: 'Hydration' },
  { key: 'radiance', label: 'Radiance' },
  { key: 'texture', label: 'Texture' },
  { key: 'dark_spots', label: 'Dark spots' },
];

function metricQuality(score: number): { value: string; color: string } {
  if (score >= 75) return { value: 'Good', color: '#16A34A' };
  if (score >= 60) return { value: 'Fair', color: '#D97706' };
  return { value: 'Needs care', color: '#EF4444' };
}

function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface ScanBottomSheetProps {
  scan: ScanRecord;
  onClose: () => void;
}

export default function ScanBottomSheet({ scan, onClose }: ScanBottomSheetProps) {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const sheetHeight = 440;

  const translateY = useSharedValue(sheetHeight);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(sheetHeight, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(onClose, 300);
  }, [onClose, sheetHeight]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (translateY.value > DISMISS_THRESHOLD) {
        translateY.value = withTiming(sheetHeight, { duration: 300 });
        backdropOpacity.value = withTiming(0, { duration: 300 });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleViewResults = () => {
    dismiss();
    setTimeout(() => {
      router.push({ pathname: '/(tabs)/results', params: { scanId: scan.id } });
    }, 350);
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(45,24,16,0.35)' }, backdropStyle]}>
        <Pressable style={{ flex: 1 }} onPress={dismiss} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingTop: 12,
              paddingHorizontal: 24,
              paddingBottom: 40,
            },
            sheetStyle,
          ]}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(45,24,16,0.15)' }} />
          </View>

          {/* Header: photo + date + score */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            {scan.imageUrl ? (
              <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: PRIMARY, overflow: 'hidden' }}>
                <Image source={{ uri: scan.imageUrl }} style={{ width: '100%', height: '100%' }} />
              </View>
            ) : (
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  borderWidth: 3,
                  borderColor: PRIMARY,
                  backgroundColor: '#FFCDB2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" opacity={0.45}>
                  <SvgCircle cx={12} cy={9} r={4} stroke={PRIMARY} strokeWidth={1.2} />
                  <Path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" stroke={PRIMARY} strokeWidth={1.2} strokeLinecap="round" />
                </Svg>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 22, color: '#2D1810', marginBottom: 2 }}>
                {formatDateFull(scan.createdAt)}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(45,24,16,0.55)' }}>
                Skin analysis result
              </Text>
            </View>
            <Text style={{ fontSize: 38, fontFamily: 'PlusJakartaSans_700Bold', color: PRIMARY }}>
              {scan.overall_score}
            </Text>
          </View>

          {/* Metric rows */}
          <View style={{ gap: 8 }}>
            {KEY_METRICS.map((m) => {
              const score = scan.metrics[m.key];
              const quality = metricQuality(score);
              return (
                <View
                  key={m.key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    backgroundColor: 'rgba(45,24,16,0.03)',
                  }}
                >
                  <View style={{ gap: 2 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
                      {m.label}
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(45,24,16,0.55)' }}>
                      Score {score}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: quality.color + '18',
                      paddingVertical: 5,
                      paddingHorizontal: 11,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontSize: 12.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: quality.color }}>
                      {quality.value}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* View Full Results */}
          <Pressable
            onPress={handleViewResults}
            style={{
              width: '100%',
              marginTop: 20,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: PRIMARY,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'white' }}>
              View Full Results
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
