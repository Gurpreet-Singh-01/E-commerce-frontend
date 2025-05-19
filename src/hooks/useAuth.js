import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials, updateUser } from '../store/authSlice';
import { logoutUser, refreshAccessToken } from '../services/userService';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(!user && !isAuthenticated);

  useEffect(() => {
    let isMounted = true;

    const tryRefresh = async () => {
      if (!user && !isAuthenticated && isMounted) {
        try {
          setIsLoading(true);
          const { user: refreshedUser } = await refreshAccessToken();
          if (isMounted) {
            dispatch(updateUser({ user: refreshedUser }));
          }
        } catch (error) {
          console.log('Auto-refresh failed:', error);
          if (isMounted) {
            dispatch(logout());
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }else{
        setIsLoading(false);
      }
    };
    tryRefresh();

    return () =>{
      isMounted=false
    }

  }, [dispatch,user,isAuthenticated]);

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

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    user,
    isAuthenticated,
    role: getRole(),
    login,
    refresh,
    logout: logout_User,
    isAdmin,
    isLoading,
  };
};

export default useAuth;
