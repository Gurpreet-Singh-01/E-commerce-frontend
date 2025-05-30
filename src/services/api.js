import axios from 'axios';
import { updateUser, logout } from '../store/authSlice';
import { refreshAccessToken } from './userService';
import { store } from '../store/index';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (
    config.data &&
    !(config.data instanceof FormData) &&
    !config.headers['Content-Type']
  ) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    const publicEndpoints = ['/product/', '/category/', '/login'];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      url.includes(endpoint)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !url.includes('/refresh') &&
      !url.includes('/logout') &&
      !isPublicEndpoint
    ) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      isRefreshing = true;

      try {
        console.log('Refreshing token...');
        const user = await refreshAccessToken();
        if (!user || !user._id) {
          throw new Error('Invalid user data after token refresh');
        }
        store.dispatch(updateUser({ user }));
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        console.log('Refresh failed:', refreshError.message);
        processQueue(refreshError);
        store.dispatch(logout());
        const publicPaths = ['/', '/products', '/login', '/register'];
        const isPublicPage = publicPaths.some(
          (path) =>
            window.location.pathname === path ||
            window.location.pathname.startsWith('/products/')
        );
        if (!isPublicPage && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const safeError =
      error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(safeError));
  }
);

export default api;
