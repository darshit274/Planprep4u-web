import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { store, useAppDispatch, useAppSelector } from './store';
import { restoreSession } from './store/slices/authSlice';

// Layout Components
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyOTPPage from './pages/auth/VerifyOTPPage';

// Main Pages
import AppComingSoonPage from './pages/AppComingSoonPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import HelpSupportPage from './pages/HelpSupportPage';
import HomePage from './pages/HomePage';
import PDFsPage from './pages/pdfs/PDFsPage';
import PDFViewerPage from './pages/pdfs/PDFViewerPage';
import PrivacySecurityPage from './pages/PrivacySecurityPage';
import SourcesDisclaimer from './pages/SourcesDisclaimer';
import PerformancePage from './pages/profile/PerformancePage';
import ProfileEditPage from './pages/profile/ProfileEditPage';
import ProfilePage from './pages/profile/ProfilePage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import CategoryDetailPage from './pages/tests/CategoryDetailPage';
import EnrolledSeriesPage from './pages/tests/EnrolledSeriesPage';
import FreeInPaidTestsPage from './pages/tests/FreeInPaidTestsPage';
import FreeTestsPage from './pages/tests/FreeTestsPage';
import SolutionsPage from './pages/tests/SolutionsPage';
import TakeTestPage from './pages/tests/TakeTestPage';
import TestAttemptsPage from './pages/tests/TestAttemptsPage';
import TestHistoryDetailPage from './pages/tests/TestHistoryDetailPage';
import TestHistoryPage from './pages/tests/TestHistoryPage';
import TestLeaderboardPage from './pages/tests/TestLeaderboardPage';
import TestResultsPage from './pages/tests/TestResultsPage';
import TestSeriesDetailPage from './pages/tests/TestSeriesDetailPage';
import TestSeriesPage from './pages/tests/TestSeriesPage';
import TestSolutionsPage from './pages/tests/TestSolutionsPage';
import TestsPage from './pages/tests/TestsPage';

// Payment Pages
import PaymentPage from './pages/PaymentPage';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

// App Content Component (inside Redux Provider)
function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Restore user session from sessionStorage on app load
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/forgot-password" 
              element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route
              path="/reset-password"
              element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/verify-otp"
              element={!isAuthenticated ? <VerifyOTPPage /> : <Navigate to="/dashboard" replace />}
            />
          </Route>

          {/* Protected Main Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Test Routes */}
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/enrolled-series" element={<EnrolledSeriesPage />} />
            <Route path="/tests/series/:uuid" element={<TestSeriesDetailPage />} />
            <Route path="/tests/category/:uuid" element={<CategoryDetailPage />} />
            <Route path="/tests/quiz/:uuid" element={<TakeTestPage />} />
            <Route path="/tests/solutions/:uuid" element={<SolutionsPage />} />
            <Route path="/tests/leaderboard/:uuid" element={<TestLeaderboardPage />} />
            <Route path="/tests/series/:id" element={<TestSeriesPage />} />
            <Route path="/tests/take/:id" element={<TakeTestPage />} />
            <Route path="/tests/results/:id" element={<TestResultsPage />} />
            <Route path="/tests/solutions/:id" element={<TestSolutionsPage />} />
            
            {/* Free Test Routes */}
            <Route path="/free-tests" element={<FreeTestsPage />} />
            <Route path="/free-tests/take/:id" element={<TakeTestPage />} />


            {/* Free in Paid Series Routes */}
            <Route path="/free-in-paid-tests" element={<FreeInPaidTestsPage />} />

            {/* Test History Routes */}
            <Route path="/test-history" element={<TestHistoryPage />} />
            <Route path="/test-history/test/:testId/attempts" element={<TestAttemptsPage />} />
            <Route path="/test-history/:sessionId" element={<TestHistoryDetailPage />} />
            <Route path="/test-history/:sessionId/solutions" element={<TestSolutionsPage />} />

            {/* PDF Routes */}
            <Route path="/pdfs" element={<PDFsPage />} />
            <Route path="/pdfs/view/:id" element={<PDFViewerPage />} />
            <Route path="/pdfs/:id" element={<PDFViewerPage />} />
            
            {/* Profile Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/profile/performance" element={<PerformancePage />} />
            
            {/* Payment Routes */}
            <Route path="/payment" element={<PaymentPage />} />
            
            {/* Other Routes - Leaderboard removed from sidebar, now only accessible after tests */}
          </Route>

          {/* Privacy & Support Routes - Public Access */}
          <Route path="/privacy" element={<PrivacySecurityPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/source" element={<SourcesDisclaimer />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/app-coming-soon" element={<AppComingSoonPage />} />

          {/* Error Routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;