import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  BookOpenIcon,
  ClockIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const SourcesDisclaimer: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <ShieldCheckIcon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Sources & Disclaimer</h1>
              <p className="text-white/90 text-lg">
                Transparency about information sources and app purpose
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/80 text-sm">
            <ClockIcon className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to <strong className="text-primary-600">PlanPrep4u</strong>.
              Transparency and trust are important to us. This page explains the
              information sources used in the app and clearly outlines our
              disclaimer regarding government-related examinations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              PlanPrep4u is an independent educational platform created
              solely for exam preparation and self-practice. Please review the
              sections below to understand our sources and limitations.
            </p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Section 1: Disclaimer */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ExclamationTriangleIcon className="h-7 w-7" />
                Important Disclaimer
              </h2>
            </div>
            <div className="p-8 space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>
                  PlanPrep4u does NOT represent, affiliate with, authorize,
                  or claim any association with any government entity,
                  department, or examination authority.
                </strong>
              </p>
              <p>
                This platform is an <strong>independent educational and
                self-practice app</strong> designed to help students prepare for
                competitive examinations using mock tests and practice questions.
              </p>
              <p>
                The app <strong>does NOT provide</strong> official exam
                notifications, application submission services, recruitment
                processing, result publication, or any government services.
              </p>
            </div>
          </div>

          {/* Section 2: Government Sources */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <GlobeAltIcon className="h-7 w-7" />
                Official Government Information Sources
              </h2>
            </div>
            <div className="p-8 text-gray-700">
              <p className="mb-6 font-medium text-gray-900">
                Exam-related information such as syllabus structure, exam
                patterns, and recruitment details is referred from publicly
                available official government websites:
              </p>

              <ul className="space-y-4">
                <li>
                  <p className="font-semibold text-gray-900">
                    Gujarat Public Service Commission (GPSC)
                  </p>
                  <a
                    href="https://gpsc.gujarat.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline break-all"
                  >
                    https://gpsc.gujarat.gov.in
                  </a>
                </li>

                <li>
                  <p className="font-semibold text-gray-900">
                    Gujarat Subordinate Service Selection Board (GSSSB)
                  </p>
                  <a
                    href="https://gsssb.gujarat.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline break-all"
                  >
                    https://gsssb.gujarat.gov.in
                  </a>
                </li>

                <li>
                  <p className="font-semibold text-gray-900">
                    Gujarat Police Recruitment Board (GPRB)
                  </p>
                  <a
                    href="https://gprb.gujarat.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline break-all"
                  >
                    https://gprb.gujarat.gov.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Study Material */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <BookOpenIcon className="h-7 w-7" />
                Study Material References
              </h2>
            </div>
            <div className="p-8 text-gray-700">
              <p className="mb-4 font-medium text-gray-900">
                Educational Content Sources
              </p>
              <p className="mb-4">
                Practice questions and explanations are prepared using commonly
                available educational resources, including:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>NCERT Textbooks</li>
                <li>GCERT Textbooks</li>
                <li>A Brief History of Modern India – Spectrum</li>
                <li>Ancient India – R.S. Sharma</li>
                <li>Medieval India – Satish Chandra</li>
                <li>Indian Art & Culture – Nitin Singhania</li>
                <li>Indian Polity – M. Laxmikant</li>
                <li>Indian Economy – Ramesh Singh</li>
                <li>Indian Economy – Vivek Singh</li>
                <li>Bharatiya Arthatantra – Yuva Upanishad</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 PlanPrep4u. All rights reserved.</p>
          <p className="mt-2">
            This page is provided to ensure transparency and compliance with
            Google Play policies.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SourcesDisclaimer;
