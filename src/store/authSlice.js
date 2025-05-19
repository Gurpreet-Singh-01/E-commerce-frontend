import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // user: null,
  // isAuthenticated: false,

  // below temp for navbar
  user: {id:"something",
    name:"Gurpreet",
    role:"customer",
    email:"guri29122003@gmail.com"
  },
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
