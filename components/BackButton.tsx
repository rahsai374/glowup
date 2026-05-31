import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type BackButtonProps = {
  onPress?: () => void;
  variant?: 'light' | 'dark';
};

export default function BackButton({ onPress, variant = 'light' }: BackButtonProps) {
  const router = useRouter();
  const isLight = variant === 'light';

  return (
    <TouchableOpacity
      accessibilityLabel="Go back"
      accessibilityRole="button"
      onPress={onPress ?? (() => router.back())}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isLight ? 'white' : 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        ...(isLight
          ? {
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }
          : {}),
      }}
    >
      <Ionicons name="arrow-back" size={20} color={isLight ? '#2D1810' : 'white'} />
    </TouchableOpacity>
  );
}
