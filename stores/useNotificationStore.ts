import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  receivedAt: string;
  read: boolean;
}

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  permissionStatus: 'undetermined' | 'granted' | 'denied';
  expoPushToken: string | null;
  addNotification: (item: Omit<NotificationItem, 'read'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  setPermissionStatus: (status: 'undetermined' | 'granted' | 'denied') => void;
  setExpoPushToken: (token: string | null) => void;
  clearNotifications: () => void;
}

const MAX_NOTIFICATIONS = 50;

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      permissionStatus: 'undetermined',
      expoPushToken: null,

      addNotification: (item) =>
        set((state) => {
          const newItem: NotificationItem = { ...item, read: false };
          const updated = [newItem, ...state.notifications].slice(0, MAX_NOTIFICATIONS);
          return { notifications: updated, unreadCount: state.unreadCount + 1 };
        }),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      markRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          );
          const unreadCount = notifications.filter((n) => !n.read).length;
          return { notifications, unreadCount };
        }),

      setPermissionStatus: (status) => set({ permissionStatus: status }),
      setExpoPushToken: (token) => set({ expoPushToken: token }),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'glowup-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
