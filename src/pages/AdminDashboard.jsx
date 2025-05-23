import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaEye, FaTimes, FaSpinner } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import {
  getDashboardStatus,
  getRecentOrders,
  getTopProducts,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../services/dashboardService';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [orderFilters, setOrderFilters] = useState({ status: '', method: '' });
  const [allOrderFilters, setAllOrderFilters] = useState({
    status: '',
    method: '',
  });
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  if (!authLoading && !isAdmin()) {
    window.location.href = '/';
    return null;
  }

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStatus,
    select: (response) => response.data,
  });

  const { data: recentOrders, isLoading: recentOrdersLoading } = useQuery({
    queryKey: ['recentOrders', orderFilters],
    queryFn: () => getRecentOrders(orderFilters),
    select: (response) => response.data,
  });

  const { data: topProducts, isLoading: topProductsLoading } = useQuery({
    queryKey: ['topProducts'],
    queryFn: getTopProducts,
    select: (response) => response.data,
  });

  const { data: allOrders, isLoading: allOrdersLoading } = useQuery({
    queryKey: ['allOrders', allOrderFilters],
    queryFn: () => getAllOrders(allOrderFilters),
    select: (response) => response.data,
  });

  // Fetch order details
  const { data: orderDetails, isLoading: orderDetailsLoading } = useQuery({
    queryKey: ['orderDetails', selectedOrderId],
    queryFn: () => getOrderById(selectedOrderId),
    select: (response) => response.data,
    enabled: !!selectedOrderId,
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['allOrders']);
      queryClient.invalidateQueries(['recentOrders']);
      toast.success('Order status updated', { theme: 'light' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status', {
        theme: 'light',
      });
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['allOrders']);
      queryClient.invalidateQueries(['recentOrders']);
      toast.success('Order cancelled', { theme: 'light' });
      setCancelOrderId(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel order', {
        theme: 'light',
      });
    },
  });

  const handleOrderFilterChange = (e) => {
    const { name, value } = e.target;
    setOrderFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllOrderFilterChange = (e) => {
    const { name, value } = e.target;
    setAllOrderFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusUpdate = (orderId, status) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const handleCancelOrder = (orderId) => {
    setCancelOrderId(orderId);
  };

  const openOrderDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const closeOrderDetails = () => {
    setSelectedOrderId(null);
  };

  const confirmCancelOrder = () => {
    if (cancelOrderId) {
      cancelOrderMutation.mutate(cancelOrderId);
    }
  };

  return (
    <div className="min-h-screen bg-background font-logo">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-8 font-headings">
          Admin Dashboard
        </h1>

        {/* Dashboard Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-dark mb-4 font-headings">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Orders', value: statsData?.totalOrders || 0 },
              {
                label: 'Total Customers',
                value: statsData?.totalCustomers || 0,
              },
              { label: 'Total Products', value: statsData?.totalProducts || 0 },
              {
                label: 'Total Revenue',
                value: `₹${statsData?.totalRevenue || 0}`,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-surface p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-medium text-neutral-dark font-text">
                  {stat.label}
                </h3>
                <p className="text-2xl font-bold text-accent font-text">
                  {statsLoading ? (
                    <FaSpinner className="animate-spin inline mr-2" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-neutral-dark mb-4 font-headings">
                Orders by Status
              </h3>
              <ul className="space-y-3 text-neutral-dark font-text">
                {statsLoading ? (
                  <li className="text-center">Loading...</li>
                ) : Object.keys(statsData?.ordersByStatus || {}).length ? (
                  Object.entries(statsData?.ordersByStatus).map(
                    ([status, count]) => (
                      <li
                        key={status}
                        className="flex justify-between items-center"
                      >
                        <span className="capitalize">{status}</span>
                        <span className="text-accent font-medium">{count}</span>
                      </li>
                    )
                  )
                ) : (
                  <li className="text-center">No data available</li>
                )}
              </ul>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-neutral-dark mb-4 font-headings">
                Orders by Method
              </h3>
              <ul className="space-y-3 text-neutral-dark font-text">
                {statsLoading ? (
                  <li className="text-center">Loading...</li>
                ) : Object.keys(statsData?.ordersByMethod || {}).length ? (
                  Object.entries(statsData?.ordersByMethod).map(
                    ([method, count]) => (
                      <li
                        key={method}
                        className="flex justify-between items-center"
                      >
                        <span className="capitalize">{method}</span>
                        <span className="text-accent font-medium">{count}</span>
                      </li>
                    )
                  )
                ) : (
                  <li className="text-center">No data available</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-dark mb-4 font-headings">
            Recent Orders
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <select
              name="status"
              value={orderFilters.status}
              onChange={handleOrderFilterChange}
              className="bg-surface text-neutral-dark p-3 rounded-lg border border-neutral-light focus:ring-2 focus:ring-primary focus:outline-none font-text"
              aria-label="Filter recent orders by status"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              name="method"
              value={orderFilters.method}
              onChange={handleOrderFilterChange}
              className="bg-surface text-neutral-dark p-3 rounded-lg border border-neutral-light focus:ring-2 focus:ring-primary focus:outline-none font-text"
              aria-label="Filter recent orders by payment method"
            >
              <option value="">All Methods</option>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full text-neutral-dark font-text">
              <thead>
                <tr className="bg-neutral-light/50">
                  <th className="p-4 text-left font-medium">Order #</th>
                  <th className="p-4 text-left font-medium">Customer</th>
                  <th className="p-4 text-left font-medium">Total</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Method</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersLoading ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center">
                      <FaSpinner className="animate-spin inline text-primary mr-2" />
                      Loading...
                    </td>
                  </tr>
                ) : recentOrders?.length ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-neutral-light/50 hover:bg-neutral-light/20 transition-colors"
                    >
                      <td className="p-4">{order.orderNumber}</td>
                      <td className="p-4">
                        {order.user.name || order.user.email}
                      </td>
                      <td className="p-4">₹{order.total}</td>
                      <td className="p-4 capitalize">
                        <span
                          className={
                            order.status === 'delivered'
                              ? 'text-success'
                              : order.status === 'pending'
                                ? 'text-warning'
                                : order.status === 'cancelled'
                                  ? 'text-error'
                                  : 'text-neutral'
                          }
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 capitalize">{order.paymentMethod}</td>
                      <td className="p-4">
                        {format(new Date(order.createdAt), 'PP')}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => openOrderDetails(order.id)}
                          className="text-primary hover:text-primary-dark"
                          aria-label={`View details for order ${order.orderNumber}`}
                        >
                          <FaEye className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-dark mb-4 font-headings">
            Top Products
          </h2>
          <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full text-neutral-dark font-text">
              <thead>
                <tr className="bg-neutral-light/50">
                  <th className="p-4 text-left font-medium">Product</th>
                  <th className="p-4 text-left font-medium">Category</th>
                  <th className="p-4 text-left font-medium">Revenue</th>
                  <th className="p-4 text-left font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {topProductsLoading ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      <FaSpinner className="animate-spin inline text-primary mr-2" />
                      Loading...
                    </td>
                  </tr>
                ) : topProducts?.length ? (
                  topProducts.map((product, index) => (
                    <tr
                      key={index}
                      className="border-b border-neutral-light/50 hover:bg-neutral-light/20 transition-colors"
                    >
                      <td className="p-4">{product.name}</td>
                      <td className="p-4 capitalize">{product.category}</td>
                      <td className="p-4">₹{product.totalRevenue}</td>
                      <td className="p-4">{product.totalQuantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      No top products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* All Orders */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-dark mb-4 font-headings">
            All Orders
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <select
              name="status"
              value={allOrderFilters.status}
              onChange={handleAllOrderFilterChange}
              className="bg-surface text-neutral-dark p-3 rounded-lg border border-neutral-light focus:ring-2 focus:ring-primary focus:outline-none font-text"
              aria-label="Filter all orders by status"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              name="method"
              value={allOrderFilters.method}
              onChange={handleAllOrderFilterChange}
              className="bg-surface text-neutral-dark p-3 rounded-lg border border-neutral-light focus:ring-2 focus:ring-primary focus:outline-none font-text"
              aria-label="Filter all orders by payment method"
            >
              <option value="">All Methods</option>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full text-neutral-dark font-text">
              <thead>
                <tr className="bg-neutral-light/50">
                  <th className="p-4 text-left font-medium">Order #</th>
                  <th className="p-4 text-left font-medium">Customer</th>
                  <th className="p-4 text-left font-medium">Total</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Method</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allOrdersLoading ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center">
                      <FaSpinner className="animate-spin inline text-primary mr-2" />
                      Loading...
                    </td>
                  </tr>
                ) : allOrders?.length ? (
                  allOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-neutral-light/50 hover:bg-neutral-light/20 transition-colors"
                    >
                      <td className="p-4">{order.orderNumber}</td>
                      <td className="p-4">
                        {order.user.name || order.user.email}
                      </td>
                      <td className="p-4">₹{order.total}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className="bg-surface text-neutral-dark p-2 rounded-lg border border-neutral-light focus:ring-2 focus:ring-primary focus:outline-none font-text"
                          disabled={updateStatusMutation.isLoading}
                          aria-label={`Update status for order ${order.orderNumber}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 capitalize">{order.paymentMethod}</td>
                      <td className="p-4">
                        {format(new Date(order.createdAt), 'PP')}
                      </td>
                      <td className="p-4 flex gap-4 items-center">
                        <button
                          onClick={() => openOrderDetails(order.id)}
                          className="text-primary hover:text-primary-dark"
                          aria-label={`View details for order ${order.orderNumber}`}
                        >
                          <FaEye className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-error hover:text-error/80"
                          disabled={
                            order.status === 'cancelled' ||
                            cancelOrderMutation.isLoading
                          }
                          aria-label={`Cancel order ${order.orderNumber}`}
                        >
                          <FaTimes className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center">
                      No orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Order Details Modal */}
        <Modal
          isOpen={!!selectedOrderId}
          onClose={closeOrderDetails}
          title="Order Details"
          footer={
            <button
              onClick={closeOrderDetails}
              className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors font-text"
            >
              Close
            </button>
          }
        >
          {orderDetailsLoading ? (
            <div className="flex justify-center py-4">
              <FaSpinner className="animate-spin text-2xl text-primary" />
            </div>
          ) : orderDetails?.id ? (
            <div className="space-y-4 text-neutral-dark font-text">
              <p>
                <strong>Order #:</strong> {orderDetails.orderNumber}
              </p>
              <p>
                <strong>Customer:</strong>{' '}
                {orderDetails.user.name || orderDetails.user.email}
              </p>
              <p>
                <strong>Total:</strong> ₹{orderDetails.total}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={
                    orderDetails.status === 'delivered'
                      ? 'text-success'
                      : orderDetails.status === 'pending'
                        ? 'text-warning'
                        : orderDetails.status === 'cancelled'
                          ? 'text-error'
                          : 'text-neutral'
                  }
                >
                  {orderDetails.status}
                </span>
              </p>
              <p>
                <strong>Payment Method:</strong>{' '}
                <span className="capitalize">{orderDetails.paymentMethod}</span>
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {format(new Date(orderDetails.createdAt), 'PP')}
              </p>
              <h3 className="text-lg font-medium mt-4 font-headings">Items</h3>
              <ul className="list-disc pl-5 space-y-2">
                {orderDetails.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - ₹{item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
              <h3 className="text-lg font-medium mt-4 font-headings">
                Shipping Address
              </h3>
              <p>
                {Object.values(orderDetails.shippingAddress)
                  .filter(Boolean)
                  .join(', ') || 'N/A'}
              </p>
            </div>
          ) : (
            <p className="text-neutral-dark font-text">
              No order details available
            </p>
          )}
        </Modal>

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={!!cancelOrderId}
          onClose={() => setCancelOrderId(null)}
          title="Confirm Cancellation"
          footer={
            <>
              <button
                onClick={() => setCancelOrderId(null)}
                className="px-4 py-2 bg-neutral text-secondary rounded-lg hover:bg-neutral-dark transition-colors font-text"
              >
                No
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-error text-secondary rounded-lg hover:bg-error/80 transition-colors font-text"
                disabled={cancelOrderMutation.isLoading}
              >
                {cancelOrderMutation.isLoading ? (
                  <FaSpinner className="animate-spin inline mr-2" />
                ) : (
                  'Yes'
                )}
              </button>
            </>
          }
        >
          <p className="text-neutral-dark font-text">
            Are you sure you want to cancel this order?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
