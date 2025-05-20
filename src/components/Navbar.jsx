import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAdmin, logout, isLoading } = useAuth();
  const { totalQuantity } = useSelector((state) => state.cart);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout(); // Calls useAuth's logout_User, which redirects to /login
    } catch (error) {
      console.error('Logout Error in Navbar:', error);
    }
  };

  // Wait for loading to complete before rendering navigation links
  if (isLoading) {
    return null; // Or render a loading spinner if desired
  }

  return (
    <nav className="bg-primary text-secondary shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight font-logo">
          TechTrendz
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          disabled={isLoading}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:items-center absolute md:static top-16 left-0 w-full md:w-auto bg-primary md:bg-transparent p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-6 font-text text-base`}
        >
          <Link
            to="/products"
            className="hover:text-accent transition hover:cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="relative hover:text-accent transition hover:cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Cart
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-4 bg-error text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>

          {user && (
            <Link
              to="/profile"
              className="hover:text-accent transition hover:cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          )}
          {isAdmin() && (
            <Link
              to="/admin"
              className="hover:text-accent transition hover:cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="hover:text-accent transition text-left hover:cursor-pointer"
              disabled={isLoading}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hover:text-accent transition hover:cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;