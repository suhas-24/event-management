import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, HomeIcon } from '@heroicons/react/24/outline';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!bookingDetails) {
    return null;
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            </motion.div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Booking Confirmed!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for choosing our venue. Your booking has been confirmed.
            </p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Event Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(bookingDetails.eventDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{bookingDetails.startTime}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Hall</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {bookingDetails.hall === 'hall1' ? 'Hall 1 (Small)' : 'Hall 2 (Large)'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Number of Guests</dt>
                <dd className="mt-1 text-sm text-gray-900">{bookingDetails.guestCount}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{bookingDetails.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{bookingDetails.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{bookingDetails.phone}</dd>
              </div>
              {bookingDetails.specialRequests && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Special Requests</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bookingDetails.specialRequests}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-party-purple to-party-magenta text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Return to Home
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation; 