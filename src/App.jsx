import { useSelector, useDispatch } from "react-redux"
import { useQuery } from '@tanstack/react-query'
import { setCart } from './store/cartSlice'
import { getCart, addToCart as addToCartApi } from './services/cartService'
import { getProducts } from './services/productService'
import { getUsersOrder } from './services/orderService'
import useAuth from './hooks/useAuth'
import { loginUser } from './services/userService'

const App = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart)
  const { login } = useAuth()

  const { data: cartData, isLoading: cartLoading, error: cartError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await getCart()
      dispatch(setCart(response.cart))
      return response
    }
  })

  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders'],
    queryFn: getUsersOrder
  })

  const handleAddToCart = async () => {
    try {
      const productId = '6820e19a4e2dffb48104c903';
      const response = await addToCartApi(productId, 3);
      dispatch(setCart(response.cart))
      alert(response.message)
    } catch (error) {
      console.log("Add to cart Error: ", error)
      alert(error.response?.message || 'Failed to add to cart');
    }
  }

  const handleLogin = async () => {
    try {
      const response = await loginUser('prxxt.gurii@gmail.com', '987654321');
      login(response?.data?.user)
    } catch (error) {
      console.error('Login Error:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div>
      <h1>Cart: {totalQuantity} items, ₹{totalPrice}</h1>
      {cartLoading && <p className="text-center">Loading cart...</p>}
      {cartError && <p className="text-center text-red-500">{cartData?.message || cartError.message}</p>}
      {cartData && (
        <>
          <p className="text-center text-gray mb-4">{cartData.message}</p>
          {cartData?.cart?.items.length > 0 ? (
              <ul>
                {cartData.cart.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.quantity} x ₹{item.price}
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover inline-block ml-2" />
                  </li>
                ))}
              </ul>
            ) : (<p className="text-center">Your cart is empty</p>)
          }
        </>
      )}

      <h2 className="text-2xl font-bold text-center mt-8">Products</h2>
      {productsLoading && <p className="text-center">Loading products...</p>}
      {productsError && <p className="text-center text-red-500">{productsData?.message || productsError.message}</p>}
      {productsData && (
        <>
          <p className="text-center text-gray mb-4">{productsData.message || 'Products fetched'}</p>
          {productsData.data?.length > 0 ? (
            <ul>
              {productsData.data.map((product) => (
                <li key={product.id}>
                  {product.name} - ₹{product.price} (Stock: {product.stock})
                  <img src={product.image.url} alt={product.name} className="w-16 h-16 object-cover inline-block ml-2" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No products available</p>
          )}
        </>
      )}

      <h2 className="text-2xl font-bold text-center mt-8">Your Orders</h2>
      {ordersLoading && <p className="text-center">Loading orders...</p>}
      {ordersError && <p className="text-center text-red-500">{ordersData?.message || ordersError.message}</p>}
      {ordersData && (
        <>
          <p className="text-center text-gray mb-4">{ordersData.message}</p>
          {ordersData.data.length > 0 ?(
            <ul>
              {ordersData.data.map((order) => (
                <li key={order.id}>
                  Order #{order.orderNumber} - Total: ₹{order.total} (Status: {order.status})
                  <p className="text-sm text-gray">
                    Shipping to: {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </p>
                  <p className="text-sm text-gray">
                    Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <ul className="ml-4">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} - {item.quantity} x ₹{item.price}
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover inline-block ml-2" />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            ):(
              <p className="text-center">No orders found</p>
            )
        }
        </>
      )}
    </div>
  )
}

export default App