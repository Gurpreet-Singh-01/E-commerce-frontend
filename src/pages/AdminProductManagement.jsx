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
  getProducts,
} from '../services/productService';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from '../services/categoryService';

const AdminProductManagement = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [categoryModal, setCategoryModal] = useState({
    open: false,
    mode: 'create',
    id: null,
  });
  const [productModal, setProductModal] = useState({
    open: false,
    mode: 'create',
    id: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: '',
    id: null,
  });
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
    queryFn: getCategories,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created', { theme: 'light' });
      closeCategoryModal();
    },
    onError: (error) => {
      toast.error(
        error.message || 'Failed to create category',
        { theme: 'light' }
      );
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
      toast.error(
        error.message || 'Failed to update category',
        { theme: 'light' }
      );
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
      toast.error(
        error.message || 'Failed to delete category',
        { theme: 'light' }
      );
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
      console.log(createProductMutation.data);
      toast.success('Product created', { theme: 'light' });
      closeProductModal();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create product', {
        theme: 'light',
      });
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
      toast.error(error.message || 'Failed to update product', {
        theme: 'light',
      });
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
      toast.error(error.message || 'Failed to delete product', {
        theme: 'light',
      });
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
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: null,
    });
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
      updateCategoryMutation.mutate({
        id: categoryModal.id,
        data: categoryForm,
      });
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

  return (
    <div className="min-h-screen bg-background font-logo">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-8 font-headings">
          Product Management
        </h1>

        {/* Categories Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-neutral-dark font-headings">
              Categories{' '}
              {categories?.data?.length ? `(${categories.data.length})` : ''}
            </h2>
            <button
              onClick={() => openCategoryModal('create')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors font-text"
            >
              <FaPlus /> Add Category
            </button>
          </div>
          <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full text-neutral-dark font-text">
              <thead>
                <tr className="bg-neutral-light/50">
                  <th className="p-4 text-left font-medium">Name</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesLoading ? (
                  <tr>
                    <td colSpan="2" className="p-4 text-center">
                      <FaSpinner className="animate-spin inline text-primary mr-2" />
                      Loading...
                    </td>
                  </tr>
                ) : categories?.data?.length ? (
                  categories.data.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-neutral-light/50 hover:bg-neutral-light/20 transition-colors"
                    >
                      <td className="p-4">{category.name}</td>
                      <td className="p-4 flex gap-4">
                        <button
                          onClick={() => openCategoryModal('edit', category)}
                          className="text-primary hover:text-primary-dark"
                          aria-label={`Edit category ${category.name}`}
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() =>
                            openDeleteModal('category', category._id)
                          }
                          className="text-error hover:text-error/80"
                          aria-label={`Delete category ${category.name}`}
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="p-4 text-center">
                      No categories
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Products Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-neutral-dark font-headings">
              Products{' '}
              {products?.data?.length ? `(${products.data.length})` : ''}
            </h2>
            <button
              onClick={() => openProductModal('create')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors font-text"
            >
              <FaPlus /> Add Product
            </button>
          </div>
          <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full text-neutral-dark font-text">
              <thead>
                <tr className="bg-neutral-light/50">
                  <th className="p-4 text-left font-medium">Name</th>
                  <th className="p-4 text-left font-medium">Price</th>
                  <th className="p-4 text-left font-medium">Category</th>
                  <th className="p-4 text-left font-medium">Stock</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsLoading ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      <FaSpinner className="animate-spin inline text-primary mr-2" />
                      Loading...
                    </td>
                  </tr>
                ) : products?.data?.length ? (
                  products.data.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-neutral-light/50 hover:bg-neutral-light/20 transition-colors"
                    >
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">₹{product.price}</td>
                      <td className="p-4">{product.category.name}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4 flex gap-4">
                        <button
                          onClick={() => openProductModal('edit', product)}
                          className="text-primary hover:text-primary-dark"
                          aria-label={`Edit product ${product.name}`}
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() =>
                            openDeleteModal('product', product._id)
                          }
                          className="text-error hover:text-error/80"
                          aria-label={`Delete product ${product.name}`}
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Category Modal */}
        <Modal
          isOpen={categoryModal.open}
          onClose={closeCategoryModal}
          title={
            categoryModal.mode === 'create' ? 'Add Category' : 'Edit Category'
          }
          footer={
            <>
              <button
                onClick={closeCategoryModal}
                className="px-4 py-2 bg-neutral text-secondary rounded-lg hover:bg-neutral-dark transition-colors font-text"
              >
                Cancel
              </button>
              <button
                onClick={handleCategorySubmit}
                className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors font-text"
                disabled={
                  createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending
                }
              >
                {createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending ? (
                  <FaSpinner className="animate-spin inline mr-2" />
                ) : (
                  'Save'
                )}
              </button>
            </>
          }
        >
          <form onSubmit={handleCategorySubmit} className="space-y-4 font-text">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-dark"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryFormChange}
                className="mt-1 w-full p-3 bg-surface border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
          </form>
        </Modal>

        {/* Product Modal */}
        <Modal
          isOpen={productModal.open}
          onClose={closeProductModal}
          title={
            productModal.mode === 'create' ? 'Add Product' : 'Edit Product'
          }
          size="lg"
          footer={
            <>
              <button
                onClick={closeProductModal}
                className="px-4 py-2 bg-neutral text-secondary rounded-lg hover:bg-neutral-dark transition-colors font-text"
              >
                Cancel
              </button>
              <button
                onClick={handleProductSubmit}
                className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors font-text"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
              >
                {createProductMutation.isPending ||
                  updateProductMutation.isPending ? (
                  <FaSpinner className="animate-spin inline mr-2" />
                ) : (
                  'Save'
                )}
              </button>
            </>
          }
        >
          <form onSubmit={handleProductSubmit} className="space-y-4 font-text">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-dark"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productForm.name}
                onChange={handleProductFormChange}
                className="mt-1 w-full p-3 bg-surface border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-neutral-dark"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={productForm.description}
                onChange={handleProductFormChange}
                className="mt-1 w-full p-3 bg-surface border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-neutral-dark"
              >
                Price (₹)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={productForm.price}
                onChange={handleProductFormChange}
                className="mt-1 w-full p-3 bg-surface border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-neutral-dark"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={productForm.category}
                onChange={handleProductFormChange}
                className="mt-1 w-full p-3 bg-surface border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories?.data?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-neutral-dark"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={productForm.stock}
                onChange={handleProductFormChange}
                className="mt-1 w-full p-3 bg-surface border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                min="0"
                required
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-neutral-dark"
              >
                Product Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleProductFormChange}
                className="mt-1 w-full p-3 bg-surface border border-neutral-light rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-secondary file:hover:bg-primary-dark"
                required={productModal.mode === 'create'}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={closeDeleteModal}
          title={`Delete ${deleteModal.type === 'category' ? 'Category' : 'Product'}`}
          footer={
            <>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-neutral text-secondary rounded-lg hover:bg-neutral-dark transition-colors font-text"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-error text-secondary rounded-lg hover:bg-error/80 transition-colors font-text"
                disabled={
                  deleteCategoryMutation.isPending ||
                  deleteProductMutation.isPending
                }
              >
                {deleteCategoryMutation.isPending ||
                  deleteProductMutation.isPending ? (
                  <FaSpinner className="animate-spin inline mr-2" />
                ) : (
                  'Yes'
                )}
              </button>
            </>
          }
        >
          <p className="text-neutral-dark font-text">
            Are you sure you want to delete this {deleteModal.type}?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default AdminProductManagement;
