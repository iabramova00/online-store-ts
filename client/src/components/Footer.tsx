import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} The Bookmark. All rights reserved.</p>
        <nav className="flex space-x-4">
          <Link to="/about" className="hover:text-accent">About</Link>
          <Link to="/contact" className="hover:text-accent">Contact</Link>
          <Link to="/privacy" className="hover:text-accent">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
