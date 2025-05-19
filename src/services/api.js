import axios from 'axios';
import { updateUser, logout } from '../store/authSlice';
import { logoutUser, refreshAccessToken } from './userService';
import { store } from '../store/index';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { user } = await refreshAccessToken();
        store.dispatch(updateUser({ user }));
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        await logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
