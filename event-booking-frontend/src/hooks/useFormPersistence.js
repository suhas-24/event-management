import { useEffect, useState } from 'react';

export const useFormPersistence = (formKey, initialData = {}) => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(formKey);
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(formKey, JSON.stringify(formData));
  }, [formData, formKey]);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const clearFormData = () => {
    localStorage.removeItem(formKey);
    setFormData(initialData);
  };

  return [formData, updateFormData, clearFormData];
}; 