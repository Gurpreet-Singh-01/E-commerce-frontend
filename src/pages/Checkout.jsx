import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCart } from '../store/cartSlice';
import useAuth from '../hooks/useAuth';
import { getCart, clearCart } from '../services/cartService';
import { createOrder, updateOrder } from '../services/orderService';
import { getUserProfile } from '../services/userService';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Input from '../components/Input';
import { FaSpinner } from 'react-icons/fa';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [useNewAddress, setUseNewAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    houseNumber: '',
    street: '',
    colony: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);

  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: isAuthenticated && !authLoading,
    onError: (err) => {
      console.debug('Cart fetch error:', err.message);
      toast.error(err.message, { toastId: 'cart-error' });
    },
  });

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: isAuthenticated && !authLoading,
    onSuccess: (response) => {
      const defaultAddress = response.data.address?.find(
        (addr) => addr.isDefault
      );
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      } else if (response.data.address?.length > 0) {
        setSelectedAddressId(response.data.address[0]._id);
      }
    },
    onError: (err) => {
      console.debug('User profile fetch error:', err.message);
      toast.error('Failed to fetch addresses', {
        toastId: 'user-profile-error',
      });
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async (response) => {
      console.log('Place Order Success:', response);
      await clearCartMutation.mutateAsync();
      dispatch(setCart({ items: [], totalQuantity: 0, totalPrice: 0 }));
      queryClient.invalidateQueries(['cart']);
      if (paymentMethod === 'online') {
        const orderId = response.data?.id;
        const razorpayOrderId = response.data?.payment?.transactionId;
        const amount = response.data?.total;
        if (!orderId || !razorpayOrderId || !amount) {
          console.error('Missing payment data:', {
            orderId,
            razorpayOrderId,
            amount,
            response,
          });
          toast.error('Failed to initiate payment: Invalid order data.', { toastId: 'payment-init-error' });
          setPaymentLoading(false);
          return;
        }
        initiatePayment(orderId, razorpayOrderId, amount);
      } else {
        toast.success(response.message, { toastId: 'order-success' });
        navigate('/thank-you');
      }
    },
    onError: (error) => {
      console.debug('Place order error:', error.message);
      toast.error(error.message, { toastId: 'order-error' });
      setPaymentLoading(false);
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: (response) => {
      console.log('Update Order Success:', response);
      toast.success('Payment completed', { toastId: 'payment-success' });
      navigate('/thank-you');
      setPaymentLoading(false);
    },
    onError: (error) => {
      console.debug('Update order error:', error.message);
      toast.error(error.message, { toastId: 'update-order-error' });
      setPaymentLoading(false);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onError: (error) => {
      console.debug('Clear cart error:', error.message);
      toast.error(error.message, { toastId: 'clear-cart-error' });
    },
  });

  const initiatePayment = (orderId, razorpayOrderId, amount) => {
    console.log('Initiate Payment:', { orderId, razorpayOrderId, amount });
    if (!window.Razorpay) {
      console.error('Razorpay err');
      toast.error('Payment service unavailable.', { toastId: 'razorpay-sdk-error' });
      setPaymentLoading(false);
      return;
    }
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log('Razorpay Key:', razorpayKey);
    if (!razorpayKey) {
      console.error('No Razorpay key provided');
      toast.error('Payment service unavailable: No key provided.', { toastId: 'razorpay-key-error' });
      setPaymentLoading(false);
      return;
    }
    try {
      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency: 'INR',
        name: 'TechTrendz',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: (response) => {
          console.log('Payment Response:', response);
          console.log('razorpay_order_id:', response.razorpay_order_id);
          console.log('razorpay_payment_id:', response.razorpay_payment_id);
          console.log('razorpay_signature:', response.razorpay_signature);
          console.log('orderId:', orderId);
          updateOrderMutation.mutate({
            orderId,
            payment: {
              transactionId: response.razorpay_payment_id,
              },
          });
        },
        prefill: {
          name: user?.name, 
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: '#1e40af',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (error) => {
        console.error('Razorpay Payment Failed:', error);
        toast.error(`Payment failed: ${error.error.description}`, { toastId: 'payment-failed' });
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (error) {
      console.error('Initiate Payment Error:', error);
      toast.error('Failed to initiate payment. Please try again.', { toastId: 'payment-init-error' });
      setPaymentLoading(false);
    }
  };

  const validateForm = () => {
    if (!useNewAddress && !selectedAddressId) {
      toast.error('Please select an address or enter a new one', {
        toastId: 'address-error',
      });
      return false;
    }
    if (useNewAddress) {
      const errors = {};
      const fields = [
        'houseNumber',
        'street',
        'colony',
        'city',
        'state',
        'country',
        'postalCode',
      ];
      fields.forEach((field) => {
        if (!formData[field].trim()) {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
        }
      });
      if (formData.postalCode && !/^\d{5,10}$/.test(formData.postalCode)) {
        errors.postalCode = 'Postal code must be 5-10 digits';
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!cartData?.cart?.items?.length) {
      toast.error('Cart is empty', { toastId: 'cart-empty' });
      return;
    }

    setPaymentLoading(true);
    const orderData = {
      paymentMethod,
      ...(useNewAddress
        ? { shippingAddress: formData }
        : { addressId: selectedAddressId }),
    };
    console.log('Order Data:', orderData);
    placeOrderMutation.mutate(orderData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  if (authLoading || userLoading || cartLoading) {
    return <Loader size="large" className="my-8" />;
  }

  if (!isAuthenticated) {
    toast.error('Please log in to checkout', { toastId: 'auth-error' });
    navigate('/login');
    return null;
  }

  if (cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-text">
        <p className="text-error text-center">{cartError.message}</p>
      </div>
    );
  }

  const cart = cartData?.cart || { items: [], totalQuantity: 0, totalPrice: 0 };
  const addresses = userData?.data?.address || [];
  const shippingCost = 5;

  return (
    <div className="min-h-screen flex flex-col font-text bg-background">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8 font-headings text-neutral-dark">
          Checkout
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center">
            <p className="text-neutral text-lg mb-4">Your cart is empty</p>
            <Button>
              <Link to="/products" className="block w-full h-full">
                Shop Now
              </Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row lg:items-start gap-8"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-4 font-headings text-neutral-dark">
                Shipping Address
              </h2>
              <div className="bg-surface p-6 rounded-lg shadow-sm mb-6">
                <label className="flex items-center mb-6 cursor-pointer">
                  <span className="relative inline-block w-5 h-5 mr-3">
                    <input
                      type="checkbox"
                      checked={useNewAddress}
                      onChange={() => setUseNewAddress(!useNewAddress)}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <span
                      className={`absolute inset-0 border-2 border-neutral-light rounded-md transition-all duration-200 ${useNewAddress ? 'bg-primary border-primary' : 'bg-white'
                        }`}
                    >
                      {useNewAddress && (
                        <svg
                          className="w-3 h-3 text-white absolute top-1 left-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                  </span>
                  <span className="text-neutral-dark text-lg">
                    Enter a new shipping address
                  </span>
                </label>

                {!useNewAddress && addresses.length > 0 && (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className="flex items-start gap-3 cursor-pointer"
                      >
                        <span className="relative inline-block w-5 h-5 mt-1">
                          <input
                            type="radio"
                            name="addressId"
                            value={addr._id}
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="absolute opacity-0 w-0 h-0"
                          />
                          <span
                            className={`absolute inset-0 border-2 border-neutral-light rounded-full transition-all duration-200 ${selectedAddressId === addr._id
                                ? 'border-primary'
                                : 'bg-white'
                              }`}
                          >
                            {selectedAddressId === addr._id && (
                              <span className="absolute inset-1.5 bg-primary rounded-full" />
                            )}
                          </span>
                        </span>
                        <div>
                          <p className="text-neutral-dark font-medium">
                            {addr.houseNumber}, {addr.street}, {addr.colony}
                            {addr.isDefault && (
                              <span className="text-success ml-2">
                                (Default)
                              </span>
                            )}
                          </p>
                          <p className="text-neutral">
                            {addr.city}, {addr.state}, {addr.country}{' '}
                            {addr.postalCode}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {useNewAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'House Number', name: 'houseNumber' },
                      { label: 'Street', name: 'street' },
                      { label: 'Colony', name: 'colony' },
                      { label: 'City', name: 'city' },
                      { label: 'State', name: 'state' },
                      { label: 'Country', name: 'country' },
                      { label: 'Postal Code', name: 'postalCode' },
                    ].map(({ label, name }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                          {label}
                        </label>
                        <Input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={handleInputChange}
                          placeholder={`Enter ${label.toLowerCase()}`}
                          className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all ${formErrors[name] ? 'border-error' : ''
                            }`}
                        />
                        {formErrors[name] && (
                          <p className="text-error text-sm mt-1">
                            {formErrors[name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-surface p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-4 font-headings text-neutral-dark">
                  Payment Method
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="relative inline-block w-5 h-5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <span
                        className={`absolute inset-0 border-2 border-neutral-light rounded-full transition-all duration-200 ${paymentMethod === 'cod' ? 'border-primary' : 'bg-white'
                          }`}
                      >
                        {paymentMethod === 'cod' && (
                          <span className="absolute inset-1.5 bg-primary rounded-full" />
                        )}
                      </span>
                    </span>
                    <span className="text-neutral-dark">
                      Cash on Delivery (COD)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="relative inline-block w-5 h-5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <span
                        className={`absolute inset-0 border-2 border-neutral-light rounded-full transition-all duration-200 ${paymentMethod === 'online' ? 'border-primary' : 'bg-white'
                          }`}
                      >
                        {paymentMethod === 'online' && (
                          <span className="absolute inset-1.5 bg-primary rounded-full" />
                        )}
                      </span>
                    </span>
                    <span className="text-neutral-dark">Online Payment</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-surface p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4 font-headings text-neutral-dark">
                  Order Summary
                </h2>
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span className="text-neutral">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-neutral-dark">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-neutral-light pt-2 mt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral">Subtotal</span>
                    <span className="text-neutral-dark">
                      ₹{cart.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral">Shipping</span>
                    <span className="text-neutral-dark">
                      ₹{shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-neutral-dark">Total</span>
                    <span className="text-neutral-dark">
                      ₹{(cart.totalPrice + shippingCost).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="large"
                  className="w-full mt-4 hover:bg-primary-dark transition-colors flex justify-center items-center"
                  disabled={placeOrderMutation.isPending || paymentLoading}
                >
                  {paymentLoading || placeOrderMutation.isPending ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default Checkout;