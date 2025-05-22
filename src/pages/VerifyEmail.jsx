import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { verifyUser, resendOTP } from '../services/userService';
import { setCredentials } from '../store/authSlice';
import Button from '../components/Button';
import Input from '../components/Input';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const verifyMutation = useMutation({
    mutationFn: verifyUser,
    onSuccess: (response) => {
      const user = response.data.user;
      dispatch(setCredentials({ user }));
      toast.success(response.message, { toastId: 'verify-success' });
      navigate('/products');
    },
    onError: (error) => {
      console.debug('Verify error:', error.message);
      toast.error(error.message, { toastId: 'verify-error' });
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOTP,
    onSuccess: (response) => {
      toast.success(response.message, { toastId: 'resend-success' });
      setResendTimer(60);
      setCanResend(false);
    },
    onError: (error) => {
      console.debug('Resend OTP error:', error.message);
      toast.error(error.message, { toastId: 'resend-error' });
    },
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.otp.trim()) {
      errors.otp = 'OTP is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    verifyMutation.mutate({ email: formData.email, otp: formData.otp });
  };

  const handleResend = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormErrors({ email: 'Valid email is required' });
      return;
    }
    resendMutation.mutate(formData.email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-text">
      <div className="bg-surface p-8 rounded-lg shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 font-headings text-neutral-dark">
          Verify Email
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.email ? 'border-error' : ''
              }`}
            />
            {formErrors.email && (
              <p className="text-error text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              OTP
            </label>
            <Input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              placeholder="Enter 6-digit OTP"
              className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.otp ? 'border-error' : ''
              }`}
            />
            {formErrors.otp && (
              <p className="text-error text-sm mt-1">{formErrors.otp}</p>
            )}
          </div>
          <Button
            type="submit"
            size="large"
            className="w-full mt-4 hover:bg-primary-dark transition-colors"
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Button
            variant="secondary"
            size="medium"
            onClick={handleResend}
            disabled={!canResend || resendMutation.isPending}
            className="relative"
          >
            {resendMutation.isPending
              ? 'Resending...'
              : canResend
                ? 'Resend OTP'
                : `Resend OTP (${resendTimer}s)`}
          </Button>
        </div>
        <p className="text-center text-neutral mt-4">
          Already verified?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
