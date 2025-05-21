import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword } from '../services/userService';
import Button from '../components/Button';
import Input from '../components/Input';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response.message, { toastId: 'forgot-password-success' });
      navigate('/reset-password', { state: { email: formData.email } });
    },
    onError: (error) => {
      toast.error(error.message, { toastId: 'forgot-password-error' });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Valid email is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);
    forgotPasswordMutation.mutate(formData.email);
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
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} method="POST" action="#" className="space-y-4">
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
              disabled={isSubmitting}
            />
            {formErrors.email && <p className="text-error text-sm mt-1">{formErrors.email}</p>}
          </div>
          <Button
            type="submit"
            size="large"
            className="w-full mt-4 hover:bg-primary-dark transition-colors"
            disabled={isSubmitting || forgotPasswordMutation.isPending}
          >
            {isSubmitting || forgotPasswordMutation.isPending
              ? 'Sending...'
              : 'Send Reset OTP'}
          </Button>
        </form>
        <p className="text-center text-neutral mt-4">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;