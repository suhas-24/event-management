import { API_ENDPOINTS, API_HEADERS } from '../config/api';

export const fetchHalls = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.HALLS);
    if (!response.ok) {
      throw new Error('Failed to fetch halls');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching halls:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to create booking' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('No data received from server');
    }
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const checkAvailability = async (hallId, date, time) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.AVAILABILITY}?hallId=${hallId}&date=${date}&time=${time}`);
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

// Admin API calls
export const fetchAllBookings = async (adminToken) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ADMIN}/bookings`, {
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status, adminToken) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ADMIN}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update booking status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const createHall = async (hallData, adminToken) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ADMIN}/halls`, {
      method: 'POST',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(hallData),
    });

    if (!response.ok) {
      throw new Error('Failed to create hall');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating hall:', error);
    throw error;
  }
};

export const updateHall = async (hallId, hallData, adminToken) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ADMIN}/halls/${hallId}`, {
      method: 'PUT',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(hallData),
    });

    if (!response.ok) {
      throw new Error('Failed to update hall');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating hall:', error);
    throw error;
  }
}; 