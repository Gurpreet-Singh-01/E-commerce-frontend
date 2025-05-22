import api from './api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/product/', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/product/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  try {
    const response = await api.post('/product/', data);
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message || 'Failed to create Product');
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await api.patch(`/product/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update Product');
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
