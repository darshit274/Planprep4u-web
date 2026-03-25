import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  BookOpenIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  CalendarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface TestHistoryItem {
  testId: number;
  testName: string;
  testUuid: string;
  hierarchyPath: string;
  testSeriesName: string;
  categoryName: string;
  subCategoryName?: string;
  isFreeInPaidSeries: boolean;
  pricingType: string;
  // Latest attempt info
  latestSessionId: string;
  completedAt: string;
  latestScore: number;
  latestPercentage: number;
  // Best score info
  bestScore: number;
  bestPercentage: number;
  // Attempt tracking
  totalAttempts: number;
  totalQuestions: number;
  attempted: number;
  timeTaken: string;
}

const TestHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTestHistory();
  }, [page]);

  const fetchTestHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/test-history', {
        params: {
          page,
          limit: 10,
          sort: 'date_desc'
        }
      });

      if (response.data.success) {
        setHistory(response.data.data.history || []);
        setTotalPages(response.data.data.pagination?.totalPages || 1);
        setTotal(response.data.data.pagination?.total || 0);
      }
    } catch (error: any) {
      console.error('Failed to fetch test history:', error);
      setError(error.response?.data?.message || 'Failed to load test history');
      toast.error('Failed to load test history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-primary-600 bg-primary-50 border-primary-200';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPerformanceEmoji = (percentage: number) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '⭐';
    if (percentage >= 70) return '✨';
    if (percentage >= 60) return '👍';
    if (percentage >= 50) return '📈';
    return '💪';
  };

  const handleViewDetails = (sessionId: string,testUuid: string) => {
    navigate(`/test-history/${sessionId}`,{state: {categoryUuid: testUuid}});
  };

  const handleViewSolutions = (testUuid: string, sessionId: string) => {
    navigate(`/tests/solutions/${testUuid}?session=${sessionId}`);
  };

  const handleViewAllAttempts = (testId: number) => {
    navigate(`/test-history/test/${testId}/attempts`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading test history</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={fetchTestHistory}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Test History</h1>
              <p className="mt-1 text-gray-600">
                Review your past performance and track your progress
              </p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Test History {total > 0 && `(${total})`}
          </h2>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          // Empty State
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Test History</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't completed any tests yet. Start taking tests to see your history here!
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/tests')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Test Series
              </button>
            </div>
          </div>
        ) : (
          // History List
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.testId}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Section: Test Info */}
                    <div className="flex-1 min-w-0">
                      {/* Test Name with Attempts Badge */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <span>{item.testName}</span>
                          <span className="text-xl">{getPerformanceEmoji(item.bestPercentage)}</span>
                        </h3>
                        {item.totalAttempts > 1 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {item.totalAttempts} attempts
                          </span>
                        )}
                      </div>

                      {/* Hierarchy Breadcrumb */}
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                        <BookOpenIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{item.hierarchyPath}</span>
                        {item.isFreeInPaidSeries && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                            Free
                          </span>
                        )}
                      </div>

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <BookOpenIcon className="h-4 w-4 text-gray-400" />
                          <span>
                            <span className="font-medium">{item.totalQuestions}</span> Questions
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs">{formatDate(item.completedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Dual Score Display */}
                    <div className="flex flex-col items-end gap-2">
                      {/* Best Score */}
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Best Score</div>
                        <div className={cn(
                          'inline-flex items-center justify-center px-3 py-1 rounded-lg border-2 font-bold',
                          getPercentageColor(item.bestPercentage)
                        )}>
                          <TrophyIcon className="h-4 w-4 mr-1" />
                          <span className="text-lg">{item.bestPercentage}%</span>
                        </div>
                      </div>
                      {/* Latest Score */}
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Latest</div>
                        <div className={cn(
                          'inline-flex items-center justify-center px-3 py-1 rounded-lg border font-medium text-sm',
                          item.latestPercentage === item.bestPercentage
                            ? 'border-green-300 bg-green-50 text-green-700'
                            : 'border-gray-300 bg-gray-50 text-gray-700'
                        )}>
                          {item.latestPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    {item.totalAttempts > 1 && (
                      <button
                        onClick={() => handleViewAllAttempts(item.testId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors"
                      >
                        <span>View All Attempts ({item.totalAttempts})</span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(item.latestSessionId,item.testUuid)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors",
                        item.totalAttempts > 1 ? "flex-1" : "flex-[2]"
                      )}
                    >
                      <span>Latest Details</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewSolutions(item.testUuid, item.latestSessionId)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span>Solutions</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              )}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              )}
            >
              Next
            </button>
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-12"></div>
      </div>
    </div>
  );
};

export default TestHistoryPage;
