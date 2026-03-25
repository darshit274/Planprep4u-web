import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
  LanguageIcon,
  LightBulbIcon,
  ArrowPathIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import MockTaleLogoPng from './../assets/planprep4u-logo.png';
import ContactQueryForm from '../components/ContactQueryForm';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-primary-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={MockTaleLogoPng}
                alt="PlanPrep4u"
                className="h-16 w-auto drop-shadow-sm transition-transform hover:scale-105"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 bg-primary-50 rounded-full px-3 py-2 border border-primary-100">
              <a href="#about" className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200">
                About
              </a>
              <a href="#features" className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200">
                Features
              </a>
              <a href="#faqs" className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200">
                FAQs
              </a>
              <a href="#contact" className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200">
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 rounded-full transition-all duration-200 border border-primary-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 transition-all duration-200 hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="page-container relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold mb-8 animate-fade-in border border-primary-200">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Practice Relentlessly. Perform Flawlessly.
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 animate-slide-up leading-tight">
              PlanPrep4u
            </h1>

            <p className="text-2xl md:text-3xl font-bold mb-6 animate-slide-up">
              <span className="gradient-text">Your Smart Companion</span>{' '}
              for Gujarat Competitive Exam Preparation
            </p>

            {/* Key Features Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-700 mb-10 animate-fade-in">
              {['Full-Length Mock Tests', 'Subject & Topic-Wise Practice', 'Real Exam Pattern', 'Gujarati & English'].map((f) => (
                <span key={f} className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-primary-100">
                  <CheckCircleIcon className="w-4 h-4 text-primary-500 mr-2" />
                  {f}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-scale-in">
              <Link to="/register" className="btn btn-primary btn-lg group">
                🎯 Start Practicing Today
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/tests" className="btn btn-outline btn-lg group border-2 border-primary-200 text-primary-700 hover:bg-primary-50">
                Start Free Test
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Exam Types */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 mb-3 font-medium">Exams Covered:</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
                {['GPSC', 'GSSSB', 'GPSSB', 'Police Constable', 'PSI', 'Talati', 'Junior Clerk', 'More...'].map((exam) => (
                  <span key={exam} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full font-semibold border border-primary-100">
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
                What is <span className="gradient-text">PlanPrep4u</span>?
              </h2>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12 shadow-lg border border-primary-100">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                PlanPrep4u is a powerful <strong className="text-primary-700">mock test platform</strong> built for aspirants preparing for various{' '}
                <strong className="text-secondary-700">Gujarat competitive Exams</strong> like GPSC, GSSSB, GPSSB, Police-constable Bharti, PSI, Talati, Junior Clerk and more.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                We provide <strong>full-length tests</strong>, <strong>subject-wise practice</strong>, <strong>topic-wise revision</strong>,{' '}
                <strong>free previous year question papers (PYQPs)</strong> to attempt and <strong>free quizzes</strong> of maths and reasoning in{' '}
                <strong className="text-primary-600">Gujarati and English</strong> helping you master every corner of the syllabus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="gradient-text">PlanPrep4u</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive features designed to give you the edge in your exam preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: LanguageIcon, title: 'Bilingual Language Support', color: 'from-primary-500 to-primary-600', desc: 'We offer tests in both <strong>Gujarati and English</strong> (where applicable), helping every aspirant prepare in their most comfortable language.' },
              { icon: DocumentTextIcon, title: 'Real Exam Experience', color: 'from-secondary-500 to-secondary-600', desc: 'Our mock tests are crafted to closely mirror the actual exams - right from <strong>question pattern to time pressure</strong> - so you\'re always exam-ready.' },
              { icon: ChartBarIcon, title: 'Instant Results & Smart Analytics', color: 'from-primary-400 to-primary-600', desc: 'Get your <strong>marks, rank, and percentile instantly</strong>. Track your performance and identify areas for improvement.' },
              { icon: LightBulbIcon, title: 'Detailed Solutions & Explanations', color: 'from-[#c19e6b] to-[#a6834e]', desc: 'Every question includes a <strong>thorough explanation</strong> so you not only know the right answer, but also why it\'s right.' },
              { icon: ArrowPathIcon, title: 'Practice Mode Option', color: 'from-[#db4d4b] to-[#c43a38]', desc: 'Attempt tests in <strong>Practice Mode</strong>, where solutions are hidden even after submission - so you can revisit and reattempt with full focus.' },
              { icon: AcademicCapIcon, title: 'Full Syllabus Coverage', color: 'from-secondary-600 to-secondary-700', desc: 'Our <strong>subject-wise and topic-wise tests</strong> are designed to ensure complete coverage of the syllabus - making revision effective and structured.' },
              { icon: PuzzlePieceIcon, title: 'Frequent Free Quizzes', color: 'from-[#88b7a5] to-[#6fa28f]', desc: 'Boost your speed and accuracy with our <strong>free quizzes in Maths and Reasoning</strong> - available in both English and Gujarati with solutions.' },
              { icon: BookOpenIcon, title: 'Diverse & Curated Question Bank', color: 'from-primary-600 to-secondary-600', desc: 'Our content is <strong>carefully selected from various authentic materials</strong> to give you the broadest and most relevant practice.' },
            ].map(({ icon: Icon, title, color, desc }) => (
              <div key={title} className="card-hover p-8 group bg-white">
                <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="section-spacing bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know about PlanPrep4u</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Are the mock tests based on the latest exam pattern?', a: 'Yes, all mock tests are designed to reflect the <strong>latest pattern and difficulty level</strong> of Gujarat competitive Exams.' },
              { q: 'What is the language of tests?', a: 'All tests are available in <strong>Gujarati, and in English wherever applicable</strong>. You can switch languages during the test.' },
              { q: 'What is Practice Mode?', a: 'Practice Mode lets you <strong>attempt the test without seeing solutions</strong>—so you can revisit and learn without distractions.' },
              { q: 'How soon do I get results?', a: '<strong>Instantly.</strong> As soon as you submit, you get marks, rank, percentile, and detailed performance analysis.' },
            ].map(({ q, a }, i) => (
              <div key={i} className="card-hover p-6 bg-primary-50 border border-primary-100">
                <div className="flex items-start">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{q}</h3>
                    <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: a }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-spacing bg-primary-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Have Questions? <span className="gradient-text">Get in Touch</span>
            </h2>
            <p className="text-xl text-gray-600">
              We're here to help! Send us your queries and we'll respond within 24 hours.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-primary-100">
              <ContactQueryForm variant="compact" />
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Or reach us directly at:</p>
              <a
                href="mailto:planprep4uofficial@gmail.com"
                className="inline-flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                planprep4uofficial@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-primary-700">
        <div className="page-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ace Your{' '}
            <span className="text-accent-400">Gujarat Govt Exams</span>?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their exam preparation with PlanPrep4u
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn btn-lg bg-accent-500 hover:bg-accent-600 text-white font-bold shadow-xl">
              Get Started Now - It's Free!
            </Link>
            <Link to="/tests" className="btn btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold">
              Browse Free Tests
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 border-t border-primary-800 py-12">
        <div className="page-container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img src={MockTaleLogoPng} alt="PlanPrep4u" className="h-14 rounded-xl bg-white p-1" />
                <div className="ml-3">
                  <div className="text-lg font-bold text-white">PlanPrep4u</div>
                  <div className="text-sm text-primary-300">Test Series for Toppers</div>
                </div>
              </div>
              <p className="text-primary-200 text-sm leading-relaxed">
                Your trusted platform for Gujarat competitive Exam preparation. Comprehensive mock tests, study materials, and analytics to help you succeed.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-primary-300 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
                <li><Link to="/tests" className="hover:text-white transition-colors">Free Tests</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-primary-300 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
                <li><Link to="/source" className="hover:text-white transition-colors">Sources & Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact row */}
          <div className="mb-6 flex items-center gap-2 text-primary-300 text-sm">
            <EnvelopeIcon className="w-4 h-4" />
            <span>planprep4uofficial@gmail.com</span>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-primary-800 text-center text-primary-400 text-sm">
            <p>© 2025 PlanPrep4u. All rights reserved.</p>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <span className="text-primary-700">•</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <span className="text-primary-700">•</span>
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
              <span className="text-primary-700">•</span>
              <Link to="/help" className="hover:text-white transition-colors">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
