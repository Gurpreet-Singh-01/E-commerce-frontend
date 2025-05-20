import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials, updateUser } from '../store/authSlice';
import { logoutUser, refreshAccessToken } from '../services/userService';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const tryRefresh = async () => {
      const publicPaths = ['/', '/products', '/login', '/register'];
      const isPublicPage = publicPaths.some(
        (path) =>
          window.location.pathname === path ||
          window.location.pathname.startsWith('/products/')
      );

      if (
        isLoggingOut ||
        user ||
        isAuthenticated ||
        hasTriedRefresh ||
        !isMounted ||
        isPublicPage
      ) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.debug('Attempting refresh token');
        const { user: refreshedUser } = await refreshAccessToken();
        console.debug('Refresh success:', refreshedUser);
        if (isMounted) {
          dispatch(updateUser({ user: refreshedUser }));
        }
      } catch (error) {
        console.debug('Refresh failed:', error.message || 'No refresh token');
        // Only logout if explicitly invalid token
        if (isMounted && error.response?.status === 401 && error.response?.data?.message.includes('Invalid refresh token')) {
          dispatch(logout());
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasTriedRefresh(true);
        }
      }
    };

    tryRefresh();

    return () => {
      isMounted = false;
    };
  }, [dispatch, hasTriedRefresh, isLoggingOut]);

  const login = (userData) => {
    dispatch(setCredentials({ user: userData }));
  };

  const refresh = async () => {
    try {
      const { user } = await refreshAccessToken();
      console.debug('Manual refresh success:', user);
      dispatch(updateUser({ user }));
      return true;
    } catch (error) {
      console.debug('Manual refresh failed:', error.message || 'No refresh token');
      return false;
    }
  };

  const logout_User = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      dispatch(logout());
    } catch (error) {
      console.debug('Logout error:', error.message || 'Logout failed');
      dispatch(logout());
    } finally {
      setIsLoggingOut(false);
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
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