import api from './api';

export const getCart = async () => {
  try {
    const response = await api.get('/cart/');
    const cartData = Array.isArray(response.data.data)
      ? { items: [] }
      : response.data.data || { items: [] };
    return {
      cart: {
        items:
          cartData.items.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image.url,
          })) || [],
        totalQuantity:
          cartData.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
        totalPrice:
          cartData.items.reduce(
            (sum, item) => sum + item.quantity * item.product.price,
            0
          ) || 0,
      },
      message: response.data.message || 'No Cart data available',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      cart: { items: [], totalQuantity: 0, totalPrice: 0 },
      message: error.response?.data?.message || 'Failed to Fetch cart',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart/', { productId, quantity });
  const cartData = response.data.data || { items: [] };
  return {
    cart: {
      items:
        cartData.items.map((item) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image.url,
        })) || [],
      totalQuantity:
        cartData.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
      totalPrice:
        cartData.items.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        ) || 0,
    },
    message: response.data.message || 'Item added to cart',
    success: response.data.success ?? true,
    statusCode: response.data.statusCode || 200,
  };
};

export const updateCartItem = async (productId, quantity) => {
  const response = await api.patch(`/cart/${productId}`, quantity);
  const cartData = response.data.data || { items: [] };
  return {
    cart: {
      items:
        cartData.items.map((item) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image.url,
        })) || [],
      totalQuantity:
        cartData.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
      totalPrice:
        cartData.items.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        ) || 0,
    },
    message: response.data.message || 'Cart updated',
    success: response.data.success ?? true,
    statusCode: response.data.statusCode || 200,
  };
};

export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  const cartData = response.data.data || { items: [] };
  return {
    cart: {
      items:
        cartData.items.map((item) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image.url,
        })) || [],
      totalQuantity:
        cartData.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
      totalPrice:
        cartData.items.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        ) || 0,
    },
    message: response.data.message || 'Item removed from cart',
    success: response.data.success ?? true,
    statusCode: response.data.statusCode || 200,
  };
};

export const clearCart = async () => {
  const response = await api.delete('/cart/clearCart');
  const cartData = response.data.data || { items: [] };
  return {
    cart: {
      items:
        cartData.items?.map((item) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image.url,
        })) || [],
      totalQuantity:
        cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      totalPrice:
        cartData.items?.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        ) || 0,
    },
    message: response.data.message || 'Cart cleared',
    success: response.data.success ?? true,
    statusCode: response.data.statusCode || 200,
  };
};
