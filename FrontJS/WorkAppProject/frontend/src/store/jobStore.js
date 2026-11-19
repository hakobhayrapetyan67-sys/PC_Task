import { create } from 'zustand';
import api from '../api/axios';

const EMPTY_FILTERS = {
  search: '', category: '', location: '', workMode: '',
  employmentType: '', minSalary: '', maxSalary: '', sort: 'newest',
};

const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v != null));

const useJobStore = create((set, get) => ({
  jobs: [],
  total: 0,
  page: 1,
  totalPages: 1,
  filters: { ...EMPTY_FILTERS },
  loading: false,
  error: null,

  meta: { categories: [], employmentTypes: [], workModes: [], locations: [] },

  setFilter: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: { ...EMPTY_FILTERS } }),

  fetchMeta: async () => {
    try {
      const { data } = await api.get('/jobs/meta');
      set({ meta: data });
    } catch { /* dropdowns fall back to their defaults */ }
  },

  fetchJobs: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/jobs', {
        params: { ...clean(get().filters), page, limit: 12 },
      });
      set({
        jobs: data.jobs, total: data.total, page: data.page,
        totalPages: data.totalPages, loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err.message, jobs: [], total: 0, totalPages: 1 });
    }
  },

  fetchMyJobs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/jobs/mine');
      set({ jobs: data.jobs, total: data.jobs.length, loading: false, page: 1, totalPages: 1 });
    } catch (err) {
      set({ loading: false, error: err.message, jobs: [] });
    }
  },

  createJob: async (payload) => {
    const { data } = await api.post('/jobs', payload);
    set((s) => ({ jobs: [data.job, ...s.jobs], total: s.total + 1 }));
    return data.job;
  },

  updateJob: async (id, payload) => {
    const { data } = await api.patch(`/jobs/${id}`, payload);
    set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? data.job : j)) }));
    return data.job;
  },

  deleteJob: async (id) => {
    await api.delete(`/jobs/${id}`);
    set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id), total: Math.max(0, s.total - 1) }));
  },

  patchJobLocally: (id, patch) =>
    set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) })),
}));

export default useJobStore;
