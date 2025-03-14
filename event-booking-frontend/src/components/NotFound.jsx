import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="relative"
        variants={itemVariants}
      >
        <h1 className="text-9xl font-extrabold party-gradient-text">404</h1>
        <div className="absolute -top-6 -right-6 animate-float">
          <img src="/src/assets/balloon.svg" alt="Balloon" className="w-16 h-16" />
        </div>
      </motion.div>
      
      <motion.h2 
        className="mt-6 text-3xl font-bold text-gray-800"
        variants={itemVariants}
      >
        Oops! Page Not Found
      </motion.h2>
      
      <motion.p 
        className="mt-4 text-lg text-gray-600 max-w-md"
        variants={itemVariants}
      >
        Looks like the page you're looking for has floated away to another party!
      </motion.p>
      
      <motion.div
        className="mt-8"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-party-purple to-party-magenta text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group">
          <HomeIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          Return to the Party
        </Link>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 right-10 opacity-50"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <img src="/src/assets/confetti.svg" alt="Confetti" className="w-24 h-24" />
      </motion.div>
    </motion.div>
  );
};

export default NotFound;