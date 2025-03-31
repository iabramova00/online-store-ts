import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center text-2xl font-heading text-accent">
          <img
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="YourStore Logo"
            className="w-8 h-8 mr-2"
          />
          YourStore
        </Link>

        {/* Static links */}
        <div className="flex items-center space-x-6 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
          <Link to="/login" className="hover:text-accent">Login</Link>
          <Link to="/register" className="hover:text-accent">Register</Link>

          {/* Products aligned far right for future dropdown */}
          <div className="ml-8">
            <Link to="/products" className="hover:text-accent">
              Products
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
