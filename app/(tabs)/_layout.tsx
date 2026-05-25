import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: focused ? '#E07856' : 'transparent',
        minWidth: 64,
      }}
    >
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'PlusJakartaSans_600SemiBold',
          color: focused ? 'white' : 'rgba(45,24,16,0.5)',
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 12,
          left: 24,
          right: 24,
          backgroundColor: 'white',
          borderRadius: 20,
          height: 72,
          paddingBottom: 0,
          borderTopWidth: 0,
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 40,
          elevation: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📊" label="Progress" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="💡" label="Tips" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
