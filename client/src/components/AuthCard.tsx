import { Link } from "react-router-dom";
import bookmarkIcon from "../assets/bookmark_icon.png";

interface AuthCardProps {
  heading: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ heading, children }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-10 md:p-12">
      <div className="flex flex-col items-center mb-6">
        <Link to="/" className="flex items-center text-primary font-heading text-2xl sm:text-3xl">
          <img
            className="w-10 h-10 mr-2"
            src={bookmarkIcon}
            alt="Logo"
          />
          The Bookmark
        </Link>
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-center text-gray-900 dark:text-white mb-8">
        {heading}
      </h1>
      {children}
    </div>
  );
};

export default AuthCard;
