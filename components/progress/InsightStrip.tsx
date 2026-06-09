import React from 'react';
import { View, Text } from 'react-native';

interface InsightStripProps {
  text: string;
  highlightWord: string;
  supportive?: boolean;
}

export default function InsightStrip({ text, highlightWord, supportive }: InsightStripProps) {
  const parts = text.split(highlightWord);

  return (
    <View
      style={{
        backgroundColor: supportive ? '#FFF5EE' : '#FBF2E0',
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: supportive ? 'rgba(224,120,86,0.12)' : 'rgba(212,165,116,0.25)',
      }}
    >
      <View style={{ position: 'absolute', top: 12, left: 16 }}>
        <Text style={{ fontSize: 16, lineHeight: 16 }}>{supportive ? '💛' : '✨'}</Text>
      </View>
      <Text
        style={{
          fontSize: 13,
          lineHeight: 20,
          color: '#2D1810',
          fontFamily: 'PlusJakartaSans_400Regular',
          paddingLeft: 28,
        }}
      >
        {parts[0]}
        <Text style={{ fontFamily: 'Fraunces_700Bold_Italic' }}>{highlightWord}</Text>
        {parts[1]}
      </Text>
    </View>
  );
}
