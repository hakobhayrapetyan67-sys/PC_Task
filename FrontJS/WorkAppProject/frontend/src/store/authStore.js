import { create } from 'zustand';
import api, { TOKEN_KEY, USER_KEY, setUnauthorizedHandler } from '../api/axios';

function readStored() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) throw new Error('incomplete');
    const user = JSON.parse(raw);
    if (!user || typeof user !== 'object' || !user.role) throw new Error('invalid');
    return { user, token, isAuthenticated: true };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { user: null, token: null, isAuthenticated: false };
  }
}

const persist = (user, token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const useAuthStore = create((set, get) => ({
  ...readStored(),
  booting: Boolean(localStorage.getItem(TOKEN_KEY)),
  loading: false,

  bootstrap: async () => {
    if (!get().token) return set({ booting: false });
    try {
      const { data } = await api.get('/auth/me');
      persist(data.user, get().token);
      set({ user: data.user, isAuthenticated: true, booting: false });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, booting: false });
    }
  },

  login: async (credentials) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', credentials);
      persist(data.user, data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
      return data.user;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', payload);
      persist(data.user, data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch { /* offline is fine */ }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => {
    const token = get().token;
    if (token) persist(user, token);
    set({ user });
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      get().setUser(data.user);
      return data.user;
    } catch { return null; }
  },

  resendVerification: async () => {
    const { data } = await api.post('/auth/resend-verification');
    return data;
  },
}));

setUnauthorizedHandler(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  if (window.location.pathname !== '/login') window.location.replace('/login');
});

export default useAuthStore;
