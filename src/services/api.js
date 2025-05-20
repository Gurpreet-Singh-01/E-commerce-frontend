import axios from 'axios';
import { updateUser, logout } from '../store/authSlice';
import { logoutUser, refreshAccessToken } from './userService';
import { store } from '../store/index';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, user = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(user);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url || '';

    const publicEndpoints = ['/product/', '/category/'];
    const isPublicEndpoint = publicEndpoints.some((endpoint) => url.includes(endpoint));

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
          .then((user) => {
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      isRefreshing = true;

      try {
        console.debug('Interceptor: Refreshing token for', url);
        const { user } = await refreshAccessToken();
        console.debug('Interceptor: Refresh success:', user);
        store.dispatch(updateUser({ user }));
        processQueue(null, user);
        return api(originalRequest);
      } catch (refreshError) {
        console.debug('Interceptor: Refresh failed:', refreshError.message || 'No refresh token');
        processQueue(refreshError);
        // Only logout for invalid tokens
        if (refreshError.response?.status === 401 && refreshError.response?.data?.message.includes('Invalid refresh token')) {
          store.dispatch(logout());
        }
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
    const safeError = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(safeError));
  }
);

export default api;