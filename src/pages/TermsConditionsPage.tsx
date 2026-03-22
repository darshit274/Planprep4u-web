import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ScaleIcon,
  UserGroupIcon,
  ClockIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const TermsConditionsPage: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
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
              <DocumentTextIcon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
              <p className="text-white/90 text-lg">Please read these terms carefully before using our services</p>
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
              Welcome to <strong className="text-primary-600">PlanPrep4u</strong>. These Terms and Conditions ("Terms") govern your access to and use of our online educational platform for Gujarat competitive Exam preparation. By registering, accessing, or using our services, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>IMPORTANT:</strong> If you do not agree to these Terms, please do not use our platform. Your continued use constitutes acceptance of any modifications to these Terms.
            </p>
          </div>
        </div>

        {/* Key Points Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircleIcon className="h-8 w-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">You Agree To:</h3>
                <ul className="text-white/90 text-sm space-y-1">
                  <li>• Use services lawfully</li>
                  <li>• Protect your account credentials</li>
                  <li>• Respect intellectual property</li>
                  <li>• Follow exam conduct rules</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-3 mb-3">
              <XCircleIcon className="h-8 w-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">You Must NOT:</h3>
                <ul className="text-white/90 text-sm space-y-1">
                  <li>• Share or resell course content</li>
                  <li>• Cheat or manipulate tests</li>
                  <li>• Create multiple accounts</li>
                  <li>• Violate copyright laws</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <UserGroupIcon className="h-7 w-7" />
                1. Account Registration & User Responsibilities
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Eligibility</h3>
                  <p className="mb-2">You must be at least 13 years old to use PlanPrep4u. By creating an account, you represent that:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>You are legally capable of entering into binding contracts</li>
                    <li>All registration information you provide is accurate and current</li>
                    <li>You will maintain the accuracy of such information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Security</h3>
                  <p className="mb-2">You are responsible for:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Maintaining the confidentiality of your password and account</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Ensuring your account is not used by multiple persons</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="text-yellow-900 font-medium">
                    <strong>Warning:</strong> Creating multiple accounts to manipulate leaderboards or access free trials is strictly prohibited and may result in permanent ban.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ShieldCheckIcon className="h-7 w-7" />
                2. Use of Services
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitted Use</h3>
                  <p>PlanPrep4u grants you a limited, non-exclusive, non-transferable license to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Access and use our platform for personal educational purposes</li>
                    <li>Take mock tests and practice quizzes</li>
                    <li>View study materials and solutions</li>
                    <li>Track your performance and progress</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
                  <p className="mb-2">You agree NOT to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Copy, reproduce, or distribute</strong> our content without written permission</li>
                    <li><strong>Upload to AI tools,</strong> file-sharing sites, or other platforms</li>
                    <li><strong>Reverse engineer,</strong> decompile, or modify our platform</li>
                    <li><strong>Use automated tools</strong> (bots, scrapers) to access content</li>
                    <li><strong>Cheat or manipulate</strong> test scores or rankings</li>
                    <li><strong>Resell or commercialize</strong> any part of our services</li>
                    <li><strong>Interfere with</strong> the proper functioning of the platform</li>
                    <li><strong>Violate any laws</strong> or regulations</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-900 font-medium">
                    <strong>Violation Notice:</strong> Any prohibited activity may result in immediate account suspension or termination without refund.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <DocumentTextIcon className="h-7 w-7" />
                3. Intellectual Property Rights
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Content</h3>
                  <p className="mb-3">
                    All content on PlanPrep4u, including but not limited to questions, solutions, study materials, PDFs, videos, images, text, graphics, logos, and software, is owned by or licensed to PlanPrep4u and protected by:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Copyright laws of India and international treaties</li>
                    <li>Trademark laws</li>
                    <li>Other intellectual property rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Restrictions</h3>
                  <p className="mb-2">You may NOT:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Claim ownership of our content</li>
                    <li>Modify, adapt, or create derivative works</li>
                    <li>Share screenshots or recordings of paid content publicly</li>
                    <li>Remove copyright notices or watermarks</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Educational Use Only</h3>
                  <p>
                    All materials provided are for <strong>educational and informational purposes only</strong>. They are not intended to replace professional advice or guarantee exam success.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ScaleIcon className="h-7 w-7" />
                4. Payment & Subscriptions
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Subscription Plans</h3>
                  <p className="mb-2">PlanPrep4u offers:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Free Content:</strong> Limited access to select quizzes and materials</li>
                    <li><strong>Paid Subscriptions:</strong> Full access to premium test series and content</li>
                    <li><strong>One-Time Purchases:</strong> Access to specific test series or study packs</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Pricing & Billing</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All prices are listed in Indian Rupees (INR) inclusive of applicable taxes</li>
                    <li>Subscription fees are billed in advance on a monthly/yearly basis</li>
                    <li>We reserve the right to change pricing with 30 days notice</li>
                    <li>Payment is processed through secure third-party payment gateways</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Auto-Renewal</h3>
                  <p>
                    Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. You can manage subscriptions in your account settings.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-blue-900 font-medium">
                    <strong>Note:</strong> Refunds and cancellations are governed by our separate <a href="/refund-policy" className="underline hover:text-blue-700">Cancellation & Refund Policy</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
              <h2 className="text-2xl font-bold text-white">5. Test Conduct & Academic Integrity</h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Fair Use Policy</h3>
                  <p className="mb-2">When taking tests, you must:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Attempt tests individually without external assistance</li>
                    <li>Not use unauthorized aids, references, or communication during timed tests</li>
                    <li>Not share test questions or answers with others</li>
                    <li>Accept that only <strong>first attempt scores</strong> count for leaderboard rankings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Cheating & Misconduct</h3>
                  <p className="mb-2">We have zero tolerance for:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Using multiple accounts to retake tests</li>
                    <li>Collaborating with others during individual tests</li>
                    <li>Using scripts or automated tools to manipulate scores</li>
                    <li>Any form of academic dishonesty</li>
                  </ul>
                  <p className="mt-3 font-medium text-red-600">
                    Violators will face immediate account suspension and potential legal action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6">
              <h2 className="text-2xl font-bold text-white">6. Disclaimers & Limitations</h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Guarantee of Results</h3>
                  <p>
                    PlanPrep4u provides educational content and practice materials. We do <strong>NOT guarantee</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Passing of any government examination</li>
                    <li>Specific scores or rankings</li>
                    <li>Job placement or employment</li>
                    <li>That our content matches actual exam questions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Errors & Accuracy</h3>
                  <p>
                    While we strive for accuracy, we cannot guarantee that all content is error-free or up-to-date. Exam patterns and syllabi may change. Users should verify information from official sources.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Availability</h3>
                  <p>
                    We aim to provide 24/7 access but do not guarantee uninterrupted service. Platform may be unavailable due to maintenance, updates, or technical issues.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm italic">
                    <strong>AS-IS BASIS:</strong> Services are provided "as is" and "as available" without warranties of any kind, express or implied.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
              <h2 className="text-2xl font-bold text-white">7. Limitation of Liability</h2>
            </div>
            <div className="p-8">
              <div className="text-gray-700">
                <p className="mb-3">
                  To the maximum extent permitted by law, PlanPrep4u and its affiliates shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Any indirect, incidental, special, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Damages resulting from use or inability to use our services</li>
                  <li>Errors in content or unauthorized access to your account</li>
                </ul>
                <p className="mt-4 font-medium">
                  Our total liability shall not exceed the amount you paid to us in the past 12 months.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
              <h2 className="text-2xl font-bold text-white">8. Termination</h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h3>
                  <p>You may terminate your account at any time by contacting support or using account settings.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Rights</h3>
                  <p className="mb-2">We may suspend or terminate your account if:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>You violate these Terms</li>
                    <li>You engage in prohibited activities</li>
                    <li>Your payment method fails</li>
                    <li>We cease operations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Effect of Termination</h3>
                  <p>Upon termination, you lose access to all content and your data may be deleted after 30 days.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 9 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6">
              <h2 className="text-2xl font-bold text-white">9. Governing Law & Disputes</h2>
            </div>
            <div className="p-8">
              <div className="text-gray-700 space-y-3">
                <p>
                  These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Gujarat, India.
                </p>
                <p>
                  <strong>Dispute Resolution:</strong> We encourage resolving disputes amicably through email communication before pursuing legal action.
                </p>
              </div>
            </div>
          </div>

          {/* Section 10 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
              <h2 className="text-2xl font-bold text-white">10. Changes to Terms</h2>
            </div>
            <div className="p-8">
              <div className="text-gray-700 space-y-3">
                <p>
                  We may update these Terms from time to time. We will notify you of material changes via:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email to your registered address</li>
                  <li>Prominent notice on our platform</li>
                  <li>Updated "Last Modified" date at the top</li>
                </ul>
                <p className="mt-3">
                  Continued use after changes constitutes acceptance of the modified Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Section 11 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6">
              <h2 className="text-2xl font-bold text-white">11. Disclaimer</h2>
            </div>
            <div className="p-8">
              <div className="text-gray-700 space-y-3">
                <p>
                  PlanPrep4u does <strong>not represent, affiliate with, or claim any association with any government entity or examination authority</strong>.
                </p>
                <p className="mt-3">
                  This platform is an independent educational service created solely for practice and self-assessment purposes.
                  All exam-related information is collected from publicly available official websites for reference only.                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-white text-center">
            <EnvelopeIcon className="h-16 w-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Questions About Terms?</h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              If you have any questions or concerns regarding these Terms & Conditions, please contact us.
            </p>
            <a
              href="mailto:admin@planprep4u.com"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <EnvelopeIcon className="h-6 w-6" />
              admin@planprep4u.com
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 PlanPrep4u. All rights reserved.</p>
          <p className="mt-2">By using our platform, you acknowledge that you have read and agree to these Terms.</p>
        </div>

      </div>
    </div>
  );
};

export default TermsConditionsPage;
