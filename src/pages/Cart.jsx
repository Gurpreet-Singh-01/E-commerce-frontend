import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCart } from '../store/cartSlice';
import useAuth from '../hooks/useAuth';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../services/cartService';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Input from '../components/Input';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: isAuthenticated && !authLoading,
    onError: (err) => {
      console.debug('Cart fetch error:', err.message);
      toast.error(err.message, { toastId: 'cart-error' });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => updateCartItem(productId, quantity),
    onSuccess: (response) => {
      dispatch(setCart(response.cart));
      queryClient.invalidateQueries(['cart']);
      toast.success(response.message, { toastId: 'update-cart-success' });
    },
    onError: (error) => {
      console.debug('Update cart error:', error.message);
      toast.error(error.message, { toastId: 'update-cart-error' });
    },
  });

  const removeCartMutation = useMutation({
    mutationFn: (productId) => removeFromCart(productId),
    onSuccess: (response) => {
      dispatch(setCart(response.cart));
      queryClient.invalidateQueries(['cart']);
      toast.success(response.message, { toastId: 'remove-cart-success' });
    },
    onError: (error) => {
      console.debug('Remove cart error:', error.message);
      toast.error(error.message, { toastId: 'remove-cart-error' });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: (response) => {
      dispatch(setCart(response.cart));
      queryClient.invalidateQueries(['cart']);
      toast.success(response.message, { toastId: 'clear-cart-success' });
    },
    onError: (error) => {
      console.debug('Clear cart error:', error.message);
      toast.error(error.message, { toastId: 'clear-cart-error' });
    },
  });

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    updateCartMutation.mutate({ productId, quantity });
  };

  const handleRemoveItem = (productId) => {
    removeCartMutation.mutate(productId);
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  if (authLoading) {
    return <Loader size="large" className="my-8" />;
  }

  if (!isAuthenticated) {
    toast.error('Please log in to view your cart', { toastId: 'cart-auth-error' });
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return <Loader size="large" className="my-8" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface font-text">
        <p className="text-error text-center">{error.message}</p>
      </div>
    );
  }

  const cart = data?.cart || { items: [], totalQuantity: 0, totalPrice: 0 };

  return (
    <div className="min-h-screen flex flex-col font-text bg-surface">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8 font-headings text-neutral-dark">
          Your Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center">
            <p className="text-neutral text-lg mb-4">Your cart is empty</p>
            <Link to="/products">
              <Button>Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white p-4 mb-4 rounded-lg shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-neutral-dark">{item.name}</h3>
                    <p className="text-neutral">Price: ${item.price.toFixed(2)}</p>
                    <p className="text-neutral">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      min="1"
                      className="w-16 text-center"
                    />
                    <Button
                      variant="error"
                      size="small"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeCartMutation.isLoading}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={handleClearCart}
                disabled={clearCartMutation.isLoading}
                className="mt-4"
              >
                Clear Cart
              </Button>
            </div>

            {/* Cart Summary */}
            <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 font-headings text-neutral-dark">
                Cart Summary
              </h2>
              <p className="text-neutral mb-2">
                Total Items: {cart.totalQuantity}
              </p>
              <p className="text-neutral mb-4">
                Total Price: ${cart.totalPrice.toFixed(2)}
              </p>
              <Button size="large" className="w-full">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;