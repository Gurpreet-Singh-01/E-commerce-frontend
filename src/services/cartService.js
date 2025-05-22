import api from './api';

const normalizeCartData = (data) => {
  const cartData = Array.isArray(data) ? { items: [] } : data || { items: [] };
  return {
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
  };
};

export const getCart = async () => {
  try {
    const response = await api.get('/cart/');
    return {
      cart: normalizeCartData(response.data.data),
      message: response.data.message || 'Cart retrieved successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    console.log(
      'Get cart error:',
      error.response?.data?.message || error.message
    );
    return {
      cart: { items: [], totalQuantity: 0, totalPrice: 0 },
      message: error.response?.data?.message || 'Failed to fetch cart',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post('/cart/', { productId, quantity });
    return {
      cart: normalizeCartData(response.data.data),
      message: response.data.message || 'Item added to cart',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    console.log(
      'Add to cart error:',
      error.response?.data?.message || error.message
    );
    throw new Error(error.message || 'Failed to add to cart');
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await api.patch(`/cart/${productId}`, { quantity });
    return {
      cart: normalizeCartData(response.data.data),
      message: response.data.message || 'Cart updated',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    console.log(
      'Update cart error:',error.message
    );
    throw new Error(error.message || 'Failed to update cart');
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return {
      cart: normalizeCartData(response.data.data),
      message: response.data.message || 'Item removed from cart',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    console.log(
      'Remove from cart error:',
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || 'Failed to remove item');
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear_cart');
    return {
      cart: normalizeCartData(response.data.data),
      message: response.data.message || 'Cart cleared',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    console.log(
      'Clear cart error:',
      error.response?.data?.message || error.message
    );
    throw new Error(error.message || 'Failed to clear cart');
  }
};
