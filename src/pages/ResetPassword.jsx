import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../services/userService';
import Button from '../components/Button';
import Input from '../components/Input';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response.message, { toastId: 'reset-password-success' });
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message, { toastId: 'reset-password-error' });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.otp.match(/^\d{6}$/)) {
      errors.otp = 'OTP must be a 6-digit number';
    }
    if (
      !formData.newPassword.match(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      )
    ) {
      errors.newPassword =
        'Password must be at least 8 characters, with one uppercase letter, one number, and one special character';
    }

    if (formData.confirmPassword !== formData.newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);
    resetPasswordMutation.mutate({
      email: formData.email,
      otp: formData.otp,
      newPassword: formData.newPassword,
    });
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
          Reset Password
        </h1>
        <form
          onSubmit={handleSubmit}
          method="POST"
          action="#"
          className="space-y-4"
        >
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
              disabled={isSubmitting}
            />
            {formErrors.otp && (
              <p className="text-error text-sm mt-1">{formErrors.otp}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              New Password
            </label>
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.newPassword ? 'border-error' : ''
              }`}
              disabled={isSubmitting}
            />
            {formErrors.newPassword && (
              <p className="text-error text-sm mt-1">
                {formErrors.newPassword}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter new password"
              className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.newPassword ? 'border-error' : ''
              }`}
              disabled={isSubmitting}
            />
            {formErrors.confirmPassword && (
              <p className="text-error text-sm mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="large"
            className="w-full mt-4 hover:bg-primary-dark transition-colors"
            disabled={isSubmitting || resetPasswordMutation.isPending}
          >
            {isSubmitting || resetPasswordMutation.isPending
              ? 'Resetting...'
              : 'Reset Password'}
          </Button>
        </form>
        <p className="text-center text-neutral mt-4">
          Back to{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
