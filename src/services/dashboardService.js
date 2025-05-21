import api from './api';

export const getDashboardStatus = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    const stats = response.data.data || {};
    return {
      data: {
        totalOrders: stats.totalOrders || 0,
        totalCustomers: stats.totalCustomers || 0,
        totalProducts: stats.totalProducts || 0,
        totalRevenue: stats.totalRevenue || 0,
        ordersByStatus: stats.ordersByStatus || {},
        ordersByMethod: stats.ordersByMethod || {},
      },
      message: response.data.message || 'Dashboard status fetched successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      data: {
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        ordersByStatus: {},
        ordersByMethod: {},
      },
      message:
        error.response?.data?.message || 'Failed to fetch dashboard stats',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const getRecentOrders = async ({ status, method } = {}) => {
  try {
    const params = {};
    if (status) params.status = status;
    if (method) params.method = method;
    const response = await api.get('/admin/dashboard/recent_orders', {
      params,
    });
    const orders = Array.isArray(response.data.data) ? response.data.data : [];
    return {
      data: orders.map((order) => ({
        id: order._id,
        user: {
          id: order.user?._id || '',
          name: order.user?.name || '',
          email: order.user?.email || '',
        },
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
        status: order.payment?.status || 'unknwon',
        paymentMethod: order.payment?.method || 'unknwon',
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
      })),
      message: response.data.message || 'Recent orders fetched successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      data: [],
      message: error.response?.data?.message || 'Failed to fetch recent orders',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const getTopProducts = async () => {
  try {
    const response = await api.get('admin/dashboard/top_products');
    const products = Array.isArray(response.data.data)
      ? response.data.data
      : [];
    return {
      data: products.map((product) => ({
        name: product.name,
        image: product.image || '',
        category: product.category || '',
        totalRevenue: product.totalRevenue || 0,
        totalQuantity: product.totalQuantity || 0,
      })),
      message: response.data.message || 'Top products fetched successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      data: [],
      message: error.response?.data?.message || 'Failed to fetch top products',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const getAllOrders = async ({ status, method }) => {
  try {
    const params = {};
    if (status) params.status = status;
    if (method) params.method = method;
    const response = await api.get('/admin/order/all_orders', { params });
    const orders = Array.isArray(response.data.data) ? response.data.data : [];
    return {
      data: orders.map((order) => ({
        id: order._id,
        user: {
          id: order.user?._id || '',
          name: order.user?.name || '',
          email: order.user?.email || '',
        },
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
        status: order.payment?.status || 'unknwon',
        paymentMethod: order.payment?.method || 'unknwon',
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
      })),
      message: response.data.message || 'Recent orders fetched successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      data: [],
      message: error.response?.data?.message || 'Failed to fetch recent orders',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/admin/order/${orderId}/user`);
    const order = response.data.data || {};
    return {
      data: {
        id: order._id,
        user: {
          id: order.user?._id || '',
          name: order.user?.name || '',
          email: order.user?.email || '',
        },
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
        paymentMethod: order.payment?.method || 'unknown',
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
      },
      message: response.data.message || 'Order fetched successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      data: {},
      message: error.response?.data?.message || 'Failed to fetch order',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/admin/order/${orderId}/status`, {
      status,
    });
    const order = response.data.data || {};
    return {
      data: {
        id: order._id,
        user: {
          id: order.user?._id || '',
          name: order.user?.name || '',
          email: order.user?.email || '',
        },
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
        paymentMethod: order.payment?.method || 'unknown',
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
      },
      message: response.data.message || 'Order status updated successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      data: {},
      message: error.response?.data?.message || 'Failed to update order status',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.patch(`/admin/order/${orderId}/cancel`);
    const order = response.data.data || {};
    return {
      data: {
        id: order._id,
        user: {
          id: order.user?._id || '',
          name: order.user?.name || '',
          email: order.user?.email || '',
        },
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
        paymentMethod: order.payment?.method || 'unknown',
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
      },
      message: response.data.message || 'Order cancelled successfully',
      success: response.data.success ?? true,
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    return {
      data: {},
      message: error.response?.data?.message || 'Failed to cancel order',
      success: false,
      statusCode: error.response?.status || 500,
    };
  }
};
