import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  ServerIcon,
  UserGroupIcon,
  ClockIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const PrivacySecurityPage: React.FC = () => {
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
              <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-white/90 text-lg">Your privacy is important to us</p>
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

        {/* Introduction Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to <strong className="text-primary-600">PlanPrep4u</strong>. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform for Gujarat competitive exam preparation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using PlanPrep4u, you agree to this Privacy Policy. If you do not agree with the terms, please discontinue use of our services.
            </p>
          </div>
        </div>

        {/* Key Points Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <LockClosedIcon className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-lg mb-2">Secure Storage</h3>
            <p className="text-white/90 text-sm">Your data is encrypted and stored securely on our servers</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <EyeIcon className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-lg mb-2">No Sharing</h3>
            <p className="text-white/90 text-sm">We never sell or share your personal information with third parties</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <UserGroupIcon className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-lg mb-2">Your Control</h3>
            <p className="text-white/90 text-sm">You have full control over your data and can request deletion anytime</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ServerIcon className="h-7 w-7" />
                Information We Collect
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <p className="text-gray-700 mb-2">When you register for an account, we collect:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Name and email address</li>
                    <li>Username and password (encrypted)</li>
                    <li>Profile picture (optional)</li>
                    <li>Phone number (optional)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
                  <p className="text-gray-700 mb-2">We automatically collect information about your activity:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Test scores, rankings, and performance analytics</li>
                    <li>Questions attempted and time spent</li>
                    <li>Test history and progress tracking</li>
                    <li>Device information (browser type, operating system)</li>
                    <li>IP address and location data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies and Tracking</h3>
                  <p className="text-gray-700">
                    We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze site usage. You can control cookie settings through your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <LockClosedIcon className="h-7 w-7" />
                How We Use Your Information
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p className="font-medium text-gray-900 mb-3">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Provide Services:</strong> Create and manage your account, deliver test content, track progress</li>
                  <li><strong>Improve Platform:</strong> Analyze usage patterns to enhance user experience and add new features</li>
                  <li><strong>Communication:</strong> Send important updates, test reminders, and support responses</li>
                  <li><strong>Personalization:</strong> Customize content based on your performance and preferences</li>
                  <li><strong>Security:</strong> Protect against fraud, abuse, and unauthorized access</li>
                  <li><strong>Legal Compliance:</strong> Meet legal obligations and enforce our terms of service</li>
                </ul>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                  <p className="text-blue-900 font-medium">
                    <strong>Note:</strong> We will never use your information for purposes not disclosed in this policy without your explicit consent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ShieldCheckIcon className="h-7 w-7" />
                Information Sharing & Disclosure
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">We DO NOT sell your data</h3>
                  <p className="text-gray-700 mb-4">
                    PlanPrep4u does not sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Limited Sharing</h3>
                  <p className="text-gray-700 mb-2">We may share your information only in these specific cases:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Service Providers:</strong> Trusted third-party services that help us operate (hosting, payment processing, analytics) - under strict confidentiality agreements</li>
                    <li><strong>Leaderboards:</strong> Your username and scores may be visible to other users on public leaderboards</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulations</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets (users will be notified)</li>
                    <li><strong>With Your Consent:</strong> Any other sharing will only occur with your explicit permission</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <UserGroupIcon className="h-7 w-7" />
                Your Rights & Choices
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p className="font-medium text-gray-900 mb-3">You have the right to:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Access Your Data</h4>
                    <p className="text-sm">Request a copy of all personal information we hold about you</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Correct Information</h4>
                    <p className="text-sm">Update or correct inaccurate personal information</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Delete Account</h4>
                    <p className="text-sm">Request permanent deletion of your account and data</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Opt-Out</h4>
                    <p className="text-sm">Unsubscribe from promotional emails anytime</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Data Portability</h4>
                    <p className="text-sm">Export your data in a commonly used format</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">✓ Restrict Processing</h4>
                    <p className="text-sm">Limit how we use your personal information</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 italic">
                  To exercise any of these rights, please contact us at the email provided below.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6">
              <h2 className="text-2xl font-bold text-white">Data Security & Retention</h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Security Measures</h3>
                  <p className="mb-2">We implement industry-standard security measures to protect your data:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted password storage using secure hashing</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Secure servers with firewall protection</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Retention</h3>
                  <p>
                    We retain your personal information only as long as necessary to provide services and comply with legal obligations.
                    When you delete your account, we will remove your personal data within 30 days, except where retention is required by law.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
              <h2 className="text-2xl font-bold text-white">Children's Privacy</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed">
                PlanPrep4u is intended for users preparing for government exams. While we do not specifically target children under 13,
                if we learn that we have collected personal information from a child under 13 without parental consent, we will take steps to
                delete that information promptly. Parents or guardians who believe their child has provided us with information should contact us immediately.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
              <h2 className="text-2xl font-bold text-white">Changes to Privacy Policy</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
                We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>Posting the updated policy on this page with a new "Last Updated" date</li>
                <li>Sending an email notification to your registered email address</li>
                <li>Displaying a prominent notice on our platform</li>
              </ul>
              <p className="text-gray-700">
                Your continued use of PlanPrep4u after changes become effective constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6">
              <h2 className="text-2xl font-bold text-white">Disclaimer</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                PlanPrep4u does <strong>not represent, affiliate with, or claim any association with any government entity or examination authority</strong>.
              </p>
              <p className="text-gray-700">
                This platform is an independent educational service created solely for practice and self-assessment purposes.
                All exam-related information is collected from publicly available official websites for reference only.</p>
            </div>
          </div>

        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-white text-center">
            <EnvelopeIcon className="h-16 w-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
              please don't hesitate to contact us.
            </p>
            <a
              href="mailto:admin@planprep4u.com"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <EnvelopeIcon className="h-6 w-6" />
              admin@planprep4u.com
            </a>
            <p className="text-white/70 text-sm mt-6">
              We typically respond within 24-48 hours
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 PlanPrep4u. All rights reserved.</p>
          <p className="mt-2">Your trust is important to us. We are committed to protecting your privacy.</p>
        </div>

      </div>
    </div>
  );
};

export default PrivacySecurityPage;
