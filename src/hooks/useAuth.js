import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials, updateUser } from '../store/authSlice';
import { logoutUser, refreshAccessToken } from '../services/userService';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true); // Start as true to prevent premature rendering
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

      // Skip refresh if already logging out or on a public page
      if (isLoggingOut || !isMounted || (isPublicPage && !isAuthenticated)) {
        setIsLoading(false);
        return;
      }

      // If the user is already authenticated (from persisted state), no need to refresh
      if (user && isAuthenticated) {
        setIsLoading(false);
        return;
      }

      // Skip if we've already tried refreshing
      if (hasTriedRefresh) {
        setIsLoading(false);
        return;
      }

      try {
        setHasTriedRefresh(true);
        console.debug('Attempting refresh token');
        const refreshedUser = await refreshAccessToken(); // Should return the user object directly
        console.debug('Refresh success:', refreshedUser);
        if (isMounted) {
          dispatch(updateUser({ user: refreshedUser }));
        }
      } catch (error) {
        console.debug('Refresh failed:', error.message || 'No refresh token');
        // Only logout if explicitly invalid token
        if (
          isMounted &&
          error.response?.status === 401 &&
          error.response?.data?.message.includes('Invalid refresh token')
        ) {
          dispatch(logout());
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    tryRefresh();

    return () => {
      isMounted = false;
    };
  }, [dispatch, user, isAuthenticated, isLoggingOut, hasTriedRefresh]);

  const login = (userData) => {
    dispatch(setCredentials({ user: userData }));
  };

  const refresh = async () => {
    try {
      const refreshedUser = await refreshAccessToken();
      console.debug('Manual refresh success:', refreshedUser);
      dispatch(updateUser({ user: refreshedUser }));
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