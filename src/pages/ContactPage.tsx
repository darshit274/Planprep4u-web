import React from 'react';
import { EnvelopeIcon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import ContactQueryForm from '../components/ContactQueryForm';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-primary-100">
            Have a question? We're here to help!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <a href="mailto:admin@planprep4u.com" className="text-primary-600 hover:underline">
                      admin@planprep4u.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-50 rounded-xl p-6 border border-primary-100">
                <div className="flex items-center mb-3">
                  <ClockIcon className="w-6 h-6 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Support Hours</h3>
                </div>
                <p className="text-gray-700 font-medium">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>

              {/* FAQ Link */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Looking for quick answers?
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out our FAQ page for instant answers to common questions.
                </p>
                <a href="/#faqs" className="text-primary-600 hover:underline font-medium inline-flex items-center">
                  Visit FAQs
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Why Contact Us */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Contact Us?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Technical support for tests and materials</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Billing and subscription inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Feedback and suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Partnership opportunities</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-white rounded-xl shadow-xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <ContactQueryForm variant="full" />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Prefer Direct Email?
          </h3>
          <p className="text-gray-300 mb-6">
            You can also reach us directly at our email address
          </p>
          <a
            href="mailto:admin@planprep4u.com"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            admin@planprep4u.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
