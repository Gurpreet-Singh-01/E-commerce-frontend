import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-text">
      <div className="text-center p-6 bg-surface rounded-lg shadow-xl max-w-md w-full mx-4">
        <FaExclamationCircle className="text-primary text-6xl mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-neutral-dark font-headings mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-neutral-dark font-headings mb-4">
          Page Not Found
        </h2>
        <p className="text-neutral-dark mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors font-text"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;