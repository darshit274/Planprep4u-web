import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  LightBulbIcon,
  AcademicCapIcon,
  ClockIcon,
  GlobeAltIcon,
  TrophyIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'tests' | 'features';
}

const HelpSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I start taking practice tests?',
      answer: 'Navigate to the "Tests" section from the sidebar menu. Browse available test series or categories for government Town Planner exams (GPSC Town Planner, GSSSB Asst. Town Planner, etc.). Click on any test to view details, then click "Start Test". Choose your preferred language (English or Gujarati) and begin!',
      category: 'general',
    },
    {
      id: 2,
      question: 'What exams does PlanPrep4u cover?',
      answer: 'Currently we are focused on government exams for Town Planners — including GPSC Town Planner (Class 1 & 2), GSSSB Assistant Town Planner, Municipal Corporation Town Planner Bharti, GIDC Town Planner posts, and other urban development government roles. We are continuously adding more exam-specific content.',
      category: 'general',
    },
    {
      id: 3,
      question: 'Can I switch between English and Gujarati during tests?',
      answer: 'Yes! PlanPrep4u offers bilingual support. You can switch between English and Gujarati at any time during the test using the language toggle button. Your progress is automatically saved, and all questions, options, and explanations are available in both languages.',
      category: 'features',
    },
    {
      id: 4,
      question: 'How is my leaderboard rank calculated?',
      answer: 'Your rank is based on your FIRST ATTEMPT score for each test. The leaderboard ranks users by score (highest first). In case of a tie, the user who completed the test earlier receives the higher rank. This ensures fair competition and prevents gaming the system by retaking tests after viewing solutions.',
      category: 'tests',
    },
    {
      id: 5,
      question: 'What is Practice Mode and how does it work?',
      answer: 'Practice Mode allows you to reattempt questions after completing a test and viewing solutions. You can practice as many times as you want to strengthen your understanding. However, only your FIRST attempt score counts for leaderboard rankings. This feature is perfect for learning from mistakes and improving gradually.',
      category: 'features',
    },
    {
      id: 6,
      question: 'How do I view detailed solutions with explanations?',
      answer: 'After submitting any test, click the "View Solutions" button on the results page. You will see comprehensive explanations for all questions, including: why the correct answer is right, why other options are incorrect, key concepts to remember, and tips for similar questions.',
      category: 'tests',
    },
    {
      id: 7,
      question: 'Are there really free tests available?',
      answer: 'Yes! PlanPrep4u offers numerous free resources including: free practice quizzes on Town Planning concepts and general aptitude, free Previous Year Question Papers (PYQPs) for Town Planner exams, free topic-wise tests on planning subjects, and sample full-length mock tests. Premium test series require a subscription for complete access.',
      category: 'general',
    },
    {
      id: 8,
      question: 'My test results are not showing. What should I do?',
      answer: 'First, try refreshing your browser (Ctrl+R or Cmd+R). If the issue persists, go to "Test History" from the sidebar menu to view all your completed tests. Check your internet connection to ensure submissions were successful. If you still cannot see results after 5 minutes, please contact our support team.',
      category: 'technical',
    },
    {
      id: 9,
      question: 'How do test analytics and performance tracking work?',
      answer: 'PlanPrep4u provides detailed analytics including: overall accuracy percentage, subject-wise performance breakdown, time management analysis, comparison with top performers, strength and weakness identification, and progress tracking over time. Access your analytics from the Dashboard or Profile sections.',
      category: 'features',
    },
    {
      id: 10,
      question: 'Can I download study materials and PDFs?',
      answer: 'Yes! Visit the "PDFs" section from the sidebar menu. You can view and download: previous year question papers for Town Planner exams, topic-wise study notes on planning subjects, important Town Planning Acts and GDCR summaries, and exam pattern guides. All materials are available in both English and Gujarati.',
      category: 'general',
    },
    {
      id: 11,
      question: 'What is negative marking and how is it calculated?',
      answer: 'Negative marking mirrors actual government Town Planner exam patterns. Typically, wrong answers deduct 0.25 to 0.33 marks per question (varies by exam type). Your final score = (Correct answers × Marks per question) - (Wrong answers × Negative marks per question). The results page shows your score breakdown clearly.',
      category: 'tests',
    },
    {
      id: 12,
      question: 'How do I reset my password or update my profile?',
      answer: 'Click on your profile picture/name in the top-right corner. Select "Profile" from the dropdown menu. Click "Account Settings" to update your name, email, or profile picture. For password changes, go to "Privacy & Security" section and use the "Change Password" form.',
      category: 'technical',
    },
  ];

  const categories = [
    { id: 'all', name: 'All FAQs', icon: BookOpenIcon, color: 'from-primary-500 to-primary-400' },
    { id: 'general', name: 'General', icon: QuestionMarkCircleIcon, color: 'from-secondary-500 to-secondary-400' },
    { id: 'tests', name: 'Tests & Exams', icon: AcademicCapIcon, color: 'from-green-500 to-emerald-500' },
    { id: 'features', name: 'Features', icon: SparklesIcon, color: 'from-orange-500 to-red-500' },
    { id: 'technical', name: 'Technical', icon: DocumentTextIcon, color: 'from-secondary-500 to-primary-500' },
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
              <QuestionMarkCircleIcon className="h-12 w-12" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Help & Support Center</h1>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Find answers, get help, and learn everything about PlanPrep4u
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Quick Contact Cards */}
        <div className="grid gap-6 mb-12">
          <a
            href="mailto:planprep4uofficial@gmail.com"
            className="group bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <EnvelopeIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Email Support</h3>
                <p className="text-white/90 mb-2">Get detailed help via email</p>
                <p className="text-lg font-semibold">planprep4uofficial@gmail.com</p>
                <p className="text-sm text-white/70 mt-2">Response time: 24-48 hours</p>
              </div>
            </div>
          </a>

          {/* <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-white/90 mb-2">Instant messaging support</p>
                <p className="text-lg font-semibold">Quick & Easy</p>
                <p className="text-sm text-white/70 mt-2">Chat with us anytime!</p>
              </div>
            </div>
          </a> */}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-secondary-500 to-primary-500 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <BookOpenIcon className="h-10 w-10" />
              <div>
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                <p className="text-white/90 text-lg">Find quick answers to common questions</p>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                        : 'bg-white text-gray-700 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{cat.name}</span>
                    {cat.id === 'all' && (
                      <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {faqs.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                        {faq.id}
                      </div>
                      <span className="font-semibold text-gray-900 text-lg pr-4">{faq.question}</span>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronUpIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6 bg-gradient-to-br from-primary-50 to-secondary-50">
                      <div className="pl-14">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary-500 to-primary-400 text-white rounded-2xl p-6 shadow-lg">
            <LightBulbIcon className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Pro Tip</h3>
            <p className="text-white/90">
              Take tests regularly and review solutions thoroughly to track your progress and identify weak areas.
            </p>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-400 text-white rounded-2xl p-6 shadow-lg">
            <TrophyIcon className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Best Practice</h3>
            <p className="text-white/90">
              Focus on your first attempt! Only your first test score counts for rankings, so prepare well before starting.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
            <GlobeAltIcon className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Bilingual</h3>
            <p className="text-white/90">
              All content is available in both English and Gujarati. Switch languages anytime for better understanding.
            </p>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <AcademicCapIcon className="h-10 w-10" />
              Getting Started Guide
            </h2>
            <p className="text-white/90 text-lg mt-2">Step-by-step guide for new users</p>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-400 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Account</h3>
                  <p className="text-gray-700">Sign up with your email and complete your profile. Choose a display name for leaderboards.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Test Series</h3>
                  <p className="text-gray-700">Explore available tests for your target exam (GPSC Town Planner, GSSSB Asst. Town Planner, Municipal, etc.). Start with free tests to get familiar.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Your First Test</h3>
                  <p className="text-gray-700">Select language, read instructions, and start the test. Submit when done or time expires automatically.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Learn</h3>
                  <p className="text-gray-700">Check results, view detailed solutions, and use Practice Mode to reattempt questions. Track your progress!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <DocumentTextIcon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Study Materials</h3>
            <p className="text-gray-700 mb-4">
              Access free PDFs, previous year papers, and study notes for government Town Planner exams.
            </p>
            <button
              onClick={() => navigate('/pdfs')}
              className="text-primary-600 font-semibold hover:underline flex items-center gap-2"
            >
              Browse PDFs →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <ClockIcon className="h-12 w-12 text-secondary-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Test History</h3>
            <p className="text-gray-700 mb-4">
              View all your completed tests, scores, and performance analytics in one place.
            </p>
            <button
              onClick={() => navigate('/test-history')}
              className="text-secondary-600 font-semibold hover:underline flex items-center gap-2"
            >
              View History →
            </button>
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="bg-gradient-to-br from-secondary-600 to-primary-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-12 text-white text-center">
            <EnvelopeIcon className="h-20 w-20 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:planprep4uofficial@gmail.com"
                className="inline-flex items-center gap-3 bg-white text-secondary-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                <EnvelopeIcon className="h-6 w-6" />
                Email Us
              </a>
            </div>
            <p className="text-white/70 text-sm mt-6">
              Email: We respond within 24-48 hours 
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-lg">© 2025 PlanPrep4u. All rights reserved.</p>
          <p className="mt-2">Practice Relentlessly. Perform Flawlessly.</p>
        </div>

      </div>
    </div>
  );
};

export default HelpSupportPage;
