import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };
  
  const logoVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md shadow-lg border-b border-party-purple/10 sticky top-0 z-50"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            variants={logoVariants}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative"
          >
            {isHovered && (
              <motion.div 
                className="absolute -top-1 -right-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SparklesIcon className="h-5 w-5 text-party-yellow animate-pulse" />
              </motion.div>
            )}
            <Link 
              to="/" 
              className="text-3xl font-extrabold party-gradient-text shiny-button"
            >
              Event Booking
            </Link>
          </motion.div>

          <motion.div className="flex items-center space-x-8" variants={navVariants}>
            {[
              { to: '/', text: 'Home' },
              { to: '/packages', text: 'Packages' },
              { to: '/booking', text: 'Book Now' },
              { to: '/contact', text: 'Contact' }
            ].map((link) => (
              <motion.div
                key={link.to}
                variants={linkVariants}
                whileHover="hover"
                className="relative group"
              >
                <Link
                  to={link.to}
                  className="text-gray-700 font-medium transition-colors duration-300 hover:text-party-purple"
                >
                  {link.text}
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-party-purple to-party-magenta group-hover:w-full transition-all duration-300"></span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;