import { useState } from 'react';
import { motion } from 'framer-motion';

const AdminLogin = ({ onLogin, navigateTo }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would validate the token with the backend
      onLogin(token);
    } catch (err) {
      setError('Invalid admin token');
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your admin token to access the dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="admin-token" className="sr-only">
                Admin Token
              </label>
              <input
                id="admin-token"
                name="token"
                type="password"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin token"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-party-purple to-party-magenta hover:from-party-purple-dark hover:to-party-magenta-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign in
            </motion.button>
          </div>
          
          <div className="text-center">
            <motion.button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-sm text-party-purple hover:text-party-purple-dark"
              whileHover={{ scale: 1.05 }}
            >
              Return to Home
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminLogin; 