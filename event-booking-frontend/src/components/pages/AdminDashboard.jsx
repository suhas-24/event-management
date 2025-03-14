import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllBookings, updateBookingStatus } from '../../services/api';
import { BOOKING_STATUS } from '../../config/api';
import LoadingSpinner from '../LoadingSpinner';
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = ({ onLogout, navigateTo }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [notification, setNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin token not found');
      }
      const data = await fetchAllBookings(adminToken);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setIsRefreshing(true);
      const adminToken = localStorage.getItem('adminToken');
      await updateBookingStatus(bookingId, newStatus, adminToken);
      await loadBookings(); // Refresh the list
      
      // Show notification
      setNotification({
        message: `Booking ${newStatus.toLowerCase()} successfully`,
        type: newStatus === BOOKING_STATUS.CONFIRMED ? 'success' : 'warning'
      });
      
      // Auto-dismiss notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadBookings();
    setIsRefreshing(false);
  };

  const filterBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.eventDate);
      switch (selectedTab) {
        case 'upcoming':
          return bookingDate >= today && booking.status !== BOOKING_STATUS.CANCELLED;
        case 'past':
          return bookingDate < today;
        case 'cancelled':
          return booking.status === BOOKING_STATUS.CANCELLED;
        default:
          return true;
      }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case BOOKING_STATUS.CANCELLED:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case BOOKING_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage all event bookings in one place
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <motion.button
              onClick={refreshData}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isRefreshing}
            >
              <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            <motion.button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              className={`mt-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <BellAlertIcon className={`h-5 w-5 ${notification.type === 'success' ? 'text-green-400' : 'text-yellow-400'}`} />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-yellow-800'}`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-4">
          <div className="sm:hidden">
            <select
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            >
              <option value="upcoming">Upcoming Bookings</option>
              <option value="past">Past Bookings</option>
              <option value="cancelled">Cancelled Bookings</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {['upcoming', 'past', 'cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`
                      ${selectedTab === tab
                        ? 'border-party-purple text-party-purple'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                    `}
                  >
                    {tab} Bookings
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                {filterBookings().length === 0 ? (
                  <div className="text-center py-12 bg-white shadow overflow-hidden rounded-lg">
                    <p className="text-gray-500">No bookings found in this category</p>
                  </div>
                ) : (
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event Details
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filterBookings().map((booking) => (
                          <motion.tr 
                            key={booking.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                              <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                              <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                                {new Date(booking.eventDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <ClockIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                                {booking.startTime} - {booking.endTime}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                                {booking.hallId === 'hall1' ? 'Hall 1 (Small)' : 'Hall 2 (Large)'}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <UserGroupIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                                {booking.guestCount} guests
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                                ${booking.totalPrice}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(booking.status)}
                                <span className={`ml-1.5 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.status === BOOKING_STATUS.PENDING && (
                                <div className="space-x-2">
                                  <motion.button
                                    onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.CONFIRMED)}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <CheckCircleIcon className="mr-1 h-4 w-4" />
                                    Confirm
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.CANCELLED)}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <XCircleIcon className="mr-1 h-4 w-4" />
                                    Cancel
                                  </motion.button>
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard; 