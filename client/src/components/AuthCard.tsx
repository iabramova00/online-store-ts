import { Link } from "react-router-dom";

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
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="Logo"
          />
          YourStore
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
