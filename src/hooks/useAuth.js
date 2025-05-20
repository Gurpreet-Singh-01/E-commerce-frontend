import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials, updateUser } from '../store/authSlice';
import { logoutUser } from '../services/userService';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const publicPaths = ['/', '/products', '/login', '/register'];
      const isPublicPage = publicPaths.some(
        (path) =>
          window.location.pathname === path ||
          window.location.pathname.startsWith('/products/')
      );

      if (isLoggingOut || !isMounted || (isPublicPage && !isAuthenticated)) {
        setIsLoading(false);
        return;
      }

      if (user && isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(false); 
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, user, isAuthenticated, isLoggingOut]);

  const login = (userData) => {
    dispatch(setCredentials({ user: userData }));
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
    logout: logout_User,
    isAdmin,
    isLoading,
  };
};

export default useAuth;