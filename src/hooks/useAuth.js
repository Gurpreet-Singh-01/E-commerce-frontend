import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../store/authSlice';
import { setCart } from '../store/cartSlice';
import { getUserProfile, logoutUser, refreshAccessToken } from '../services/userService';
import { getCart } from '../services/cartService';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const publicPaths = [
        '/',
        '/products',
        '/login',
        '/register',
        '/verify-email',
        '/forgot-password',
        '/reset-password',
      ];
      const isPublicPage = publicPaths.some(
        (path) =>
          window.location.pathname === path ||
          window.location.pathname.startsWith('/products/')
      );

      if (!isMounted) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getUserProfile();
        dispatch(setCredentials({ user: userData }));

        const cartData = await getCart();
        dispatch(setCart(cartData || { items: [], totalQuantity: 0, totalPrice: 0 }));

        setIsLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const userData = await refreshAccessToken();
            dispatch(setCredentials({ user: userData }));
            await checkAuth(); // Retry after refresh
            return;
          } catch (refreshError) {
            console.error('Refresh failed:', refreshError.message);
          }
        }
        console.error('Auth check failed:', error.message);
        dispatch(logout());
        dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
        setIsLoading(false);
        if (!isPublicPage && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (user && isAuthenticated && !isLoading) {
      localStorage.setItem('authState', JSON.stringify({ user, isAuthenticated }));
    }
  }, [user, isAuthenticated, isLoading]);

  const login = (userData) => {
    dispatch(setCredentials({ user: userData }));
  };

  const logout_User = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
      localStorage.removeItem('authState');
      localStorage.removeItem('cartTotalQuantity');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error.message);
      dispatch(logout());
      dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
      localStorage.removeItem('authState');
      localStorage.removeItem('cartTotalQuantity');
      window.location.href = '/login';
    }
  };

  return {
    user,
    isAuthenticated,
    role: user?.role || null,
    login,
    logout: logout_User,
    isAdmin: () => user?.role === 'admin',
    isLoading,
  };
};

export default useAuth;