import { useMemo } from 'react';

export const useFormValidation = (formData) => {
  const errors = useMemo(() => {
    const validationErrors = {};

    // Name validation
    if (!formData.name?.trim()) {
      validationErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email?.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      validationErrors.email = 'Invalid email address';
    }

    // Phone validation
    if (!formData.phone?.trim()) {
      validationErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      validationErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Guest count validation
    if (!formData.guestCount) {
      validationErrors.guestCount = 'Number of guests is required';
    } else if (formData.guestCount < 1) {
      validationErrors.guestCount = 'Must have at least 1 guest';
    } else if (formData.hall === 'hall1' && formData.guestCount > 10) {
      validationErrors.guestCount = 'Maximum 10 guests allowed for Hall 1';
    } else if (formData.hall === 'hall2' && formData.guestCount > 30) {
      validationErrors.guestCount = 'Maximum 30 guests allowed for Hall 2';
    }

    // Date validation
    if (!formData.eventDate) {
      validationErrors.eventDate = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        validationErrors.eventDate = 'Please select a future date';
      }
    }

    // Time validation
    if (!formData.startTime) {
      validationErrors.startTime = 'Start time is required';
    } else if (formData.eventDate) {
      const selectedDateTime = new Date(`${formData.eventDate}T${formData.startTime}`);
      const now = new Date();
      if (selectedDateTime <= now) {
        validationErrors.startTime = 'Please select a future time';
      }
    }

    // Terms validation
    if (!formData.terms) {
      validationErrors.terms = 'You must accept the terms and conditions';
    }

    return validationErrors;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid
  };
}; 