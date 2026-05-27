import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: 'white',
          borderTopWidth: 0,
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'PlusJakartaSans_600SemiBold',
        },
        tabBarActiveTintColor: '#E07856',
        tabBarInactiveTintColor: 'rgba(45,24,16,0.5)',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20 }}>💡</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
