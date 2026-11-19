import { create } from 'zustand';
import api from '../api/axios';

const useChatStore = create((set, get) => ({
  conversations: [],
  totalUnread: 0,
  loadingList: false,

  activeId: null,
  conversation: null,
  messages: [],
  loadingThread: false,
  sending: false,
  error: null,

  fetchConversations: async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      set({ conversations: data.conversations, totalUnread: data.totalUnread, loadingList: false });
    } catch (err) {
      set({ loadingList: false, error: err.message });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await api.get('/chat/unread-count');
      set({ totalUnread: data.unread });
    } catch { /* badge is non-critical */ }
  },

  openConversation: async (id, { silent = false } = {}) => {
    if (!silent) set({ loadingThread: true, activeId: id, messages: [], conversation: null, error: null });
    try {
      const { data } = await api.get(`/chat/conversations/${id}/messages`);
      set({
        activeId: id,
        conversation: data.conversation,
        messages: data.messages,
        loadingThread: false,
      });
      get().fetchUnreadCount();
      return data.conversation;
    } catch (err) {
      set({ loadingThread: false, error: err.message });
      throw err;
    }
  },

  pollNewMessages: async () => {
    const { activeId, messages } = get();
    if (!activeId) return;
    const lastId = messages.length ? messages[messages.length - 1].id : 0;
    try {
      const { data } = await api.get(`/chat/conversations/${activeId}/messages`, {
        params: lastId ? { after: lastId } : undefined,
      });
      if (data.messages.length) {
        set((s) => ({ messages: [...s.messages, ...data.messages] }));
        get().fetchUnreadCount();
      }
    } catch { /* a dropped poll is harmless */ }
  },

  sendMessage: async ({ body, file }) => {
    const id = get().activeId;
    if (!id) return null;
    set({ sending: true, error: null });
    try {
      let data;
      if (file) {
        const fd = new FormData();
        if (body) fd.append('body', body);
        fd.append('file', file);
        ({ data } = await api.post(`/chat/conversations/${id}/messages`, fd));
      } else {
        ({ data } = await api.post(`/chat/conversations/${id}/messages`, { body }));
      }
      set((s) => ({ messages: [...s.messages, data.message], sending: false }));
      get().fetchConversations();
      return data.message;
    } catch (err) {
      set({ sending: false, error: err.message });
      throw err;
    }
  },

  openForJob: async (jobId, workerId) => {
    const { data } = await api.post(`/chat/conversations/job/${jobId}`, workerId ? { workerId } : {});
    return data.conversation;
  },

  reset: () => set({
    conversations: [], totalUnread: 0, activeId: null,
    conversation: null, messages: [], error: null,
  }),
}));

export default useChatStore;
