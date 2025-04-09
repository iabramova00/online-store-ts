import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-primary-200 text-primary text-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-base text-primary">&copy; {new Date().getFullYear()} The Bookmark. All rights reserved.</p>
        <nav className="flex space-x-4">
          {["about", "contact", "privacy"].map((path) => (
            <Link
              key={path}
              to={`/${path}`}
              className="px-4 py-2 rounded transition duration-200 hover:bg-teal-500 hover:text-white"
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
