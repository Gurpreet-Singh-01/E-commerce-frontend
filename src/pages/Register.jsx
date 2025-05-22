import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../services/userService';
import Button from '../components/Button';
import Input from '../components/Input';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password, gender, phone, role }) =>
      registerUser(name, email, password, gender, phone, role),
    onSuccess: (response) => {
      if (response.message === 'User exists but unverified. New OTP sent.') {
        toast.info(response.message, { toastId: 'register-unverified' });
      } else {
        toast.success(response.message, { toastId: 'register-success' });
      }
      navigate('/verify-email', { state: { email: formData.email } });
    },
    onError: (error) => {
      console.debug('Register error:', error.message);
      toast.error(error.message, { toastId: 'register-error' });
    },
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Valid email is required';
    }
    if (
      !formData.password.match(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      )
    ) {
      errors.password =
        'Password must be at least 8 characters, with one uppercase letter, one number, and one special character';
    }
    if (!['male', 'female', 'other'].includes(formData.gender)) {
      errors.gender = 'Gender is required';
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      errors.phone = 'Valid 10-digit phone number is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      phone: formData.phone,
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
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.name ? 'border-error' : ''
              }`}
            />
            {formErrors.name && (
              <p className="text-error text-sm mt-1">{formErrors.name}</p>
            )}
          </div>
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
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.password ? 'border-error' : ''
              }`}
            />
            {formErrors.password && (
              <p className="text-error text-sm mt-1">{formErrors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.gender ? 'border-error' : ''
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formErrors.gender && (
              <p className="text-error text-sm mt-1">{formErrors.gender}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Phone
            </label>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${
                formErrors.phone ? 'border-error' : ''
              }`}
            />
            {formErrors.phone && (
              <p className="text-error text-sm mt-1">{formErrors.phone}</p>
            )}
          </div>
          <Button
            type="submit"
            size="large"
            className="w-full mt-4 hover:bg-primary-dark transition-colors"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="text-center text-neutral mt-4">
          Registered but unverified?{' '}
          <Link to="/verify-email" className="text-primary hover:underline">
            Verify your email
          </Link>
        </p>
        <p className="text-center text-neutral mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
