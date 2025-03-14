import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAllBookings, updateBookingStatus } from '../../services/api';
import { BOOKING_STATUS } from '../../config/api';
import LoadingSpinner from '../LoadingSpinner';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('upcoming');

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
      const adminToken = localStorage.getItem('adminToken');
      await updateBookingStatus(bookingId, newStatus, adminToken);
      await loadBookings(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
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

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
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
          </div>
        </div>

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
                        ? 'border-primary-500 text-primary-600'
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
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                            <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                            <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(booking.eventDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.startTime} - {booking.endTime}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.hallId === 'hall1' ? 'Hall 1 (Small)' : 'Hall 2 (Large)'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.guestCount} guests
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${booking.status === BOOKING_STATUS.CONFIRMED ? 'bg-green-100 text-green-800' : 
                                booking.status === BOOKING_STATUS.CANCELLED ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.status === BOOKING_STATUS.PENDING && (
                              <div className="space-x-2">
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.CONFIRMED)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.CANCELLED)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard; 