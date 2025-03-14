import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [packagesRef, packagesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden py-20"
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 lg:max-w-2xl lg:w-full">
            <motion.div 
              className="sm:text-center lg:text-left relative"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="relative inline-block">
                <SparklesIcon className="absolute -top-6 -left-6 h-8 w-8 text-party-yellow animate-pulse" />
                <h1 className="text-5xl tracking-tight font-extrabold sm:text-6xl md:text-7xl mb-4">
                  <span className="block party-gradient-text">Perfect Venue</span>
                  <span className="block party-gradient-text-alt">Special Events</span>
                </h1>
                <SparklesIcon className="absolute -bottom-6 -right-6 h-8 w-8 text-party-magenta animate-pulse-slow" />
              </motion.div>
              
              <motion.p 
                className="mt-6 text-xl text-gray-600 sm:max-w-xl sm:mx-auto lg:mx-0 leading-relaxed"
                variants={itemVariants}
              >
                Host memorable celebrations in our beautifully designed event halls. From intimate gatherings to grand celebrations, we have the perfect space for you.
              </motion.p>
              
              <motion.div 
                className="mt-10 sm:flex sm:justify-center lg:justify-start"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="shiny-button"
                >
                  <Link to="/booking" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-party-purple to-party-magenta shadow-lg hover:shadow-xl transition-all duration-300">
                    Book Your Event Now
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="absolute top-0 right-0 -z-10 opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <img src="/src/assets/confetti.svg" alt="" className="w-64 h-64" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Package Section */}
      <motion.div 
        className="py-20"
        ref={packagesRef}
        initial="hidden"
        animate={packagesInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <SparklesIcon className="h-6 w-6 text-party-teal animate-pulse" />
              <h2 className="text-4xl font-extrabold party-gradient-text sm:text-5xl">Our Event Halls</h2>
              <SparklesIcon className="h-6 w-6 text-party-orange animate-pulse-slow" />
            </div>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Choose from our two specially designed halls for your perfect event.
            </p>
          </motion.div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Hall 1 */}
              <motion.div 
                className="relative p-6 rounded-xl party-gradient-card bg-white card-3d"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900">Hall 1 (Small)</h3>
                  <p className="mt-2 text-gray-600">Perfect for intimate gatherings of up to 10 people</p>
                  <ul className="mt-6 space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-party-pink mr-2 animate-bounce">✨</span>
                      <span>Cozy atmosphere</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-purple mr-2 animate-bounce">✨</span>
                      <span>Modern audio system</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-teal mr-2 animate-bounce">✨</span>
                      <span>Comfortable seating</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-yellow mr-2 animate-bounce">✨</span>
                      <span>Basic decorations included</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/packages" 
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white bg-gradient-to-r from-party-teal to-party-blue shadow-lg hover:shadow-xl transition-all duration-300">
                      Learn More
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              {/* Hall 2 */}
              <motion.div 
                className="relative p-6 rounded-xl party-gradient-card bg-white card-3d"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900">Hall 2 (Large)</h3>
                  <p className="mt-2 text-gray-600">Ideal for larger events with up to 30 people</p>
                  <ul className="mt-6 space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-party-blue mr-2 animate-bounce">✨</span>
                      <span>Spacious layout</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-orange mr-2 animate-bounce">✨</span>
                      <span>Premium sound system</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-red mr-2 animate-bounce">✨</span>
                      <span>Projector setup</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-green mr-2 animate-bounce">✨</span>
                      <span>Custom decoration options</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/packages" 
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white bg-gradient-to-r from-party-magenta to-party-purple shadow-lg hover:shadow-xl transition-all duration-300">
                      Learn More
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;