import React from 'react';
import { View } from 'react-native';

export default function AmbientBlobs() {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 288,
          height: 288,
          borderRadius: 144,
          backgroundColor: 'rgba(224,120,86,0.13)',
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          top: 340,
          left: -80,
          width: 256,
          height: 256,
          borderRadius: 128,
          backgroundColor: 'rgba(212,165,116,0.17)',
        }}
        pointerEvents="none"
      />
    </>
  );
}
