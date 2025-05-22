import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials, updateUser } from '../store/authSlice';
import { setCart } from '../store/cartSlice';
import { getUserProfile, logoutUser } from '../services/userService';
import { getCart } from '../services/cartService';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

      if (isLoggingOut || !isMounted) {
        setIsLoading(false);
        return;
      }

      try {
        const userResponse = await getUserProfile();
        if (userResponse.success && userResponse.data) {
          const userData = {
            _id: userResponse.data._id,
            email: userResponse.data.email,
            role: userResponse.data.role,
            name: userResponse.data.name,
            phone: userResponse.data.phone,
            address: userResponse.data.address,
          };
          dispatch(setCredentials({ user: userData }));

          // Fetch and set cart
          try {
            const cartResponse = await getCart();
            if (cartResponse.success && cartResponse.cart) {
              dispatch(setCart(cartResponse.cart));
            } else {
              dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
            }
          } catch (cartError) {
            console.log('Failed to fetch user cart:', cartError.message);
            dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
          }

          setIsLoading(false);
        } else {
          dispatch(logout());
          dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
          setIsLoading(false);
          if (!isPublicPage && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.log('Failed to fetch user profile:', error.message);
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
  }, [dispatch, isLoggingOut]);

  // Persist user state in localStorage after token refresh
  useEffect(() => {
    if (user && isAuthenticated && !isLoading && !isLoggingOut) {
      try {
        localStorage.setItem(
          'authState',
          JSON.stringify({ user, isAuthenticated })
        );
      } catch (error) {
        console.log('Failed to save authState to localStorage:', error.message);
      }
    }
  }, [user, isAuthenticated]);

  const login = (userData) => {
    dispatch(setCredentials({ user: userData }));
  };

  const logout_User = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      dispatch(logout());
      dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
      localStorage.removeItem('cartTotalQuantity');
    } catch (error) {
      console.log('Logout error:', error.message || 'Logout failed');
      dispatch(logout());
      dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
      localStorage.removeItem('cartTotalQuantity');
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
