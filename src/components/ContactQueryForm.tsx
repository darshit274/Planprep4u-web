import React, { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import api from '../services/api';

const contactQuerySchema = z.object({
  full_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces'),
  email: z.string()
    .email('Please enter a valid email address'),
  mobile_number: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(20, 'Mobile number is too long')
    .regex(/^[0-9+\-() ]+$/, 'Please enter a valid mobile number')
    .refine((val) => {
      const digits = val.replace(/[^0-9]/g, '');
      return digits.length === 10 || (digits.length === 12 && val.startsWith('+91'));
    }, 'Please enter a valid 10-digit Indian mobile number'),
  query_message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')
});

type ContactQueryFormData = z.infer<typeof contactQuerySchema>;

interface ContactQueryFormProps {
  variant?: 'full' | 'compact';
  onSuccess?: () => void;
}

const ContactQueryForm: React.FC<ContactQueryFormProps> = ({ variant = 'full', onSuccess }) => {
  const [formData, setFormData] = useState<ContactQueryFormData>({
    full_name: '',
    email: '',
    mobile_number: '',
    query_message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactQueryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof ContactQueryFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');

    // Validate
    try {
      contactQuerySchema.parse(formData);
      console.log('Validation passed');
    } catch (error) {
      console.log('Validation failed:', error);
      if (error instanceof z.ZodError && error.errors) {
        const newErrors: Partial<Record<keyof ContactQueryFormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ContactQueryFormData] = err.message;
          }
        });
        setErrors(newErrors);
        console.log('Validation errors:', newErrors);
      }
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      const response = await api.post('/contact/submit', formData);
      setSuccessMessage(response.data.message || 'Your query has been submitted successfully!');
      setFormData({ full_name: '', email: '', mobile_number: '', query_message: '' });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const newErrors: Partial<Record<keyof ContactQueryFormData, string>> = {};
        error.response.data.errors.forEach((err: any) => {
          newErrors[err.field as keyof ContactQueryFormData] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrorMessage('Failed to submit query. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className={`w-full ${isCompact ? 'max-w-lg' : 'max-w-2xl'} mx-auto`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="mobile_number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                errors.mobile_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="9876543210 or +91 9876543210"
            />
            {errors.mobile_number && (
              <p className="mt-1 text-sm text-red-600">{errors.mobile_number}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Query Message */}
        <div>
          <label htmlFor="query_message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Query <span className="text-red-500">*</span>
          </label>
          <textarea
            id="query_message"
            name="query_message"
            rows={isCompact ? 4 : 6}
            value={formData.query_message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
              errors.query_message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please describe your query in detail..."
          />
          {errors.query_message && (
            <p className="mt-1 text-sm text-red-600">{errors.query_message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.query_message.length}/5000 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isSubmitting ? 'animate-pulse' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Query'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactQueryForm;
