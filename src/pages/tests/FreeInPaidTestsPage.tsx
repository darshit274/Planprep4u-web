import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  SparklesIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const FreeInPaidTestsPage: React.FC = () => {
  const navigate = useNavigate();

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/tests');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Free Samples Are Now Inline!
        </h1>

        {/* Description */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-700 mb-3">
                We've improved the way you discover free sample tests! Instead of a separate page,
                you'll now find free samples directly within each test series hierarchy.
              </p>
              <p className="text-gray-700 font-medium">
                Look for the{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-green-700 bg-green-100 border border-green-200 mx-1">
                  FREE
                </span>
                {' '}badge when browsing test series!
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Why this change?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Discover free tests in their natural context</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Easier to find specific tests within the hierarchy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Clearer understanding of what's included in each series</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>More intuitive navigation experience</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <Link
          to="/tests"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <span>Browse Test Series</span>
          <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Auto redirect notice */}
        <p className="text-center text-sm text-gray-500 mt-4">
          You'll be automatically redirected in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default FreeInPaidTestsPage;
