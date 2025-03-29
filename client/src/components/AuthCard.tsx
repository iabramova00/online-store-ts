import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthCardProps {
  children: ReactNode;
  heading: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, heading }) => {
  return (
    <section className="bg-background dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-heading text-primary"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="Logo"
          />
          YourStore
        </Link>

        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {heading}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthCard;
