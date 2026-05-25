import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MicroTip } from '@/lib/home/types';

interface ContextualTipCardProps {
  tip: MicroTip;
  concernLabel: string | null; // e.g. "dark spots" — null means show general header
  isDone: boolean;
  onMarkDone: () => void;
  enterDelay?: number;
}

export default function ContextualTipCard({ tip, concernLabel, isDone, onMarkDone, enterDelay = 0 }: ContextualTipCardProps) {
  const doneStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDone ? 0.6 : 1, { duration: 300 }),
  }));

  const header = concernLabel
    ? `🟤 For your ${concernLabel}`
    : '✨ Daily glow tip';

  return (
    <Animated.View
      entering={FadeInDown.delay(enterDelay).springify()}
      style={doneStyle}
    >
      <View style={{
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#FBF2E0',
        borderWidth: 1,
        borderColor: 'rgba(212,165,116,0.2)',
      }}>
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#D4A574', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
          {header}
        </Text>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>{tip.emoji}</Text>
        <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 4 }}>
          {tip.title}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.65)', lineHeight: 20, marginBottom: 16 }}>
          {tip.body}
        </Text>
        <TouchableOpacity
          onPress={isDone ? undefined : onMarkDone}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: isDone ? 'rgba(224,120,86,0.1)' : '#E07856',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: isDone ? '#E07856' : 'white' }}>
            {isDone ? 'Done ✓' : 'Mark as done ✓'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
