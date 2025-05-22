import api from './api';

export const getCategories = async () => {
  const response = await api.get('/category/');
  return response.data;
};

export const createCategory = async (data) => {
  try {
    const response = await api.post('/category/', data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to create category');
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.patch(`/category/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update category');
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update category');
  }
};
