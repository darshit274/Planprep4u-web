import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  TrophyIcon,
  ArrowRightIcon,
  SparklesIcon,
  LanguageIcon,
  LightBulbIcon,
  ArrowPathIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import MockTaleLogoPng from './../assets/planprep4u-logo.png';
import MockTaleLogoJpg from './../assets/planprep4u-logo.jpg';
import ContactQueryForm from '../components/ContactQueryForm';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation Header - Premium Design */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center relative group">
              <div className="absolute bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl group-hover:opacity-30 transition-opacity p-0 w-full h-3/4"></div>
              <img
                src={MockTaleLogoPng}
                alt="PlanPrep4u"
                className="relative h-20 sm:h-24 w-auto drop-shadow-lg transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Navigation - Center */}
            <nav className="hidden lg:flex items-center space-x-2 bg-white/60 backdrop-blur-md rounded-full px-3 py-2 shadow-lg shadow-blue-500/10 border border-white/50">
              <a
                href="#about"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200"
              >
                About
              </a>
              <a
                href="#features"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Features
              </a>
              <a
                href="#faqs"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200"
              >
                FAQs
              </a>
              <a
                href="#contact"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Contact
              </a>
            </nav>

            {/* Auth Buttons - Right */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 bg-white/60 hover:bg-white backdrop-blur-md rounded-full transition-all duration-200 shadow-md hover:shadow-lg border border-white/50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 rounded-full shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border border-blue-400/50"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="page-container relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 text-sm font-semibold mb-8 animate-fade-in shadow-md">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Practice Relentlessly. Perform Flawlessly.
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 animate-slide-up leading-tight">
              PlanPrep4u
            </h1>

            <p className="text-2xl md:text-3xl font-bold mb-6 animate-slide-up">
              <span className="gradient-text">
                Your Smart Companion
              </span>{' '}
              for Gujarat competitive Exam Preparation
            </p>

            {/* Key Features List */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-700 mb-10 animate-fade-in">
              <span className="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                Full-Length Mock Tests
              </span>
              <span className="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                Subject & Topic-Wise Practice
              </span>
              <span className="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                Real Exam Pattern
              </span>
              <span className="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                Gujarati & English
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-scale-in">
              <Link
                to="/register"
                className="btn btn-primary btn-lg group"
              >
                🎯 Start Practicing Today
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/tests"
                className="btn btn-outline btn-lg group border-2"
              >
                Start Free Test
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Exam Types */}
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
              <p className="text-sm text-gray-600 mb-3 font-medium">Exams Covered:</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
                {['GPSC', 'GSSSB', 'GPSSB', 'Police Constable', 'PSI', 'Talati', 'Junior Clerk', 'More...'].map((exam) => (
                  <span key={exam} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-spacing bg-white">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What is{' '}
                <span className="gradient-text">PlanPrep4u</span>?
              </h2>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-lg">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                PlanPrep4u is a powerful <strong className="text-blue-600">mock test platform</strong> built for aspirants preparing for various{' '}
                <strong className="text-purple-600">Gujarat competitive Exams</strong> like GPSC, GSSSB, GPSSB, Police-constable Bharti, PSI, Talati, Junior Clerk and more.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                We provide <strong>full-length tests</strong>, <strong>subject-wise practice</strong>, <strong>topic-wise revision</strong>,{' '}
                <strong>free previous year question papers (PYQPs)</strong> to attempt and <strong>free quizzes</strong> of maths and reasoning in{' '}
                <strong className="text-green-600">Gujarati and English</strong> helping you master every corner of the syllabus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{' '}
              <span className="gradient-text">PlanPrep4u</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive features designed to give you the edge in your exam preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Bilingual Support */}
            <div className="card-hover p-8 group bg-white">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LanguageIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bilingual Language Support</h3>
              <p className="text-gray-600 leading-relaxed">
                We offer tests in both <strong>Gujarati and English</strong> (where applicable), helping every aspirant prepare in their most comfortable language.
              </p>
            </div>

            {/* Feature 2: Real Exam Experience */}
            <div className="card-hover p-8 group bg-white">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Exam Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Our mock tests are crafted to closely mirror the actual exams - right from <strong>question pattern to time pressure</strong> - so you're always exam-ready.
              </p>
            </div>

            {/* Feature 3: Instant Results */}
            <div className="card-hover p-8 group bg-white">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results & Smart Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your <strong>marks, rank, and percentile instantly</strong>. Track your performance and identify areas for improvement.
              </p>
            </div>

            {/* Feature 4: Detailed Solutions */}
            <div className="card-hover p-8 group bg-white">
              <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LightBulbIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Solutions & Explanations</h3>
              <p className="text-gray-600 leading-relaxed">
                Every question includes a <strong>thorough explanation</strong> so you not only know the right answer, but also why it's right - turning every mistake into a learning opportunity.
              </p>
            </div>

            {/* Feature 5: Practice Mode */}
            <div className="card-hover p-8 group bg-white">
              <div className="w-14 h-14 bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ArrowPathIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Practice Mode Option</h3>
              <p className="text-gray-600 leading-relaxed">
                Attempt tests in <strong>Practice Mode</strong>, where solutions are hidden - even after submission - so you can revisit and reattempt with full focus.
              </p>
            </div>

            {/* Feature 6: Full Syllabus Coverage */}
            <div className="card-hover p-8 group bg-white">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Full Syllabus Coverage</h3>
              <p className="text-gray-600 leading-relaxed">
                Our <strong>subject-wise and topic-wise tests</strong> are designed to ensure complete coverage of the syllabus - making revision effective and structured.
              </p>
            </div>

            {/* Feature 7: Free Quizzes */}
            <div className="card-hover p-8 group bg-white">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PuzzlePieceIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Frequent Free Quizzes</h3>
              <p className="text-gray-600 leading-relaxed">
                Boost your speed and accuracy with our <strong>free quizzes in Maths and Reasoning</strong> - available in both English and Gujarati with solutions.
              </p>
            </div>

            {/* Feature 8: Diverse Question Bank */}
            <div className="card-hover p-8 group bg-white">
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpenIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diverse & Curated Question Bank</h3>
              <p className="text-gray-600 leading-relaxed">
                We don't limit our questions to any single source. Our content is <strong>carefully selected from various authentic materials</strong> to give you the broadest and most relevant practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="section-spacing bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked{' '}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know about PlanPrep4u</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {/* FAQ 1 */}
            <div className="card-hover p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-start">
                <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Are the mock tests based on the latest exam pattern?</h3>
                  <p className="text-gray-700">
                    Yes, all mock tests are designed to reflect the <strong>latest pattern and difficulty level</strong> of Gujarat competitive Exams.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="card-hover p-6 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-start">
                <QuestionMarkCircleIcon className="w-6 h-6 text-purple-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">What is the language of tests?</h3>
                  <p className="text-gray-700">
                    All tests are available in <strong>Gujarati, and in English wherever applicable</strong>. You can switch languages during the test.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="card-hover p-6 bg-gradient-to-r from-pink-50 to-rose-50">
              <div className="flex items-start">
                <QuestionMarkCircleIcon className="w-6 h-6 text-pink-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">What is Practice Mode?</h3>
                  <p className="text-gray-700">
                    Practice Mode lets you <strong>attempt the test without seeing solutions</strong>—so you can revisit and learn without distractions.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="card-hover p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-start">
                <QuestionMarkCircleIcon className="w-6 h-6 text-emerald-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">How soon do I get results?</h3>
                  <p className="text-gray-700">
                    <strong>Instantly.</strong> As soon as you submit, you get marks, rank, percentile, and detailed performance analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="section-spacing bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="page-container text-center">
          <DevicePhoneMobileIcon className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prepare Anytime, Anywhere
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Download PlanPrep4u on your phone or access it on your computer - study at your own pace, on your own schedule.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="https://play.google.com/store/apps/details?id=com.planprep4u.app"
              className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl"
            >
              📱 Download App
            </Link>
            <Link
              to="/tests"
              className="btn btn-lg bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold"
            >
              Take a Free Test Now
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section with Form */}
      <section id="contact" className="section-spacing bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Have Questions?{' '}
              <span className="gradient-text">Get in Touch</span>
            </h2>
            <p className="text-xl text-gray-600">
              We're here to help! Send us your queries and we'll respond within 24 hours.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <ContactQueryForm variant="compact" />
            </div>

            {/* Contact Info Below Form */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Or reach us directly at:</p>
              <a
                href="mailto:admin@planprep4u.com"
                className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                admin@planprep4u.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gray-900">
        <div className="page-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ace Your{' '}
            <span className="gradient-text">Gujarat Govt Exams</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their exam preparation with PlanPrep4u
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn btn-primary btn-lg"
            >
              Get Started Now - It's Free!
            </Link>
            <Link
              to="/tests"
              className="btn btn-outline btn-lg border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-600"
            >
              Browse Free Tests
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="page-container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img src={MockTaleLogoPng} alt="PlanPrep4u" className="h-16 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500" />
                <div className="ml-3">
                  <div className="text-lg font-bold text-white">PlanPrep4u</div>
                  <div className="text-sm text-gray-400">Practice Relentlessly. Perform Flawlessly.</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted platform for Gujarat competitive Exam preparation. Comprehensive mock tests, study materials, and analytics to help you succeed.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
                <li><Link to="/tests" className="hover:text-white transition-colors">Free Tests</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
                <li><Link to="/source" className="hover:text-white transition-colors">Sources & Disclaimer</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  admin@planprep4u.com
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2025 PlanPrep4u. All rights reserved.</p>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <span className="text-gray-600">•</span>
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
              <span className="text-gray-600">•</span>
              <Link to="/help" className="hover:text-white transition-colors">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;