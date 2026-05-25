import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface Props {
  label: string;
  score: number;
  delay?: number;
}

function severityColor(score: number) {
  if (score > 75) return '#4ADE80';
  if (score > 50) return '#FACC15';
  if (score > 25) return '#FB923C';
  return '#F87171';
}

export default function MetricBar({ label, score, delay = 0 }: Props) {
  const width = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      width.value = withTiming(score, { duration: 900 });
    }, delay);
    return () => clearTimeout(t);
  }, [score]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontSize: 13, color: '#2D1810', fontWeight: '500' }}>{label}</Text>
        <Text style={{ fontSize: 13, color: '#2D1810', fontWeight: '700' }}>{score}</Text>
      </View>
      <View
        style={{ height: 6, backgroundColor: 'rgba(45,24,16,0.08)', borderRadius: 3, overflow: 'hidden' }}
      >
        <Animated.View
          style={[barStyle, { height: 6, backgroundColor: severityColor(score), borderRadius: 3 }]}
        />
      </View>
    </View>
  );
}
