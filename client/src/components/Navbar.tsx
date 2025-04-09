import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { setSearchTerm } from "../store/filterSlice";
import { RootState } from "../store/store";
import bookmarkIcon from "../assets/bookmark_icon.png";

// Utility styles
const hoverStyle = "hover:bg-teal-500 hover:text-white rounded transition duration-200";
const navPadding = "px-4 py-2";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchTerm = useSelector((state: RootState) => state.filters.searchTerm);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate("/products");
    }
  };

  const isAdmin = user?.isAdmin;
  const isLoggedIn = !!user;

  const mainLinks = isAdmin ? (
    <>
      <li>
        <Link to="/admin" className={`block ${navPadding} ${hoverStyle}`} >
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/admin/books" className={`block ${navPadding} ${hoverStyle}`} >
          Manage Books
        </Link>
      </li>
      <li>
        <button onClick={() => { logout();}} className={`block text-red-500 ${navPadding} ${hoverStyle}`}>
          Logout
        </button>
      </li>
    </>
  ) : (
    <>
      <li>
        <Link to="/products" className={`block ${navPadding} ${hoverStyle}`}>
          Books
        </Link>
      </li>
      {isLoggedIn ? (
        <li>
          <button onClick={() => { logout(); }} className={`block text-red-500 ${navPadding} ${hoverStyle}`}>
            Logout
          </button>
        </li>
      ) : (
        <>
          <li>
            <Link to="/login" className={`block ${navPadding} ${hoverStyle}`} >
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className={`block ${navPadding} ${hoverStyle}`}>
              Register
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-background sticky top-0 z-50 shadow-sm">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-full p-2">
        <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse focus:outline-none focus:ring-2 focus:ring-accent" >
          <img src={bookmarkIcon} className="h-16 w-16" alt="Logo" />
          <span className="self-center text-5xl text-primary font-semibold whitespace-nowrap">
            The Bookmark
          </span>
        </Link>

        {/* 🔍 Desktop Search */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center ml-4 flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full px-7 py-4 rounded-l-md text-xl focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button type="submit" className="px-8 py-4 bg-primary text-xl text-white rounded-r-md hover:bg-teal-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-primary">
            Search
          </button>
        </form>

        {/* Desktop Nav */}
        <div className="items-center justify-between font-medium hidden w-auto md:flex md:order-1 ml-8">
          <ul className="flex flex-col md:flex-row md:space-x-4 text-xl">
            {mainLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
