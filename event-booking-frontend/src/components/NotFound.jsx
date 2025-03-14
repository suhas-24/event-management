import { motion } from 'framer-motion';

const NotFound = ({ navigateTo }) => {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold party-gradient-text">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8">
          <motion.button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-party-purple to-party-magenta hover:from-party-purple-dark hover:to-party-magenta-dark"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return Home
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;