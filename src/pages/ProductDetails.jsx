import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useState } from 'react';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

  const mutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: (response) => {
      dispatch(setCart(response.cart));
      toast.success('Added to cart!', { toastId: 'add-to-cart' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add to cart', {
        toastId: 'add-to-cart-error',
      });
    },
  });

  const handleAddToCart = () => {
    mutation.mutate({ productId: id, quantity });
  };

  if (error) {
    toast.error(data?.message || error.message, {
      toastId: 'product-details-error',
    });
  }

  return (
    <div className="min-h-screen flex flex-col font-text bg-surface">
      <main className="container mx-auto px-4 py-12 flex-grow">
        {isLoading && (
          <div className="flex justify-center items-center my-16">
            <Loader size="large" />
          </div>
        )}

        {data?.data && (
          <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded-xl shadow-md">
            <div className="md:w-1/2">
              <img
                src={data.data.image.url}
                alt={data.data.name}
                className="w-full h-[400px] object-contain rounded-lg bg-neutral-100"
              />
            </div>

            <div className="md:w-1/2 flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-3 font-headings text-neutral-dark">
                {data.data.name}
              </h1>
              <p className="text-neutral mb-4 text-sm">{data.data.description}</p>
              <p className="text-2xl font-bold text-primary mb-6">
                ₹{data.data.price}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24"
                />
                <Button
                  onClick={handleAddToCart}
                  disabled={mutation.isLoading}
                  className="cursor-pointer w-full sm:w-auto"
                >
                  {mutation.isLoading ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
