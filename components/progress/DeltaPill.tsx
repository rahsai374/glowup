import React from 'react';
import { View, Text } from 'react-native';

interface DeltaPillProps {
  diff: number;
}

export default function DeltaPill({ diff }: DeltaPillProps) {
  const neutral = diff === 0;
  const positive = diff > 0;

  const bgColor = neutral ? '#F3F4F6' : positive ? '#DCFCE7' : '#FEF3C7';
  const textColor = neutral ? '#6B7280' : positive ? '#16A34A' : '#D97706';
  const dotColor = neutral ? '#9CA3AF' : positive ? '#4ADE80' : '#FACC15';
  const label = neutral
    ? 'No change · staying steady'
    : positive
      ? `↑ ${diff} point${diff === 1 ? '' : 's'} improvement`
      : `↓ ${Math.abs(diff)} point${Math.abs(diff) === 1 ? '' : 's'} · small dip`;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        gap: 6,
        backgroundColor: bgColor,
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 20,
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dotColor }} />
      <Text
        style={{
          fontSize: 12.5,
          fontFamily: 'PlusJakartaSans_600SemiBold',
          color: textColor,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
