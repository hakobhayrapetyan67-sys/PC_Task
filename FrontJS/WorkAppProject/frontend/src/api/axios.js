import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
});

export const TOKEN_KEY = 'workx.token';
export const USER_KEY = 'workx.user';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  return config;
});

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const onAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']
      .includes(window.location.pathname);

    if (status === 401 && !onAuthPage) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (onUnauthorized) onUnauthorized();
      else window.location.replace('/login');
    }

    error.message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'Request timed out. Is the backend running on port 5001?'
        : error.code === 'ERR_NETWORK'
          ? 'Cannot reach the server. Start the backend on port 5001.'
          : error.message) ||
      'Unexpected error';

    error.code = error.response?.data?.code || error.code;
    return Promise.reject(error);
  }
);

export default api;
