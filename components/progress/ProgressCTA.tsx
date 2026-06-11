import React from 'react';
import { Text, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface ProgressCTAProps {
  label: string;
  outlined?: boolean;
  onPress: () => void;
}

const PRIMARY = '#E07856';

export default function ProgressCTA({ label, outlined, onPress }: ProgressCTAProps) {
  const strokeColor = outlined ? PRIMARY : 'white';

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 20,
        backgroundColor: outlined ? 'transparent' : PRIMARY,
        borderWidth: outlined ? 1.5 : 0,
        borderColor: outlined ? PRIMARY : 'transparent',
        shadowColor: outlined ? 'transparent' : PRIMARY,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: outlined ? 0 : 0.21,
        shadowRadius: 20,
        elevation: outlined ? 0 : 6,
      }}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-3l-2-2H10L8 7H5c-1.1 0-2 .9-2 2z"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Circle cx={12} cy={13} r={3.5} stroke={strokeColor} strokeWidth={2} />
      </Svg>
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'PlusJakartaSans_600SemiBold',
          color: outlined ? PRIMARY : 'white',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
