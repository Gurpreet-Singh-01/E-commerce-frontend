import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const loadPersistedState = () => {
  const persistedState = localStorage.getItem('authState');
  if (persistedState) {
    return JSON.parse(persistedState);
  }
  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState = loadPersistedState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // Persist the updated state to localStorage
      localStorage.setItem('authState', JSON.stringify(state));
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // Persist the updated state to localStorage
      localStorage.setItem('authState', JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear persisted state from localStorage
      localStorage.removeItem('authState');
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;