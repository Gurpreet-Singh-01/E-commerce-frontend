import { Link } from 'react-router-dom';
import Button from './Button';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-surface shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105 font-text">
      <Link to={`/products/${product.id}`}>
        <div className="relative w-full aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate font-headings">
          {product.name}
        </h3>
        <p className="text-neutral text-sm mt-1">{product.price.toLocaleString('en-IN' ,{
          style:'currency',
          currency:'INR'
        })}</p>
        <p className="text-neutral text-xs mt-1">Stock: {product.stock}</p>
        <Button
          variant="primary"
          size="medium"
          onClick={() => onAddToCart(product._id, 1)}
          disabled={product.stock === 0}
          className="mt-4 w-full"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
