import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface HomeHeaderProps {
  name: string;
  greeting: string; // already-resolved string from i18n, e.g. "Good morning"
  onAvatarPress: () => void;
}

export default function HomeHeader({ name, greeting, onAvatarPress }: HomeHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
      <View>
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#E07856', letterSpacing: 2.5, textTransform: 'uppercase' }}>
          {greeting}
        </Text>
        <Text style={{ fontSize: 28, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>
          {name} ✨
        </Text>
      </View>
      <TouchableOpacity
        onPress={onAvatarPress}
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Text style={{ fontSize: 22 }}>👩🏽</Text>
      </TouchableOpacity>
    </View>
  );
}
