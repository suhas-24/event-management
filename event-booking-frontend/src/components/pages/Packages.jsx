import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SparklesIcon } from '@heroicons/react/24/outline';
import '../../../src/styles/party-theme.css';

const Packages = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const packages = [
    {
      id: 1,
      name: 'Hall 1 (Small)',
      capacity: '10 people',
      price: '₹2000/hour',
      description: 'Perfect for intimate gatherings and small celebrations.',
      features: [
        'Cozy atmosphere for intimate gatherings',
        'Modern audio system with Bluetooth connectivity',
        'Comfortable seating arrangements',
        'Basic decorations included',
        'Air conditioning',
        'Clean restroom facilities',
        'Small pantry area',
        'Free Wi-Fi'
      ],
      inclusions: [
        'Basic lighting setup',
        'Sound system usage',
        'Basic decoration package',
        'Cleaning before and after event',
        'Dedicated staff member'
      ],
      bestFor: [
        'Birthday parties',
        'Small family gatherings',
        'Team meetings',
        'Workshop sessions'
      ]
    },
    {
      id: 2,
      name: 'Hall 2 (Large)',
      capacity: '30 people',
      price: '₹5000/hour',
      description: 'Spacious venue perfect for larger events and celebrations.',
      features: [
        'Large space with flexible layout options',
        'Premium sound system with mixer',
        'HD Projector with 120-inch screen',
        'Professional lighting setup',
        'Stage area for performances',
        'Multiple restroom facilities',
        'Full-service kitchen access',
        'Free parking'
      ],
      inclusions: [
        'Professional lighting system',
        'Premium sound system with technician',
        'Custom decoration options',
        'Cleaning service',
        'Two dedicated staff members',
        'Basic catering setup support'
      ],
      bestFor: [
        'Corporate events',
        'Wedding ceremonies',
        'Large family gatherings',
        'Product launches'
      ]
    }
  ];

  return (
    <motion.div 
      className="container mx-auto px-4 py-16 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      ref={ref}
    >
      <motion.div
        className="flex items-center justify-center gap-2 mb-12"
        variants={itemVariants}
      >
        <SparklesIcon className="w-8 h-8 text-indigo-600 animate-pulse" />
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
          Our Event Packages
        </h1>
        <SparklesIcon className="w-8 h-8 text-pink-600 animate-pulse" />
      </motion.div>

      <motion.p 
        className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto leading-relaxed"
        variants={itemVariants}
      >
        Choose from our carefully curated packages designed to make your event memorable and hassle-free.
      </motion.p>

      <div className="mt-12 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
        {packages.map((pkg) => (
          <motion.div 
            key={pkg.id} 
            className="relative bg-white p-8 rounded-2xl shadow-lg border border-transparent hover:border-indigo-100"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">{pkg.name}</h2>
              <p className="mt-4 text-lg text-gray-500">{pkg.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900">{pkg.price}</span>
              </div>
              <p className="mt-2 text-lg text-gray-500">Up to {pkg.capacity}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">Features:</h3>
              <ul className="mt-4 space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-500 mr-2 animate-bounce">✨</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">Package Includes:</h3>
              <ul className="mt-4 space-y-2">
                {pkg.inclusions.map((inclusion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-500 mr-2 animate-bounce">✨</span>
                    <span className="text-gray-600">{inclusion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">Best For:</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {pkg.bestFor.map((event, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-300 shadow-lg hover:shadow-xl md:py-4 md:text-lg md:px-10"
                >
                  Book Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Can we bring our own food?</h3>
            <p className="mt-2 text-gray-600">Yes, you are welcome to bring your own food and beverages. We also provide basic catering setup support.</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">What is the cancellation policy?</h3>
            <p className="mt-2 text-gray-600">Cancellations made 48 hours before the event will receive a full refund. Late cancellations may be subject to charges.</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Is decoration included in the package?</h3>
            <p className="mt-2 text-gray-600">Basic decoration is included in all packages. Custom decoration can be arranged at additional cost.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Packages;