import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  changeCurrentPassword,
} from '../services/userService';
import { setCredentials } from '../store/authSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [addressForm, setAddressForm] = useState({
    houseNumber: '',
    street: '',
    colony: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    isDefault: false,
  });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [formErrors, setFormErrors] = useState({});
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile
  const { data, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    select: (response) => response.data,
  });

  // Initialize profile form
  useEffect(() => {
    if (data) {
      setProfileForm({
        name: data.name || user?.name || '',
        phone: data.phone || user?.phone || '',
      });
    }
  }, [data, user]);

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (response) => {
      toast.success(response.message, { toastId: 'profile-update-success' });
      dispatch(setCredentials({ user: response.data }));
      queryClient.invalidateQueries('userProfile')
    },
    onError: (error) => {
      toast.error(error.message, { toastId: 'profile-update-error' });
    },
    onSettled: () => setIsSubmitting(false),
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: (response) => {
      toast.success(response.message, { toastId: 'address-add-success' });
      setAddressForm({
        houseNumber: '',
        street: '',
        colony: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        isDefault: false,
      });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message, { toastId: 'address-add-error' });
    },
    onSettled: () => setIsSubmitting(false),
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn:  updateAddress,
    onSuccess: (response) => {
      toast.success(response.message, { toastId: 'address-update-success' });
      setEditingAddressId(null);
      setAddressForm({
        houseNumber: '',
        street: '',
        colony: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        isDefault: false,
      });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message, { toastId: 'address-update-error' });
    },
    onSettled: () => setIsSubmitting(false),
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn:  deleteAddress,
    onSuccess: (response) => {
      toast.success(response.message, { toastId: 'address-delete-success' });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message, { toastId: 'address-delete-error' });
    },
    onSettled: () => setIsSubmitting(false),
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: changeCurrentPassword,
    onSuccess: (response) => {
      toast.success(response.message, { toastId: 'password-change-success' });
      setPasswordForm({ oldPassword: '', newPassword: '' });
    },
    onError: (error) => {
      toast.error(error.message, { toastId: 'password-change-error' });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const validateProfileForm = () => {
    const errors = {};
    if (!profileForm.name.trim()) errors.name = 'Name is required';
    if (!profileForm.phone.match(/^\d{10}$/)) {
      errors.phone = 'Valid 10-digit phone number is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddressForm = () => {
    const errors = {};
    if (!addressForm.houseNumber.trim()) errors.houseNumber = 'House number is required';
    if (!addressForm.street.trim()) errors.street = 'Street is required';
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.state.trim()) errors.state = 'State is required';
    if (!addressForm.country.trim()) errors.country = 'Country is required';
    if (!addressForm.postalCode.match(/^\d{6}$/)) {
      errors.postalCode = 'Valid 6-digit postal code is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.oldPassword) errors.oldPassword = 'Old password is required';
    if (
      !passwordForm.newPassword.match(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      )
    ) {
      errors.newPassword =
        'New password must be at least 8 characters, with one uppercase letter, one number, and one special character';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!validateProfileForm() || isSubmitting) return;
    setIsSubmitting(true);
    updateProfileMutation.mutate(profileForm);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!validateAddressForm() || isSubmitting) return;
    setIsSubmitting(true);
    if (editingAddressId) {
      updateAddressMutation.mutate({ id: editingAddressId, data: addressForm });
    } else {
      addAddressMutation.mutate(addressForm);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!validatePasswordForm() || isSubmitting) return;
    setIsSubmitting(true);
    changePasswordMutation.mutate(passwordForm);
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressForm({
      houseNumber: address.houseNumber,
      street: address.street,
      colony: address.colony || '',
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = (id) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    deleteAddressMutation.mutate( id)
  };

  const handleInputChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    if (formType === 'profile') {
      setProfileForm((prev) => ({ ...prev, [name]: value }));
    } else if (formType === 'address') {
      setAddressForm((prev) => ({ ...prev, [name]: newValue }));
    } else if (formType === 'password') {
      setPasswordForm((prev) => ({ ...prev, [name]: value }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  if (isLoading) return <Loader size="large" className="my-8" />;

  return (
    <div className="min-h-screen bg-background font-text py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 font-headings text-neutral-dark">
          Your Profile
        </h1>

        {/* Orders Section */}
        <div className="bg-surface p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-dark">Your Orders</h2>
          <Button
            size="large"
            className="w-full hover:bg-primary-dark transition-colors"
            onClick={() => navigate('/orders')}
            disabled={isSubmitting}
          >
            View Orders
          </Button>
        </div>

        {/* Profile Section */}
        <div className="bg-surface p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-dark">Personal Information</h2>
          <form onSubmit={handleProfileSubmit} method="POST" action="#" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Name</label>
              <Input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={(e) => handleInputChange(e, 'profile')}
                placeholder="Enter your name"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.name ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.name && <p className="text-error text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Email</label>
              <Input
                type="email"
                value={data?.email || user?.email || ''}
                className="w-full border-2 border-neutral-light rounded-md p-2 bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Phone</label>
              <Input
                type="text"
                name="phone"
                value={profileForm.phone}
                onChange={(e) => handleInputChange(e, 'profile')}
                placeholder="Enter your phone number"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.phone ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.phone && <p className="text-error text-sm mt-1">{formErrors.phone}</p>}
            </div>
            <Button
              type="submit"
              size="large"
              className="w-full mt-4 hover:bg-primary-dark transition-colors"
              disabled={isSubmitting || updateProfileMutation.isPending}
            >
              {isSubmitting || updateProfileMutation.isPending
                ? 'Updating...'
                : 'Update Profile'}
            </Button>
          </form>
        </div>

        {/* Addresses Section */}
        <div className="bg-surface p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-dark">Addresses</h2>
          {data?.addresses?.length > 0 ? (
            <div className="space-y-4">
              {data.addresses.map((address) => (
                <div
                  key={address._id}
                  className="border border-neutral-light p-4 rounded-md flex justify-between items-start"
                >
                  <div>
                    <p className="text-neutral-dark">
                      {address.houseNumber}, {address.street}, {address.colony}
                    </p>
                    <p className="text-neutral-dark">
                      {address.city}, {address.state}, {address.country} - {address.postalCode}
                    </p>
                    {address.isDefault && (
                      <span className="text-primary font-medium">Default</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEditAddress(address)}
                      disabled={isSubmitting}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="error"
                      size="small"
                      onClick={() => handleDeleteAddress(address._id)}
                      disabled={isSubmitting}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-dark">No addresses added.</p>
          )}

          <h3 className="text-xl font-semibold mt-6 mb-4 text-neutral-dark">
            {editingAddressId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form onSubmit={handleAddressSubmit} method="POST" action="#" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                House Number
              </label>
              <Input
                type="text"
                name="houseNumber"
                value={addressForm.houseNumber}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Enter house number"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.houseNumber ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.houseNumber && (
                <p className="text-error text-sm mt-1">{formErrors.houseNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Street
              </label>
              <Input
                type="text"
                name="street"
                value={addressForm.street}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Enter street"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.street ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.street && (
                <p className="text-error text-sm mt-1">{formErrors.street}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Colony (Optional)
              </label>
              <Input
                type="text"
                name="colony"
                value={addressForm.colony}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Enter colony"
                className="w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                City
              </label>
              <Input
                type="text"
                name="city"
                value={addressForm.city}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Enter city"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.city ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.city && <p className="text-error text-sm mt-1">{formErrors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                State
              </label>
              <Input
                type="text"
                name="state"
                value={addressForm.state}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Enter state"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.state ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.state && <p className="text-error text-sm mt-1">{formErrors.state}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Country
              </label>
              <Input
                type="text"
                name="country"
                value={addressForm.country}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Enter country"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.country ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.country && (
                <p className="text-error text-sm mt-1">{formErrors.country}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Postal Code
              </label>
              <Input
                type="text"
                name="postalCode"
                value={addressForm.postalCode}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Enter postal code"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.postalCode ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.postalCode && (
                <p className="text-error text-sm mt-1">{formErrors.postalCode}</p>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={addressForm.isDefault}
                onChange={(e) => handleInputChange(e, 'address')}
                className="mr-2"
                disabled={isSubmitting}
              />
              <label className="text-sm font-medium text-neutral-dark">
                Set as Default
              </label>
            </div>
            <Button
              type="submit"
              size="large"
              className="w-full mt-4 hover:bg-primary-dark transition-colors"
              disabled={isSubmitting || addAddressMutation.isPending || updateAddressMutation.isPending}
            >
              {isSubmitting || addAddressMutation.isPending || updateAddressMutation.isPending
                ? editingAddressId
                  ? 'Updating...'
                  : 'Adding...'
                : editingAddressId
                  ? 'Update Address'
                  : 'Add Address'}
            </Button>
            {editingAddressId && (
              <Button
                variant="secondary"
                size="large"
                className="w-full mt-2"
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressForm({
                    houseNumber: '',
                    street: '',
                    colony: '',
                    city: '',
                    state: '',
                    country: '',
                    postalCode: '',
                    isDefault: false,
                  });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-surface p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-dark">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} method="POST" action="#" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Old Password
              </label>
              <Input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={(e) => handleInputChange(e, 'password')}
                placeholder="Enter old password"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.oldPassword ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.oldPassword && (
                <p className="text-error text-sm mt-1">{formErrors.oldPassword}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                New Password
              </label>
              <Input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => handleInputChange(e, 'password')}
                placeholder="Enter new password"
                className={`w-full border-2 border-neutral-light rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary ${formErrors.newPassword ? 'border-error' : ''
                  }`}
                disabled={isSubmitting}
              />
              {formErrors.newPassword && (
                <p className="text-error text-sm mt-1">{formErrors.newPassword}</p>
              )}
            </div>
            <Button
              type="submit"
              size="large"
              className="w-full mt-4 hover:bg-primary-dark transition-colors"
              disabled={isSubmitting || changePasswordMutation.isPending}
            >
              {isSubmitting || changePasswordMutation.isPending
                ? 'Changing...'
                : 'Change Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;