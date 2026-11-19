import { create } from 'zustand';

let nextId = 1;

const useUiStore = create((set, get) => ({
  toasts: [],

  push: ({ variant = 'info', title, text, timeout = 4500 }) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, variant, title, text }] }));
    if (timeout) setTimeout(() => get().dismiss(id), timeout);
    return id;
  },

  success: (title, text) => get().push({ variant: 'success', title, text }),
  error: (title, text) => get().push({ variant: 'error', title, text, timeout: 7000 }),
  info: (title, text) => get().push({ variant: 'info', title, text }),

  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

export const toast = {
  success: (t, x) => useUiStore.getState().success(t, x),
  error: (t, x) => useUiStore.getState().error(t, x),
  info: (t, x) => useUiStore.getState().info(t, x),
};

export default useUiStore;
