import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-secondary py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left font-text">
        <div>
          <h3 className="text-xl font-bold mb-4 font-logo">TechTrendz</h3>
          <p className="text-sm">
            Your one-stop shop for the latest tech gadgets.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 font-headings">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/products"
                className="hover:text-accent transition hover:cursor-pointer"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-accent transition hover:cursor-pointer"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:text-accent transition hover:cursor-pointer"
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 font-headings">
            Follow Us
          </h4>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://github.com/Gurpreet-Singh-01"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 text-sm font-text">
        © {new Date().getFullYear()} TechTrendz. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
