import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Line } from 'react-native-svg';

function HomeIcon({ focused }: { focused: boolean }) {
  const color = focused ? '#E07856' : 'rgba(45,24,16,0.5)';
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#E07856', marginTop: 1 }} />}
    </View>
  );
}

function ProfileIcon({ focused }: { focused: boolean }) {
  const color = focused ? '#E07856' : 'rgba(45,24,16,0.5)';
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4 20C4 17.33 7.58 15 12 15C16.42 15 20 17.33 20 20"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
      {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#E07856', marginTop: 1 }} />}
    </View>
  );
}

function TrendingUpIcon({ focused }: { focused: boolean }) {
  const color = focused ? '#E07856' : 'rgba(45,24,16,0.5)';
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 17L9 11L13 15L21 7"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15 7H21V13"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#E07856', marginTop: 1 }} />}
    </View>
  );
}

function ProductBottleIcon({ focused }: { focused: boolean }) {
  const color = focused ? '#E07856' : 'rgba(45,24,16,0.5)';
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        {/* bottle body */}
        <Rect x={6} y={8} width={12} height={13} rx={3} stroke={color} strokeWidth={2} />
        {/* bottle neck */}
        <Rect x={9} y={4} width={6} height={4} rx={1} stroke={color} strokeWidth={2} />
        {/* two label lines */}
        <Line x1={9} y1={13} x2={15} y2={13} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <Line x1={9} y1={16} x2={15} y2={16} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
      {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#E07856', marginTop: 1 }} />}
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
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => <TrendingUpIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="product-check"
        options={{
          title: 'Product',
          tabBarIcon: ({ focused }) => <ProductBottleIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
      <Tabs.Screen name="results" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="routine" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="share" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="notifications" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}
