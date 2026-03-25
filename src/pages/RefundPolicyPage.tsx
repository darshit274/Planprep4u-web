import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyRupeeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const RefundPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
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
              <CurrencyRupeeIcon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Cancellation & Refund Policy</h1>
              <p className="text-white/90 text-lg">Clear guidelines for cancellations and refunds</p>
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
              At <strong className="text-green-600">PlanPrep4u</strong>, all subscription purchases are final. This Cancellation & Refund Policy explains the terms and conditions for cancelling subscriptions and the limited circumstances under which refunds may be granted.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="text-red-900 font-semibold">
                <strong>Important:</strong> We do NOT offer money-back guarantees or refunds for change of mind. Refunds are ONLY provided in cases of system errors, billing mistakes, or technical failures caused by PlanPrep4u.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Please read this policy carefully before making any purchase. By purchasing our services, you agree to the terms outlined below.
            </p>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
            <XCircleIcon className="h-12 w-12 mb-3 opacity-90" />
            <h3 className="font-bold text-lg mb-2">No Money-Back Guarantee</h3>
            <p className="text-white/90 text-sm">All subscriptions are final and non-refundable</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-2xl p-6 shadow-lg">
            <ExclamationTriangleIcon className="h-12 w-12 mb-3 opacity-90" />
            <h3 className="font-bold text-lg mb-2">System Errors Only</h3>
            <p className="text-white/90 text-sm">Refunds only for billing/technical errors by us</p>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-primary-500 text-white rounded-2xl p-6 shadow-lg">
            <ArrowPathIcon className="h-12 w-12 mb-3 opacity-90" />
            <h3 className="font-bold text-lg mb-2">5-7 Business Days</h3>
            <p className="text-white/90 text-sm">Processing time if refund is approved</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <CurrencyRupeeIcon className="h-7 w-7" />
                1. When Refunds Are Granted
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <h3 className="text-xl font-semibold text-red-900 mb-2">No General Refunds</h3>
                  <p className="text-red-800">
                    <strong>Important:</strong> PlanPrep4u does NOT provide refunds for change of mind, dissatisfaction with content, or personal reasons. All subscription purchases are final.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Refunds Only for System Errors</h3>
                  <p className="text-gray-700 mb-3">
                    Refunds will ONLY be issued in the following situations where <strong>PlanPrep4u is at fault:</strong>
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700"><strong>Duplicate Payments:</strong> You were charged twice for the same subscription</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700"><strong>Billing Errors:</strong> You were charged an incorrect amount</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700"><strong>System Failures:</strong> Our platform was completely inaccessible for extended periods (verified by our team)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700"><strong>Unauthorized Charges:</strong> Charges made without your authorization (subject to investigation)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700"><strong>Technical Defects:</strong> Major technical issues on our end that prevent access to paid content</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Verification Required</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <p className="text-yellow-900">
                      <strong>Note:</strong> All refund requests require verification by our technical team. We will investigate the issue and respond within 48 hours. Proof of the error may be required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <XCircleIcon className="h-7 w-7" />
                2. Non-Refundable Situations
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p className="font-medium text-gray-900 mb-3">
                  Refunds will <strong className="text-red-600">ABSOLUTELY NOT</strong> be granted in the following cases:
                </p>
                <div className="bg-red-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong>Change of mind</strong> or dissatisfaction with content</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p>You have <strong>used any part of the platform</strong> (tests, PDFs, study materials)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p>You have <strong>accessed or downloaded</strong> any e-books, PDFs, or study materials</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p>You have <strong>taken any tests</strong> or viewed any solutions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong>Personal reasons</strong> (financial difficulties, changed plans, etc.)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong>Exam postponement or cancellation</strong> by government or exam authorities</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong>Failure to pass exams</strong> or achieve desired scores</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong>Internet connectivity issues</strong> or device compatibility problems on your end</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong>Medical or family emergencies</strong> (no exceptions)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p>Account <strong>suspended or terminated</strong> due to policy violations</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong>Finding similar content elsewhere</strong> or on other platforms</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong>Not liking the interface</strong> or user experience after purchase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-secondary-500 to-secondary-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ArrowPathIcon className="h-7 w-7" />
                3. Refund Process & Timeline
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Request a Refund</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Send an email to <strong>admin@planprep4u.com</strong> with subject "Refund Request"</li>
                    <li>Include: Your registered email, order/transaction ID, reason for refund</li>
                    <li>Our team will review your request within <strong>24-48 hours</strong></li>
                    <li>You will receive an email confirming approval or denial</li>
                    <li>If approved, refund will be processed within <strong>5-7 business days</strong></li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Method</h3>
                  <p className="text-gray-700 mb-2">Refunds will be credited to:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>The <strong>original payment method</strong> used for purchase</li>
                    <li>UPI, bank account, credit/debit card (same as payment)</li>
                    <li>Processing time varies by bank (typically 5-7 business days)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Processing Timeline</h3>
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <p className="text-gray-700"><strong>24-48 hours:</strong> Request review and approval</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <p className="text-gray-700"><strong>2-3 business days:</strong> Refund initiated by us</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <p className="text-gray-700"><strong>3-5 business days:</strong> Bank/payment gateway processing</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">✓</div>
                        <p className="text-gray-700"><strong>Total: 5-10 days</strong> from request to credit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ExclamationTriangleIcon className="h-7 w-7" />
                4. Important Notes & Conditions
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">All Sales Are Final</h4>
                  <p>
                    <strong>All subscription purchases are final and non-refundable.</strong> By purchasing, you acknowledge that you understand and accept this strict no-refund policy.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Gateway Charges</h4>
                  <p>
                    In the rare case that a refund is granted for a system error, payment processing fees (typically 2-3%) charged by payment gateways are non-refundable and will be deducted from your refund amount.
                  </p>
                </div>

                <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Account Closure</h4>
                  <p>
                    Once a refund is processed (for system errors only), your account will be immediately deactivated, and you will lose access to all content, test history, and progress data permanently.
                  </p>
                </div>

                <div className="bg-primary-50 border-l-4 border-primary-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Free Trial Recommended</h4>
                  <p>
                    We strongly recommend using our free tests and trial content before purchasing a subscription. This allows you to evaluate the platform and content quality before making a commitment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-500 p-6">
              <h2 className="text-2xl font-bold text-white">5. Technical Issues & Service Disruptions</h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-4">
                  <p className="text-primary-900">
                    <strong>Our Commitment:</strong> If you experience technical issues caused by PlanPrep4u's systems, we will work to resolve them quickly.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">If You Experience Technical Issues:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Contact our support team immediately at <strong>admin@planprep4u.com</strong></li>
                  <li>Provide detailed information about the issue (screenshots, error messages, etc.)</li>
                  <li>Our team will investigate within <strong>24-48 hours</strong></li>
                  <li>If the issue is on our end, we will fix it as soon as possible</li>
                  <li>If we cannot fix it, we may extend your subscription period OR grant a refund</li>
                </ol>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                  <p className="text-sm">
                    <strong>Important:</strong> Refunds for technical issues are ONLY granted if:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm">
                    <li>The problem is verified to be on our end (server issues, platform bugs, etc.)</li>
                    <li>The issue prevents substantial access to content for an extended period</li>
                    <li>We are unable to resolve it within a reasonable timeframe</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
                  <p className="text-sm text-red-900">
                    <strong>NOT Covered:</strong> User-side issues such as slow internet, device incompatibility, browser problems, or regional network issues are NOT eligible for refunds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6">
              <h2 className="text-2xl font-bold text-white">6. Changes to This Policy</h2>
            </div>
            <div className="p-8">
              <div className="text-gray-700 space-y-3">
                <p>
                  We reserve the right to modify this Cancellation & Refund Policy at any time. Changes will be effective upon posting on this page with an updated "Last Modified" date.
                </p>
                <p>
                  Refund requests will be governed by the policy in effect at the time of purchase, not at the time of the refund request.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-white text-center">
            <EnvelopeIcon className="h-16 w-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Experiencing a System Error?</h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              If you believe you were charged incorrectly due to a technical error on our end, contact our support team immediately.
            </p>
            <a
              href="mailto:admin@planprep4u.com?subject=Billing%20Error%20Report"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <EnvelopeIcon className="h-6 w-6" />
              admin@planprep4u.com
            </a>
            <p className="text-white/70 text-sm mt-6">
              Include: Transaction ID, registered email, and detailed description of the error
            </p>
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto">
              <p className="text-white/90 text-sm">
                <strong>Reminder:</strong> Refunds are NOT granted for change of mind or dissatisfaction. Please use our free tests before purchasing.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 PlanPrep4u. All rights reserved.</p>
          <p className="mt-2">All subscriptions are final. We provide refunds only for system errors and billing mistakes.</p>
          <p className="mt-1 font-semibold text-red-600">Think before you buy. Try our free tests first!</p>
        </div>

      </div>
    </div>
  );
};

export default RefundPolicyPage;
