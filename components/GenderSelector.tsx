import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import type { Gender } from '@/stores/useUserStore';

const OPTIONS: { value: Gender; labelKey: string }[] = [
  { value: 'male', labelKey: 'q6_male' },
  { value: 'female', labelKey: 'q6_female' },
  { value: 'unspecified', labelKey: 'q6_unspecified' },
];

interface Props {
  value: Gender | '';
  onChange: (g: Gender) => void;
}

function Pill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ flex: 1 }, animStyle]}>
      <TouchableOpacity
        onPress={() => {
          scale.value = withSpring(0.93, { damping: 12 }, () => { scale.value = withSpring(1); });
          onPress();
        }}
        activeOpacity={0.8}
        style={{
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: 'center',
          backgroundColor: selected ? '#E07856' : 'transparent',
          borderWidth: selected ? 0 : 1.5,
          borderColor: 'rgba(224,120,86,0.12)',
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'PlusJakartaSans_600SemiBold',
            color: selected ? 'white' : '#2D1810',
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function GenderSelector({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View>
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: 'rgba(45,24,16,0.6)',
          marginBottom: 10,
        }}
      >
        {t('q6_helper')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {OPTIONS.map((opt) => (
          <Pill
            key={opt.value}
            label={t(opt.labelKey)}
            selected={value === opt.value}
            onPress={() => onChange(opt.value)}
          />
        ))}
      </View>
    </View>
  );
}
