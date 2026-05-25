import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { HeroState } from '@/lib/home/types';

interface DynamicActionCardProps {
  state: HeroState;
  onPrimaryPress: () => void;
}

export default function DynamicActionCard({ state, onPrimaryPress }: DynamicActionCardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function onPress() {
    scale.value = withSpring(0.97, { damping: 15 }, (finished) => {
      'worklet';
      if (finished) {
        scale.value = withSpring(1);
        runOnJS(onPrimaryPress)();
      }
    });
  }

  const config = (() => {
    switch (state.kind) {
      case 'first-scan':
        return {
          bg: '#E07856',
          icon: '🔍',
          title: 'Scan your skin',
          titleColor: 'white',
          subtitle: 'Takes 30 seconds',
          subtitleColor: 'rgba(255,255,255,0.75)',
          showProgressBar: false,
          progress: 0,
        };
      case 'routine-in-progress':
        return {
          bg: '#FBF2E0',
          icon: '🌿',
          title: state.period === 'am' ? 'Morning routine' : 'Evening routine',
          titleColor: '#2D1810',
          subtitle: `${state.done} of ${state.total} done`,
          subtitleColor: 'rgba(45,24,16,0.65)',
          showProgressBar: true,
          progress: state.total > 0 ? state.done / state.total : 0,
        };
      case 'stale-scan':
        return {
          bg: '#FFEFE3',
          icon: '✨',
          title: 'Time to re-scan',
          titleColor: '#2D1810',
          subtitle: `It's been ${state.daysSince} days. See how you're doing.`,
          subtitleColor: 'rgba(45,24,16,0.65)',
          showProgressBar: false,
          progress: 0,
        };
      case 'fresh-scan':
        return {
          bg: '#FFEFE3',
          icon: '🎯',
          title: "Today's focus",
          titleColor: '#2D1810',
          subtitle: state.topConcern,
          subtitleColor: 'rgba(45,24,16,0.65)',
          showProgressBar: false,
          progress: 0,
        };
      case 'default-rescan':
        return {
          bg: 'white',
          icon: '🔍',
          title: 'Scan again',
          titleColor: '#2D1810',
          subtitle: 'Track your progress',
          subtitleColor: 'rgba(45,24,16,0.65)',
          showProgressBar: false,
          progress: 0,
        };
    }
  })();

  return (
    <Animated.View style={[animStyle, { marginBottom: 16 }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          backgroundColor: config.bg,
          borderRadius: 32,
          padding: 28,
          borderWidth: state.kind === 'default-rescan' ? 1.5 : 0,
          borderColor: state.kind === 'default-rescan' ? '#E07856' : 'transparent',
          overflow: 'hidden',
        }}
      >
        {state.kind === 'first-scan' && (
          <View style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160, borderRadius: 80,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }} />
        )}
        <Text style={{ fontSize: 36, marginBottom: 10 }}>{config.icon}</Text>
        <Text style={{ fontSize: 22, fontFamily: 'Fraunces_700Bold', color: config.titleColor, marginBottom: 4 }}>
          {config.title}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: config.subtitleColor }}>
          {config.subtitle}
        </Text>
        {config.showProgressBar && (
          <View style={{ marginTop: 14, height: 6, backgroundColor: 'rgba(45,24,16,0.1)', borderRadius: 3 }}>
            <View style={{
              height: 6,
              width: `${Math.round(config.progress * 100)}%`,
              backgroundColor: '#E07856',
              borderRadius: 3,
            }} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
