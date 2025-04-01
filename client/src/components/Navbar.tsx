import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import bookmarkIcon from "../assets/bookmark_icon.png";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center text-3xl font-heading text-primary">
          <img src={bookmarkIcon} alt="Logo" className="w-12 h-12 mr-2" />
          The Bookmark
        </Link>

        <nav className="space-x-6 text-base font-medium text-gray-700 dark:text-gray-200">
          <Link to="/products">Products</Link>

          {user ? (
            <button onClick={logout} className="text-red-500 hover:underline">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;