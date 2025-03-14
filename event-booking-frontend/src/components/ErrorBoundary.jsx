import React from 'react';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div 
          className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            We apologize for the inconvenience. Please try refreshing the page or return to the home page.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-party-purple to-party-magenta text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Return to Home
          </Link>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 