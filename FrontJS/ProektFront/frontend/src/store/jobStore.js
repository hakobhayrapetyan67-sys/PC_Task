import { create } from 'zustand';
import api from '../api/axios';

const useJobStore = create((set) => ({
  jobs: [],
  
  fetchJobs: async () => {
    const res = await api.get('/jobs');
    set({ jobs: res.data });
  },

  createJob: async (jobData) => {
    const res = await api.post('/jobs', jobData);
    set((state) => ({ jobs: [res.data, ...state.jobs] }));
  }
}));
export default useJobStore;