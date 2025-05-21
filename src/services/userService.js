import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/user/login_user', {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (name, email, password, gender, phone) => {
  const response = await api.post('/user/register_user', {
    name,
    email,
    password,
    gender,
    phone
  });
  return response.data;
};

export const resendOTP = async (email) => {
  try {
   
    const response = await api.post('/user/resend_otp', {email});
    
    return response.data;
  } catch (error) {
    console.error('Resend OTP error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};

export const verifyUser = async ({ email, otp }) => {
  try {
    
    const response = await api.post('/user/verify_user', { email, otp });
    
    return response.data;
  } catch (error) {
    console.error('Verify user error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to verify user');
  }
};

export const changeCurrentPassword = async (oldPassword, newPassword) => {
  const response = await api.post('/user/change_password', {
    oldPassword,
    newPassword,
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/user/forgot_password', { email });
  return response.data;
};

export const resetPassword = async ({email, otp, newPassword}) => {
  const response = await api.post('/user/reset_password', {
    email,
    otp,
    newPassword,
  });
  return response.data;
};
export const refreshAccessToken = async () => {
  try {
    const response = await api.post('/user/refresh_access_token');
    const user = response.data?.data?.user;
    if (!user || !user._id || !user.role) {
      throw new Error('Invalid user data in refresh response');
    }
    return user;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to refresh token');
  }
};

export const logoutUser = async () => {
  await api.get('/user/logout_user');
};
export const getUserProfile = async () => {
  const response = await api.get('/user/user');
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await api.post('/user/update_userProfile', data);
  return response.data;
};

export const addAddress = async (
  houseNumber,
  street,
  colony,
  city,
  state,
  country,
  postalCode,
  isDefault
) => {
  const response = await api.post('/user/add_address', {
    houseNumber,
    street,
    colony,
    city,
    state,
    country,
    postalCode,
    isDefault,
  });
  return response.data;
};

export const updateAddress = async (id, data) => {
  const response = await api.patch(`/user/update_address/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/user/delete_address/${id}`);
  return response.data;
};
