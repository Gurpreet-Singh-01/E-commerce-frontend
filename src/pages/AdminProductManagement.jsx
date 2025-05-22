import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaImage } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';

const AdminProductManagement = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [categoryModal, setCategoryModal] = useState({ open: false, mode: 'create', id: null });
  const [productModal, setProductModal] = useState({ open: false, mode: 'create', id: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null });
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  if (!authLoading && !isAdmin()) {
    window.location.href = '/';
    return null;
  }

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/category/');
      return response.data.data;
    },
    select: (data) => data,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/product/');
      return response.data.data;
    },
    select: (data) => data,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created', { theme: 'light' });
      closeCategoryModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create category', { theme: 'light' });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category updated', { theme: 'light' });
      closeCategoryModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update category', { theme: 'light' });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted', { theme: 'light' });
      closeDeleteModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category', { theme: 'light' });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value) formData.append(key, value);
        else if (value) formData.append(key, value);
      });
      return createProduct(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product created', { theme: 'light' });
      closeProductModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product', { theme: 'light' });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value) formData.append(key, value);
        else if (value) formData.append(key, value);
      });
      return updateProduct(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product updated', { theme: 'light' });
      closeProductModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product', { theme: 'light' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product deleted', { theme: 'light' });
      closeDeleteModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product', { theme: 'light' });
    },
  });

  const openCategoryModal = (mode, category = null) => {
    setCategoryModal({ open: true, mode, id: category?._id || null });
    setCategoryForm({ name: category?.name || '' });
  };

  const closeCategoryModal = () => {
    setCategoryModal({ open: false, mode: 'create', id: null });
    setCategoryForm({ name: '' });
  };

  const openProductModal = (mode, product = null) => {
    setProductModal({ open: true, mode, id: product?._id || null });
    setProductForm({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      category: product?.category._id || '',
      stock: product?.stock || '',
      image: null,
    });
    setImagePreview(product?.image?.url || null);
  };

  const closeProductModal = () => {
    setProductModal({ open: false, mode: 'create', id: null });
    setProductForm({ name: '', description: '', price: '', category: '', stock: '', image: null });
    setImagePreview(null);
  };

  const openDeleteModal = (type, id) => {
    setDeleteModal({ open: true, type, id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, type: '', id: null });
  };

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setProductForm((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setProductForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (categoryModal.mode === 'create') {
      createCategoryMutation.mutate(categoryForm);
    } else {
      updateCategoryMutation.mutate({ id: categoryModal.id, data: categoryForm });
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (productModal.mode === 'create') {
      createProductMutation.mutate(productForm);
    } else {
      updateProductMutation.mutate({ id: productModal.id, data: productForm });
    }
  };

  const handleDelete = () => {
    if (deleteModal.type === 'category') {
      deleteCategoryMutation.mutate(deleteModal.id);
    } else {
      deleteProductMutation.mutate(deleteModal.id);
    }
  };

  if (authLoading) {
    return <Loader size="large" className="my-4" />;
  }

return <>Testing</>
};

export default AdminProductManagement;