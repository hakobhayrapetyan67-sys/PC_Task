import { create } from 'zustand';
import api from '../api/axios';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unread: 0,
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/profile/notifications');
      set({ notifications: data.notifications, unread: data.unread, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  markRead: async (id) => {
    try {
      const { data } = await api.post(`/profile/notifications/${id}/read`);
      set((s) => ({
        unread: data.unread,
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        ),
      }));
    } catch { /* ignore */ }
  },

  markAllRead: async () => {
    try {
      await api.post('/profile/notifications/all/read');
      const now = new Date().toISOString();
      set((s) => ({
        unread: 0,
        notifications: s.notifications.map((n) => ({ ...n, readAt: n.readAt ?? now })),
      }));
    } catch { /* ignore */ }
  },

  reset: () => set({ notifications: [], unread: 0 }),

  get hasUnread() { return get().unread > 0; },
}));

export default useNotificationStore;
