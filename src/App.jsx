import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { setCart } from './store/cartSlice';
import { getCart, addToCart as addToCartApi } from './services/cartService';
import useAuth from './hooks/useAuth';
import { loginUser } from './services/userService';

function App() {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const { login } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await getCart();
      dispatch(setCart(response.cart));
      return response;
    },
  });

  const handleAddToCart = async () => {
    try {
      const productId = '6820e8c84e2dffb48104c96d';
      const response = await addToCartApi(productId, 1);
      dispatch(setCart(response.cart));
      alert(response.message);
    } catch (error) {
      console.error('Add to Cart Error:', error);
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser('prxxt.gurii@gmail.com', '987654321');
      login(response.user);
    } catch (error) {
      console.error('Login Error:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-primary p-4">
      <h1 className="text-3xl font-bold text-center">Cart: {totalQuantity} items, ₹{totalPrice}</h1>
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{data?.message || error.message}</p>}
      {data && (
        <>
          <p className="text-center text-gray mb-4">{data.message}</p>
          {data.cart?.items?.length > 0 ? (
            <ul>
              {data.cart.items.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.quantity} x ₹{item.price}
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover inline-block ml-2" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">Your cart is empty</p>
          )}
        </>
      )}
      <button
        className="bg-primary text-secondary px-4 py-2 rounded mt-4 mr-2"
        onClick={handleLogin}
      >
        Login
      </button>
      <button
        className="bg-primary text-secondary px-4 py-2 rounded mt-4"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default App;