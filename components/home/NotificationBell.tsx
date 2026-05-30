import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationBellProps {
  unreadCount: number;
  onPress: () => void;
}

export default function NotificationBell({ unreadCount, onPress }: NotificationBellProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'relative', padding: 4 }}>
      <Ionicons name="notifications-outline" size={24} color="#2D1810" />
      {unreadCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: '#E07856',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'PlusJakartaSans_700Bold',
              color: 'white',
              lineHeight: 13,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
