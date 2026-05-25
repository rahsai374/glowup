import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface QuickActionTileProps {
  icon: string;
  label: string;
  bg: string;
  borderColor: string;
  onPress: () => void;
}

export default function QuickActionTile({ icon, label, bg, borderColor, onPress }: QuickActionTileProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: 20,
        padding: 20,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 8 }}>{icon}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#2D1810' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
