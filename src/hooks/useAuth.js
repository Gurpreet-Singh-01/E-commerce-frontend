import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials, updateUser } from '../store/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const login = (userData) => {
    dispatch(setCredentials({ userData }));
  };

  const refresh = async () => {
    try {
      const response = {
        user: {
          id: '1',
          name: 'test user',
          email: 'test@gmail.com',
          role: 'customer',
        },
      };

      dispatch(updateUser({ user: response.user }));
      return true;
    } catch (error) {
      dispatch(logout());
      return false;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
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
    logout: logoutUser(),
  };
};

export default useAuth;
