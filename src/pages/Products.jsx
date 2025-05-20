import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { addToCart } from '../services/cartService';
import useAuth from '../hooks/useAuth';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [inputCategory, setInputCategory] = useState('');
  const [inputMinPrice, setInputMinPrice] = useState('');
  const [inputMaxPrice, setInputMaxPrice] = useState('');
  const [appliedCategory, setAppliedCategory] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [errors, setErrors] = useState({});

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    onError: (err) => {
      console.debug('Categories fetch error:', err.message || 'Failed to fetch categories');
      toast.error('Failed to load categories. Please try again.', { toastId: 'categories-error' });
    },
    // Retry once for guest users
    retry: (failureCount, error) => failureCount < 1 && error.response?.status !== 401,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { search, appliedCategory, appliedMinPrice, to: appliedMaxPrice }],
    queryFn: () =>
      getProducts({
        search: search.trim() || undefined,
        category: appliedCategory || undefined,
        minPrice: appliedMinPrice || undefined,
        maxPrice: appliedMaxPrice || undefined,
      }),
    onError: (err) => {
      console.debug('Products fetch error:', err.message || 'Failed to fetch products');
      toast.error('Failed to load products. Please try again.', { toastId: 'products-error' });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: (response) => {
      dispatch(setCart(response.cart));
      toast.success(response.message || 'Added to cart!', { toastId: 'add-to-cart' });
    },
    onError: (error) => {
      console.debug('Add to cart error:', error.message || 'Failed to add to cart');
      if (error.response?.status === 401) {
        toast.error('Please log in to add items to cart', { toastId: 'add-to-cart-auth' });
        navigate('/login');
      } else {
        toast.error(error.message || 'Failed to add to cart', { toastId: 'add-to-cart-error' });
      }
    },
  });

  const validateFilters = () => {
    const newErrors = {};
    const min = parseFloat(inputMinPrice);
    const max = parseFloat(inputMaxPrice);

    if (inputMinPrice && (isNaN(min) || min < 0)) {
      newErrors.minPrice = 'Minimum price must be a positive number';
    }
    if (inputMaxPrice && (isNaN(max) || max < 0)) {
      newErrors.maxPrice = 'Maximum price must be a positive number';
    }
    if (inputMinPrice && inputMaxPrice && !isNaN(min) && !isNaN(max) && min > max) {
      newErrors.range = 'Minimum price cannot be greater than maximum price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value.trim();
    setSearch(searchTerm);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    if (validateFilters()) {
      setAppliedCategory(inputCategory);
      setAppliedMinPrice(inputMinPrice);
      setAppliedMaxPrice(inputMaxPrice);
    } else {
      toast.error('Enter correct filters', { toastId: 'filter-error' });
    }
  };

  const handleReset = () => {
    setSearch('');
    setInputCategory('');
    setInputMinPrice('');
    setInputMaxPrice('');
    setAppliedCategory('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setErrors({});
  };

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart', { toastId: 'add-to-cart-auth' });
      navigate('/login');
      return;
    }
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  return (
    <div className="min-h-screen flex flex-col font-text bg-surface">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8 font-headings text-neutral-dark">
          Explore Products
        </h1>

        {/* Search and Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  name="search"
                  placeholder="Search products (e.g., Apple Cover)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="medium">
                  Search
                </Button>
              </div>
            </form>

            {/* Filters */}
            <form onSubmit={handleFilter} className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark font-headings mb-1">
                  Category
                </label>
                {categoriesLoading ? (
                  <Loader size="small" />
                ) : categoriesError || !categoriesData?.data?.length ? (
                  <p className="text-error text-sm">No categories available</p>
                ) : (
                  <select
                    name="category"
                    value={inputCategory}
                    onChange={(e) => setInputCategory(e.target.value)}
                    className="w-full border border-neutral-light rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-text"
                  >
                    <option value="">All Categories</option>
                    {categoriesData.data.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-dark font-headings mb-1">
                    Min Price
                  </label>
                  <Input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={inputMinPrice}
                    onChange={(e) => setInputMinPrice(e.target.value)}
                    className={errors.minPrice ? 'border-error' : ''}
                    min="0"
                  />
                  {errors.minPrice && (
                    <p className="text-error text-sm mt-1">{errors.minPrice}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-dark font-headings mb-1">
                    Max Price
                  </label>
                  <Input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={inputMaxPrice}
                    onChange={(e) => setInputMaxPrice(e.target.value)}
                    className={errors.maxPrice ? 'border-error' : ''}
                    min="0"
                  />
                  {errors.maxPrice && (
                    <p className="text-error text-sm mt-1">{errors.maxPrice}</p>
                  )}
                </div>
              </div>
              {errors.range && (
                <p className="text-error text-sm">{errors.range}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  Apply Filters
                </Button>
                <Button type="button" variant="secondary" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading && <Loader size="large" className="my-8" />}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.data?.length > 0 ? (
              data.data.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image.url,
                    category: product.category.name,
                  }}
                  onAddToCart={() => handleAddToCart(product._id)}
                />
              ))
            ) : (
              <p className="text-center text-neutral col-span-full">
                No products found
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;