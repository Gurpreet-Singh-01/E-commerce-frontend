import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/user/login_user', {
    email,
    password,
  });
  return response.data.data;
};

export const registerUser = async (name, email, password, gender, role) => {
  const response = await api.post('/user/register_user', {
    name,
    email,
    password,
    gender,
    role,
  });
  return response.data.data;
};

export const verifyUser = async (email, otp) => {
  const response = await api.post('/user/verify_user', { email, otp });
  return response.data.data;
};

export const logoutUser = async () => {
  await api.get('user/logout_user');
};

export const changeCurrentPassword = async (oldPassword, newPassword) => {
  const response = await api.post('/user/change_password', {
    oldPassword,
    newPassword,
  });
  return response.data.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/user/forgot_password', { email });
  return response.data.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post('/user/reset_password', {
    email,
    otp,
    newPassword,
  });
  return response.data.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post('/user/refresh_access_token');
  return response.data.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/user/user');
  return response.data.data;
};

export const updateUserProfile = async (data) => {
  const response = await api.post('/user/update_userProfile', data);
  return response.data.data;
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
  return response.data.data;
};

export const updateAddress = async (id ,data) =>{
    const response= await api.patch(`/user/update_address/${id}`,data)
    return response.data.data;
}

export const deleteAddress = async(id) =>{
    const response = await api.delete(`/user/delete_address/${id}`)
    return response.data.data
}
