import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { logoutUser } from '../services/userService';
const Navbar = () => {
    const { user, isAdmin, logout } = useAuth();
    const { totalQuantity } = useSelector((state) => state.cart);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {

            // logout still pending 
            // await logout();
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };
    return (
        <nav className="bg-primary text-secondary shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* THere has to be link */}
                {/* <Link className="text-2xl font-bold tracking-tight font-logo">
            TechTrendz
          </Link> */}
                <h1 className="text-4xl font-bold tracking-tight font-logo">
                    TechTrendz
                </h1>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
                <div
                    className={`${isOpen ? 'flex' : 'hidden'
                        } md:flex flex-col md:flex-row md:items-center absolute md:static top-16 left-0 w-full md:w-auto bg-primary md:bg-transparent p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-6 font-text text-base`}
                >
                    {/* <Link to="/products" className="hover:text-accent transition hover:cursor-pointer">
                        Products
                    </Link> */}

                    <p className="hover:text-accent transition hover:cursor-pointer">
                        Products
                    </p>

                    {/* <Link to="/cart" className="relative hover:text-accent transition hover:cursor-pointer">
                        Cart
                        {totalQuantity > 0 && (
                            <span className="absolute -top-2 -right-4 bg-error text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalQuantity}
                            </span>
                        )}
                    </Link> */}
                    <p className="relative hover:text-accent transition hover:cursor-pointer">
                        Cart
                        {totalQuantity > 0 && (
                            <span className="absolute -top-2 -right-4 bg-error text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalQuantity}
                            </span>
                        )}
                    </p>
                    {user && (
                        // <Link to="/profile" className="hover:text-accent transition hover:cursor-pointer">
                        //     Profile
                        // </Link>
                        <p to="/profile" className="hover:text-accent transition hover:cursor-pointer">
                            Profile
                        </p>
                    )}
                    {isAdmin() && (
                        // <Link to="/admin" className="hover:text-accent transition hover:cursor-pointer">
                        //     Admin
                        // </Link>
                        <p to="/admin" className="hover:text-accent transition hover:cursor-pointer">
                            Admin
                        </p>
                    )}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="hover:text-accent transition text-left hover:cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        // <Link to="/login" className="hover:text-accent transition hover:cursor-pointer">
                        //     Login
                        // </Link>
                        <p to="/login" className="hover:text-accent transition hover:cursor-pointer">
                            Login
                        </p>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
