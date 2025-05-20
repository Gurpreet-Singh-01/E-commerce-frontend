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
    console.log('Create order error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create order');
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
    console.log('Get orders error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};