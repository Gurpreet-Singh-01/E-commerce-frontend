import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { getUsersOrder } from '../services/orderService';
import Loader from '../components/Loader';
import Button from '../components/Button';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getUsersOrder,
    enabled: isAuthenticated && !authLoading,
    onError: (err) => {
      console.debug('Orders fetch error:', err.message);
      toast.error(err.message, { toastId: 'orders-error' });
    },
  });

  if (authLoading || ordersLoading) {
    return <Loader size="large" className="my-8" />;
  }

  if (!isAuthenticated) {
    toast.error('Please log in to view orders', { toastId: 'auth-error' });
    navigate('/login');
    return null;
  }

  if (ordersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-text">
        <p className="text-error text-center">{ordersError.message}</p>
      </div>
    );
  }

  const orders = ordersData?.data || [];

  return (
    <div className="min-h-screen flex flex-col font-text bg-background">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8 font-headings text-neutral-dark">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-neutral text-lg mb-4">You have no orders yet</p>
            <Button>
              <Link to="/products" className="block w-full h-full">
                Shop Now
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h2 className="text-lg font-bold text-neutral-dark mb-2">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-neutral mb-1">
                  Placed on:{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </p>
                <p className="text-neutral mb-1">
                  Items:{' '}
                  {order.items
                    .map((item) => `${item.name} x ${item.quantity}`)
                    .join(', ')}
                </p>
                <p className="text-neutral mb-1">
                  Total:{' '}
                  {order.total.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  })}
                </p>
                <p
                  className={`inline-block text-sm capitalize px-2 py-1 rounded ${
                    order.status === 'pending'
                      ? 'bg-warning text-white'
                      : order.status === 'cancelled'
                        ? 'bg-error text-white'
                        : 'bg-success text-white'
                  }`}
                >
                  Status: {order.status}
                </p>
                {user?.role === 'admin' && (
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      size="medium"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
