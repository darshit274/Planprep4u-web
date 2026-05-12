import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DevicePhoneMobileIcon,
  BellIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Planprep4uLogoPng from './../assets/planprep4u-logo.png';

const AppComingSoonPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Countdown Timer State (Set launch date - 1 day from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 1);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call (you can implement this later)
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center group bg-gradient-to-r from-primary-400 to-primary-500 rounded-2xl group-hover:opacity-30 transition-opacity">
              <img
                src={Planprep4uLogoPng}
                alt="PlanPrep4u"
                className="h-16 w-auto drop-shadow-lg transition-transform group-hover:scale-105"
              />
            </Link>
            <Link
              to="/"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-200 border border-white/30"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold mb-8 animate-bounce border border-white/30">
            <RocketLaunchIcon className="w-5 h-5 mr-2" />
            Launching Soon!
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            PlanPrep4u
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-primary-300 to-secondary-300 bg-clip-text text-transparent">
              Mobile App
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your ultimate companion for Gujarat competitive Exam preparation.
            <br />Practice on-the-go with our powerful mobile app!
          </p>

          {/* Countdown Timer */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Countdown to Launch</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {/* Days */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-primary-200 text-sm uppercase tracking-wider">Days</div>
              </div>

              {/* Hours */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-primary-200 text-sm uppercase tracking-wider">Hours</div>
              </div>

              {/* Minutes */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-primary-200 text-sm uppercase tracking-wider">Minutes</div>
              </div>

              {/* Seconds */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-primary-200 text-sm uppercase tracking-wider">Seconds</div>
              </div>
            </div>
          </div>

          {/* App Mockup / Icon */}
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg rounded-3xl border-4 border-white/40 shadow-2xl">
              <DevicePhoneMobileIcon className="w-20 h-20 md:w-24 md:h-24 text-white" />
            </div>
          </div>

          {/* Notify Me Form */}
          {!isSubscribed ? (
            <div className="max-w-md mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  <BellIcon className="w-8 h-8 text-white mr-2" />
                  <h3 className="text-2xl font-bold text-white">Get Notified</h3>
                </div>
                <p className="text-primary-100 mb-6">
                  Be the first to know when we launch! Enter your email below.
                </p>
                <form onSubmit={handleNotifyMe} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                      disabled={isSubmitting}
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-200">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-primary-600 font-bold py-4 px-8 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Notify Me at Launch
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </span>
                    )}
                  </button>
                </form>
                <p className="text-xs text-primary-200 mt-4">
                  We'll only send you updates about the app launch. No spam, promise!
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircleIcon className="w-16 h-16 text-green-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">You're All Set!</h3>
                <p className="text-primary-100 mb-6">
                  Thank you for subscribing! We'll notify you as soon as our mobile app launches.
                </p>
                <Link
                  to="/"
                  className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-xl hover:bg-primary-50 transition-all duration-200"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* Social Media Links */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6">Follow Us for Updates</h3>
            <div className="flex items-center justify-center gap-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/30 transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/30 transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/30 transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/30 transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Meanwhile Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Meanwhile, Keep Preparing!</h3>
            <p className="text-primary-100 mb-6">
              Don't wait for the app! Start your preparation journey today on our web platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-white text-primary-600 font-bold py-3 px-8 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg"
              >
                Get Started Now
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/tests"
                className="inline-flex items-center justify-center bg-white/20 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                Browse Free Tests
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 text-center">
            <p className="text-primary-100 mb-4">Have questions or suggestions?</p>
            <a
              href="mailto:planprep4uofficial@gmail.com"
              className="inline-flex items-center text-white hover:text-primary-200 transition-colors"
            >
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              <span className="font-semibold">planprep4uofficial@gmail.com</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-100 text-sm">
            © 2025 PlanPrep4u. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppComingSoonPage;
