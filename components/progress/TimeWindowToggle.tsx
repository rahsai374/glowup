import React from 'react';
import { View, Text, Pressable } from 'react-native';

export type TimeWindow = 'week' | '4weeks' | 'all';

const OPTIONS: { id: TimeWindow; label: string }[] = [
  { id: 'week', label: '1 week' },
  { id: '4weeks', label: '4 weeks' },
  { id: 'all', label: 'All time' },
];

interface TimeWindowToggleProps {
  active: TimeWindow;
  onChange: (mode: TimeWindow) => void;
}

export default function TimeWindowToggle({ active, onChange }: TimeWindowToggleProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'rgba(45,24,16,0.05)',
        borderRadius: 14,
        padding: 3,
        gap: 2,
      }}
    >
      {OPTIONS.map((opt) => {
        const isActive = active === opt.id;
        return (
          <Pressable key={opt.id} onPress={() => onChange(opt.id)}>
            <View
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 11,
                backgroundColor: isActive ? 'white' : 'transparent',
                shadowColor: isActive ? '#2D1810' : 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isActive ? 0.06 : 0,
                shadowRadius: 4,
                elevation: isActive ? 2 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'PlusJakartaSans_600SemiBold',
                  color: isActive ? '#E07856' : 'rgba(45,24,16,0.55)',
                }}
              >
                {opt.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
