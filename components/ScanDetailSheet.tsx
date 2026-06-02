import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScanRecord } from '@/stores/useScanStore';
import ScoreCircle from '@/components/ScoreCircle';
import { logEvent, EVENTS } from '@/lib/analytics';

interface Props {
  scan: ScanRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const SPRING_CONFIG = { damping: 20, stiffness: 200 };

export default function ScanDetailSheet({ scan, isOpen, onClose }: Props) {
  const { height: screenHeight } = useWindowDimensions();
  const sheetHeight = screenHeight * 0.65;
  const translateY = useSharedValue(sheetHeight);
  const router = useRouter();
  const { t } = useTranslation();
  const [lastScan, setLastScan] = useState<ScanRecord | null>(null);

  useEffect(() => {
    if (scan) setLastScan(scan);
  }, [scan]);

  const displayScan = scan ?? lastScan;

  useEffect(() => {
    translateY.value = withSpring(isOpen ? 0 : sheetHeight, SPRING_CONFIG);
  }, [isOpen, sheetHeight]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > sheetHeight * 0.3 || e.velocityY > 500) {
        translateY.value = withSpring(sheetHeight, SPRING_CONFIG);
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - translateY.value / sheetHeight,
  }));

  const handleSeeFullAnalysis = () => {
    if (!displayScan) return;
    logEvent(EVENTS.SCAN_HISTORY_FULL_ANALYSIS, {
      scan_id: displayScan.id,
      overall_score: displayScan.overall_score,
    });
    onClose();
    router.push({ pathname: '/(tabs)/results', params: { scanId: displayScan.id } } as any);
  };

  if (!displayScan && !isOpen) return null;

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      <Animated.View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }, backdropStyle]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: sheetHeight,
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 20,
            },
            sheetStyle,
          ]}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(45,24,16,0.15)',
              }}
            />
          </View>

          {displayScan && (
            <View style={{ flex: 1, paddingHorizontal: 24, alignItems: 'center' }}>
              {/* Score */}
              <ScoreCircle score={displayScan.overall_score} size={96} />

              {/* Date */}
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans_500Medium',
                  color: 'rgba(45,24,16,0.5)',
                  marginTop: 8,
                }}
              >
                {new Date(displayScan.createdAt).toLocaleDateString()}
              </Text>

              {/* Skin age + type */}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#FFF5EE',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ fontSize: 18, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>
                    {displayScan.skin_age}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: 'rgba(45,24,16,0.55)',
                      fontFamily: 'PlusJakartaSans_500Medium',
                    }}
                  >
                    {t('skin_age')}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#FFF5EE',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Fraunces_700Bold',
                      color: '#2D1810',
                      textTransform: 'capitalize',
                    }}
                  >
                    {displayScan.skin_type}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: 'rgba(45,24,16,0.55)',
                      fontFamily: 'PlusJakartaSans_500Medium',
                    }}
                  >
                    {t('skin_type')}
                  </Text>
                </View>
              </View>

              {/* Concern + Win */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, alignSelf: 'stretch' }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#FEE2E2',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: 'PlusJakartaSans_700Bold',
                      color: '#F87171',
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {t('top_concern')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'PlusJakartaSans_600SemiBold',
                      color: '#2D1810',
                    }}
                  >
                    {displayScan.top_concern}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#DCFCE7',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: 'PlusJakartaSans_700Bold',
                      color: '#4ADE80',
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {t('top_win')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'PlusJakartaSans_600SemiBold',
                      color: '#2D1810',
                    }}
                  >
                    {displayScan.top_win}
                  </Text>
                </View>
              </View>

              {/* Advice */}
              <View
                style={{
                  backgroundColor: '#FBF2E0',
                  borderRadius: 14,
                  padding: 14,
                  marginTop: 14,
                  alignSelf: 'stretch',
                  borderWidth: 1,
                  borderColor: 'rgba(212,165,116,0.2)',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans_400Regular',
                    color: '#2D1810',
                    lineHeight: 18,
                  }}
                  numberOfLines={3}
                >
                  {displayScan.advice}
                </Text>
              </View>

              {/* See Full Analysis */}
              <TouchableOpacity
                onPress={handleSeeFullAnalysis}
                style={{
                  backgroundColor: '#E07856',
                  borderRadius: 20,
                  paddingVertical: 14,
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 15,
                    fontFamily: 'PlusJakartaSans_700Bold',
                  }}
                >
                  {t('see_full_analysis')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
