import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SparklesIcon, Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ currentView, navigateTo, isAdmin, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Track scroll position for header transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const navLinks = [
    { view: 'home', text: 'Home' },
    { view: 'packages', text: 'Packages' },
    { view: 'booking', text: 'Book Now' }
  ];

  // Determine if a link is active
  const isActive = (view) => currentView === view;

  return (
    <motion.header 
      className={`${scrollPosition > 50 ? 'bg-white/80' : 'bg-white/95'} backdrop-blur-md shadow-lg border-b border-party-purple/10 sticky top-0 z-50 transition-all duration-300`}
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
            <button 
              onClick={() => navigateTo('home')}
              className="text-3xl font-extrabold party-gradient-text shiny-button"
            >
              Event Booking
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div className="hidden md:flex items-center space-x-8" variants={navVariants}>
            {navLinks.map((link) => (
              <motion.div
                key={link.view}
                variants={linkVariants}
                whileHover="hover"
                className="relative group"
              >
                <button
                  onClick={() => navigateTo(link.view)}
                  className={`font-medium transition-colors duration-300 ${
                    isActive(link.view) 
                      ? 'text-party-purple font-semibold' 
                      : 'text-gray-700 hover:text-party-purple'
                  }`}
                >
                  {link.text}
                </button>
                <span 
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-party-purple to-party-magenta transition-all duration-300 ${
                    isActive(link.view) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </motion.div>
            ))}

            {/* Admin Button */}
            <motion.div
              variants={linkVariants}
              whileHover="hover"
              className="relative group"
            >
              {isAdmin ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigateTo('adminDashboard')}
                    className={`flex items-center space-x-1 font-medium transition-colors duration-300 ${
                      isActive('adminDashboard') 
                        ? 'text-party-purple font-semibold' 
                        : 'text-gray-700 hover:text-party-purple'
                    }`}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span>Admin</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateTo('adminLogin')}
                  className="text-gray-700 font-medium transition-colors duration-300 hover:text-party-purple"
                >
                  Admin
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-party-purple transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-50 overflow-y-auto"
        initial="closed"
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 hover:text-party-purple transition-colors duration-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            {navLinks.map((link) => (
              <motion.div
                key={link.view}
                variants={linkVariants}
                className="py-2"
              >
                <button
                  onClick={() => {
                    navigateTo(link.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left font-medium transition-colors duration-300 ${
                    isActive(link.view) 
                      ? 'text-party-purple font-semibold' 
                      : 'text-gray-700 hover:text-party-purple'
                  }`}
                >
                  {link.text}
                </button>
              </motion.div>
            ))}
            
            {/* Admin Button in Mobile Menu */}
            <motion.div
              variants={linkVariants}
              className="py-2 border-t border-gray-200 mt-4 pt-4"
            >
              {isAdmin ? (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      navigateTo('adminDashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left font-medium transition-colors duration-300 ${
                      isActive('adminDashboard') 
                        ? 'text-party-purple font-semibold' 
                        : 'text-gray-700 hover:text-party-purple'
                    }`}
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigateTo('adminLogin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left font-medium transition-colors duration-300 hover:text-party-purple"
                >
                  Admin Login
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;