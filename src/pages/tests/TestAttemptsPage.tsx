import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ClockIcon,
  BookOpenIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  TrophyIcon,
  CalendarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface AttemptItem {
  attemptNumber: number;
  sessionId: string;
  completedAt: string;
  score: number;
  percentage: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unanswered: number;
  timeTaken: string;
}

interface AttemptsData {
  testId: string;
  testName: string;
  testUuid: string;
  totalAttempts: number;
  attempts: AttemptItem[];
}

type SortOption = 'recent' | 'highest' | 'lowest';

const TestAttemptsPage: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const [data, setData] = useState<AttemptsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  useEffect(() => {
    if (testId) {
      fetchAttempts();
    }
  }, [testId]);

  const fetchAttempts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/test-history/test/${testId}/attempts`);

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch attempts:', error);
      setError(error.response?.data?.message || 'Failed to load attempts');
      toast.error('Failed to load attempts');
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

  const getSortedAttempts = (): AttemptItem[] => {
    if (!data) return [];

    const sorted = [...data.attempts];
    switch (sortBy) {
      case 'highest':
        return sorted.sort((a, b) => b.percentage - a.percentage);
      case 'lowest':
        return sorted.sort((a, b) => a.percentage - b.percentage);
      case 'recent':
      default:
        return sorted; // Already sorted by date DESC from backend
    }
  };

  const handleViewDetails = (sessionId: string) => {
    navigate(`/test-history/${sessionId}`,{state:{categoryUuid:testId}});
  };

  const handleViewSolutions = (sessionId: string) => {
    if (data?.testUuid) {
      navigate(`/tests/solutions/${data.testUuid}?session=${sessionId}`);
    } else {
      navigate(`/test-history/${sessionId}/solutions`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading attempts</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/test-history')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedAttempts = getSortedAttempts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/test-history')}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Back to Test History</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {data?.testName || 'Test'} - All Attempts
              </h1>
              <p className="mt-1 text-gray-600">
                {data?.totalAttempts} {data?.totalAttempts === 1 ? 'attempt' : 'attempts'} recorded
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Attempts</h2>
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Score</option>
              <option value="lowest">Lowest Score</option>
            </select>
          </div>
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
        ) : sortedAttempts.length === 0 ? (
          // Empty State
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Attempts Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no recorded attempts for this test.
            </p>
          </div>
        ) : (
          // Attempts List
          <div className="space-y-4">
            {sortedAttempts.map((attempt) => (
              <div
                key={attempt.sessionId}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Section: Attempt Info */}
                    <div className="flex-1 min-w-0">
                      {/* Attempt Number and Date */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Attempt #{attempt.attemptNumber}
                        </h3>
                        <span className="text-xl">{getPerformanceEmoji(attempt.percentage)}</span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(attempt.completedAt)}</span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="flex flex-col">
                          <span className="text-gray-500 mb-1">Correct</span>
                          <span className="font-semibold text-green-600">{attempt.correct}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 mb-1">Wrong</span>
                          <span className="font-semibold text-red-600">{attempt.wrong}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 mb-1">Unanswered</span>
                          <span className="font-semibold text-gray-600">{attempt.unanswered}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Score Badge */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn(
                        'flex flex-col items-center justify-center w-20 h-20 rounded-full border-2',
                        getPercentageColor(attempt.percentage)
                      )}>
                        <span className="text-2xl font-bold">{attempt.percentage}%</span>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Score</div>
                        <div className="font-semibold text-gray-900">
                          {attempt.score}/{attempt.totalQuestions}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={() => handleViewDetails(attempt.sessionId)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewSolutions(attempt.sessionId)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span>View Solutions</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-12"></div>
      </div>
    </div>
  );
};

export default TestAttemptsPage;
