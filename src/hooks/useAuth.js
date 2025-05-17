import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials, updateUser } from '../store/authSlice';
import { logoutUser, refreshAccessToken } from '../services/userService';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const login = (userData) => {
    dispatch(setCredentials({ user: userData }));
  };

  const refresh = async () => {
    try {
      const { user } = await refreshAccessToken();
      dispatch(updateUser({ user }));
      return true;
    } catch (error) {
      dispatch(logout());
      return false;
    }
  };

  const logout_User = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (error) {
      console.log('use auth error', error);
      dispatch(logout());
    }
  };

  const getRole = () => {
    return user?.role || null;
  };

  return {
    user,
    isAuthenticated,
    role: getRole(),
    login,
    refresh,
    logout: logout_User,
  };
};

export default useAuth;
