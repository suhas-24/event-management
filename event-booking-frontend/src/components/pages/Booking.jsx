import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { createBooking } from '../../services/api';
import { HALL_TYPES, TIME_SLOTS } from '../../config/api';
import LoadingSpinner from '../LoadingSpinner';

const validateDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

const validateTime = (time, selectedDate) => {
  if (!time || !selectedDate) return false;
  const selectedDateTime = new Date(`${selectedDate}T${time}`);
  const now = new Date();
  return selectedDateTime > now;
};

const Booking = ({ onSubmit, navigateTo }) => {
  const [selectedHall, setSelectedHall] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, updateFormData] = useFormPersistence('bookingForm');
  
  const { register, handleSubmit, formState: { errors: reactHookFormErrors, isDirty }, watch } = useForm({
    defaultValues: formData
  });

  const guestCount = watch('guestCount');

  // Only show validation errors after the field has been touched
  const allErrors = {
    ...Object.keys(reactHookFormErrors).reduce((acc, key) => {
      if (isDirty) {
        acc[key] = reactHookFormErrors[key];
      }
      return acc;
    }, {}),
    hallId: isDirty && !selectedHall ? 'Please select a hall' : undefined,
    eventDate: isDirty && !validateDate(selectedDate) ? 'Please select a future date' : undefined,
    startTime: isDirty && !validateTime(selectedTime, selectedDate) ? 'Please select a future time' : undefined,
    endTime: isDirty && !validateTime(selectedEndTime, selectedDate) ? 'Please select a future end time' : undefined
  };

  const handleFormSubmit = async (data) => {
    if (!selectedHall || !selectedDate || !selectedTime || !selectedEndTime) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const hall = selectedHall === 'hall1' ? HALL_TYPES.HALL1 : HALL_TYPES.HALL2;
    const totalPrice = hall.basePrice;

    // Format the date with the selected time
    const [hours, minutes] = selectedTime.split(':');
    const eventDateTime = new Date(selectedDate);
    eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const bookingData = {
      hallId: selectedHall,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      guestCount: parseInt(data.guestCount),
      eventDate: eventDateTime.toISOString(),
      startTime: selectedTime,
      endTime: selectedEndTime,
      specialRequests: data.specialRequests || '',
      status: 'pending',
      totalPrice: totalPrice
    };

    try {
      const response = await createBooking(bookingData);
      if (!response || !response.bookingDetail) {
        throw new Error('Invalid response from server');
      }
      updateFormData({}); // Clear form data on success
      onSubmit(response.bookingDetail);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to submit booking. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use the imported TIME_SLOTS instead of redefining it
  const availableTimeSlots = TIME_SLOTS;

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Book Your Event</h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below to reserve your perfect event space
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
            {/* Hall Selection */}
            <div>
              <label htmlFor="hall" className="block text-sm font-medium text-gray-700">
                Select Hall <span className="text-red-500">*</span>
              </label>
              <select
                id="hall"
                value={selectedHall}
                onChange={(e) => {
                  setSelectedHall(e.target.value);
                  setSelectedTime(''); // Reset time when hall changes
                  setSelectedEndTime(''); // Reset end time when hall changes
                }}
                className={`mt-1 block w-full py-2 px-3 border ${
                  allErrors.hallId ? 'border-red-300' : 'border-gray-300'
                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                required
                aria-invalid={!!allErrors.hallId}
                aria-describedby={allErrors.hallId ? "hall-error" : undefined}
              >
                <option value="">Choose a hall</option>
                <option value="hall1">Hall 1 (Small) - Up to 10 people</option>
                <option value="hall2">Hall 2 (Large) - Up to 30 people</option>
              </select>
              {allErrors.hallId && (
                <p id="hall-error" className="mt-1 text-sm text-red-600" role="alert">
                  {allErrors.hallId}
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Event Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(''); // Reset time when date changes
                  setSelectedEndTime(''); // Reset end time when date changes
                }}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className={`mt-1 block w-full py-2 px-3 border ${
                  allErrors.eventDate ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                placeholderText="Select a date"
                required
                aria-invalid={!!allErrors.eventDate}
                aria-describedby={allErrors.eventDate ? "date-error" : undefined}
              />
              {allErrors.eventDate && (
                <p id="date-error" className="mt-1 text-sm text-red-600" role="alert">
                  {allErrors.eventDate}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Start Time <span className="text-red-500">*</span>
              </label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  setSelectedEndTime(''); // Reset end time when start time changes
                }}
                className={`mt-1 block w-full py-2 px-3 border ${
                  allErrors.startTime ? 'border-red-300' : 'border-gray-300'
                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                required
                disabled={!selectedDate}
                aria-invalid={!!allErrors.startTime}
                aria-describedby={allErrors.startTime ? "time-error" : undefined}
              >
                <option value="">Select a time</option>
                {availableTimeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {allErrors.startTime && (
                <p id="time-error" className="mt-1 text-sm text-red-600" role="alert">
                  {allErrors.startTime}
                </p>
              )}
            </div>

            {/* End Time Selection */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time <span className="text-red-500">*</span>
              </label>
              <select
                id="endTime"
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                className={`mt-1 block w-full py-2 px-3 border ${
                  allErrors.endTime ? 'border-red-300' : 'border-gray-300'
                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                required
                disabled={!selectedTime}
                aria-invalid={!!allErrors.endTime}
                aria-describedby={allErrors.endTime ? "endTime-error" : undefined}
              >
                <option value="">Select end time</option>
                {availableTimeSlots
                  .filter(time => time > selectedTime)
                  .map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
              </select>
              {allErrors.endTime && (
                <p id="endTime-error" className="mt-1 text-sm text-red-600" role="alert">
                  {allErrors.endTime}
                </p>
              )}
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="customerName"
                  type="text"
                  {...register('customerName', { required: 'Name is required' })}
                  className={`mt-1 block w-full py-2 px-3 border ${
                    allErrors.customerName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  aria-invalid={!!allErrors.customerName}
                  aria-describedby={allErrors.customerName ? "name-error" : undefined}
                />
                {allErrors.customerName && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                    {allErrors.customerName.message || 'Name is required'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="customerEmail"
                  type="email"
                  {...register('customerEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`mt-1 block w-full py-2 px-3 border ${
                    allErrors.customerEmail ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  aria-invalid={!!allErrors.customerEmail}
                  aria-describedby={allErrors.customerEmail ? "email-error" : undefined}
                />
                {allErrors.customerEmail && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {allErrors.customerEmail.message || 'Email is required'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  {...register('customerPhone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number',
                    },
                  })}
                  className={`mt-1 block w-full py-2 px-3 border ${
                    allErrors.customerPhone ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  aria-invalid={!!allErrors.customerPhone}
                  aria-describedby={allErrors.customerPhone ? "phone-error" : undefined}
                />
                {allErrors.customerPhone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                    {allErrors.customerPhone.message || 'Phone number is required'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                  Number of Guests <span className="text-red-500">*</span>
                </label>
                <input
                  id="guestCount"
                  type="number"
                  {...register('guestCount', {
                    required: 'Number of guests is required',
                    min: {
                      value: 1,
                      message: 'Must have at least 1 guest',
                    },
                    max: {
                      value: selectedHall === 'hall1' ? 10 : 30,
                      message: `Maximum ${selectedHall === 'hall1' ? '10' : '30'} guests allowed`,
                    },
                  })}
                  className={`mt-1 block w-full py-2 px-3 border ${
                    allErrors.guestCount ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  aria-invalid={!!allErrors.guestCount}
                  aria-describedby={allErrors.guestCount ? "guestCount-error" : undefined}
                />
                {allErrors.guestCount && (
                  <p id="guestCount-error" className="mt-1 text-sm text-red-600" role="alert">
                    {allErrors.guestCount.message || 'Number of guests is required'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  {...register('specialRequests')}
                  rows={4}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requirements or requests..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-party-purple to-party-magenta hover:from-party-purple-dark hover:to-party-magenta-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  (isSubmitting || !isDirty) ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Booking;