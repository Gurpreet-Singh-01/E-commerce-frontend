import api from './api';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/order', orderData);
    const order = response.data.data || {};
    return {
      data: {
        id: order._id,
        user: order.user,
        orderNumber: order.orderNumber,
        items:
          order.items?.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image?.url || '',
          })) || [],
        total: order.totalAmount,
        status: order.payment?.status || 'unknown',
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
      },
      message: response.data.message || 'Order created successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 201,
    };
  } catch (error) {
    return {
      data: {},
      message: error.response?.data?.message || 'Failed to create order',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const getUsersOrder = async () => {
  try {
    const response = await api.get('/order');
    const orders = response.data.data || [];
    return {
      data: orders.map((order) => ({
        id: order._id,
        user: order.user,
        orderNumber: order.orderNumber,
        items:
          order.items?.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image?.url || '',
          })) || [],
        total: order.totalAmount,
        status: order.payment?.status || 'unknown',
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
      })),
      message: response.data.message || 'Orders fetched successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      data: [],
      message: error.response?.data?.message || 'Failed to fetch orders',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};
