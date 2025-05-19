import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getProducts } from '../services/productService';



const Products = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  return (
    <>

      <div className="min-h-screen flex flex-col font-text">

        <main className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold text-center mb-8 font-headings">Products</h1>
          {isLoading && <Loader />}
          {error && <p className="text-center text-error">{data?.message || error.message}</p>}
          {data && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data?.length > 0 ? (
                data.data.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={(id, qty) => console.log(`Add to cart: ${id}, ${qty}`)}
                  />
                ))
              ) : (
                <p className="text-center text-neutral col-span-full">No products available</p>
              )}
            </div>
          )}
        </main>

      </div>

    </>
  );
};

export default Products;
