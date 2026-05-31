import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';
import type { Gender } from '@/stores/useUserStore';

interface Props {
  gender: Gender;
  size?: number;
}

function MaleAvatar({ size }: { size: number }) {
  const s = size * 0.6;
  return (
    <Svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Head */}
      <Circle cx="24" cy="20" r="9" stroke="#2D1810" strokeWidth="2" />
      {/* Short hair */}
      <Path d="M15 18c0-6 4-11 9-11s9 5 9 11" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
      {/* Shoulders */}
      <Path d="M10 44c0-8 6-14 14-14s14 6 14 14" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function FemaleAvatar({ size }: { size: number }) {
  const s = size * 0.6;
  return (
    <Svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Head */}
      <Ellipse cx="24" cy="20" rx="8.5" ry="9" stroke="#2D1810" strokeWidth="2" />
      {/* Long hair */}
      <Path d="M14 16c0-7 4.5-12 10-12s10 5 10 12" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
      <Path d="M14 16c-1 4-1 10 0 14" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
      <Path d="M34 16c1 4 1 10 0 14" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
      {/* Shoulders */}
      <Path d="M12 44c0-7 5.5-13 12-13s12 6 12 13" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function NeutralAvatar({ size }: { size: number }) {
  const s = size * 0.6;
  return (
    <Svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Head */}
      <Circle cx="24" cy="20" r="9" stroke="#2D1810" strokeWidth="2" />
      {/* Medium hair */}
      <Path d="M15 17c0-6.5 4-11 9-11s9 4.5 9 11" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
      <Path d="M15 17c-0.5 2.5-0.5 5 0 7" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
      <Path d="M33 17c0.5 2.5 0.5 5 0 7" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
      {/* Shoulders */}
      <Path d="M11 44c0-7.5 5.8-13.5 13-13.5s13 6 13 13.5" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export default function ProfileAvatar({ gender, size = 80 }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFF5EE',
        borderWidth: 2,
        borderColor: '#E07856',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {gender === 'male' && <MaleAvatar size={size} />}
      {gender === 'female' && <FemaleAvatar size={size} />}
      {gender === 'unspecified' && <NeutralAvatar size={size} />}
    </View>
  );
}
