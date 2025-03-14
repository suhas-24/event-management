const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  HALLS: `${API_BASE_URL}/halls`,
  BOOKINGS: `${API_BASE_URL}/bookings`,
  AVAILABILITY: `${API_BASE_URL}/availability`,
  ADMIN: `${API_BASE_URL}/admin`,
};

export const API_TIMEOUT = 10000; // 10 seconds

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const HALL_TYPES = {
  HALL1: {
    id: 'hall1',
    name: 'Hall 1 (Small)',
    capacity: 10,
    basePrice: 1000,
    features: [
      'Cozy atmosphere',
      'Modern audio system',
      'Comfortable seating',
      'Basic decorations included',
    ],
  },
  HALL2: {
    id: 'hall2',
    name: 'Hall 2 (Large)',
    capacity: 30,
    basePrice: 2000,
    features: [
      'Spacious layout',
      'Premium sound system',
      'Projector setup',
      'Custom decoration options',
    ],
  },
};

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
}; 