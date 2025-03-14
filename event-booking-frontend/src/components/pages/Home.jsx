import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useInView } from 'react-intersection-observer';

const Home = ({ navigateTo }) => {
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
              <motion.h1 
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl"
                variants={itemVariants}
              >
                <span className="block">Create Unforgettable</span>
                <span className="block party-gradient-text">Moments Together</span>
              </motion.h1>
              <motion.p 
                className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                variants={itemVariants}
              >
                From intimate gatherings to grand celebrations, we provide the perfect venue and services to make your event truly special.
              </motion.p>
              <motion.div 
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                variants={itemVariants}
              >
                <div className="rounded-md shadow">
                  <motion.button
                    onClick={() => navigateTo('booking')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-party-purple to-party-magenta hover:from-party-purple-dark hover:to-party-magenta-dark md:py-4 md:text-lg md:px-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Now
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </motion.button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <motion.button
                    onClick={() => navigateTo('packages')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-party-purple bg-party-purple-light hover:bg-party-purple-light/80 md:py-4 md:text-lg md:px-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Packages
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 lg:mt-0 lg:mr-0 lg:right-0">
          <motion.div 
            className="h-72 w-72 bg-gradient-to-br from-party-yellow/30 to-party-orange/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20">
          <motion.div 
            className="h-72 w-72 bg-gradient-to-br from-party-purple/30 to-party-magenta/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="py-12 bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-party-purple font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need for a Perfect Event
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We take care of all the details so you can focus on enjoying your special day.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: 'Elegant Venues',
                  description: 'Choose from our selection of beautifully designed halls perfect for any occasion.',
                  icon: '✨'
                },
                {
                  name: 'Customizable Packages',
                  description: 'Tailor your event with our flexible packages to match your vision and budget.',
                  icon: '🎁'
                },
                {
                  name: 'Professional Staff',
                  description: 'Our experienced team will ensure your event runs smoothly from start to finish.',
                  icon: '👥'
                },
                {
                  name: 'Cutting-edge Technology',
                  description: 'State-of-the-art sound, lighting, and visual equipment for an immersive experience.',
                  icon: '🔊'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.name} 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                >
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-party-purple to-party-magenta text-white">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Packages Preview Section */}
      <motion.div 
        className="py-16"
        ref={packagesRef}
        initial="hidden"
        animate={packagesInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <h2 className="text-base text-party-purple font-semibold tracking-wide uppercase">Packages</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Choose Your Perfect Package
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We offer a variety of packages to suit different events and budgets.
            </p>
          </motion.div>

          <motion.div 
            className="mt-10 grid gap-8 md:grid-cols-3"
            variants={containerVariants}
          >
            {[
              {
                name: 'Basic',
                price: '$999',
                description: 'Perfect for small gatherings',
                features: ['Up to 50 guests', '4-hour venue rental', 'Basic decoration', 'Sound system']
              },
              {
                name: 'Premium',
                price: '$1,999',
                description: 'Ideal for medium-sized events',
                features: ['Up to 100 guests', '6-hour venue rental', 'Premium decoration', 'Sound & lighting', 'Catering options']
              },
              {
                name: 'Deluxe',
                price: '$3,999',
                description: 'For grand celebrations',
                features: ['Up to 200 guests', '8-hour venue rental', 'Luxury decoration', 'Full A/V setup', 'Catering included', 'Event coordinator']
              }
            ].map((pkg, index) => (
              <motion.div 
                key={pkg.name}
                className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                  <p className="mt-4 text-4xl font-extrabold text-party-purple">{pkg.price}</p>
                  <p className="mt-2 text-gray-500">{pkg.description}</p>
                  <ul className="mt-6 space-y-4">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-party-purple">✓</span>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <motion.button
                      onClick={() => navigateTo('packages')}
                      className="w-full bg-gradient-to-r from-party-purple to-party-magenta text-white py-3 px-4 rounded-md font-medium hover:from-party-purple-dark hover:to-party-magenta-dark"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-10 text-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => navigateTo('booking')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-party-purple to-party-magenta hover:from-party-purple-dark hover:to-party-magenta-dark"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Your Event Now
              <SparklesIcon className="ml-2 -mr-1 h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;