import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AmbientBlobs from '@/components/AmbientBlobs';
import { useNotificationStore, NotificationItem } from '@/stores/useNotificationStore';

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotificationCard({ item, index }: { item: NotificationItem; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: item.read ? 0 : 3,
          borderLeftColor: '#E07856',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'PlusJakartaSans_600SemiBold',
            color: '#2D1810',
            marginBottom: 4,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'PlusJakartaSans_400Regular',
            color: 'rgba(45,24,16,0.6)',
            lineHeight: 18,
            marginBottom: 6,
          }}
        >
          {item.body}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'PlusJakartaSans_400Regular',
            color: 'rgba(45,24,16,0.35)',
          }}
        >
          {timeAgo(item.receivedAt)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    markAllRead();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />
      <View style={{ flex: 1, zIndex: 10, paddingTop: insets.top + 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 24,
            marginBottom: 24,
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#2D1810" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>
            Notifications
          </Text>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <NotificationCard item={item} index={index} />}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔔</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Fraunces_700Bold',
                  color: '#2D1810',
                  marginBottom: 8,
                }}
              >
                No notifications yet
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans_400Regular',
                  color: 'rgba(45,24,16,0.55)',
                  textAlign: 'center',
                  lineHeight: 20,
                  paddingHorizontal: 32,
                }}
              >
                We'll let you know about tips, reminders, and skin updates here.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
