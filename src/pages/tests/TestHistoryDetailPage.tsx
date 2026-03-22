import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeftIcon,
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { api } from "../../services/api";
import { toast } from "react-hot-toast";

interface TestResultDetail {
  sessionId: string;
  testName: string;
  testUuid?: string;
  categoryName: string;
  completedAt: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  notAttempted: number;
  markedForReview: number;
  totalMarks: number;
  obtainedMarks: number;
  negativeMarks: number;
  finalScore: number;
  percentage: number;
  accuracy: number;
  timeSpent: number;
}

const TestHistoryDetailPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResultDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myRankData, setMyRankData] = useState({
    myRank: 0,
    totalParticipants: 0,
    percentile: 0,
  });
  const { categoryUuid } = useLocation()?.state;
  useEffect(() => {
    if (sessionId) {
      fetchResultDetail();
    } else {
      setError("Invalid session ID");
      setIsLoading(false);
    }
  }, [sessionId]);

  const fetchResultDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/test-history/${sessionId}`);
      const leaderboardResponse = await api.get(
        `/leaderboard/test-series/${sessionId}`
      );

      if (response.data.success) {
        setResult(response.data.data);
      }
      if (leaderboardResponse.data.success) {
        const data = leaderboardResponse?.data?.data;
        const userUuid = leaderboardResponse?.data?.metadata?.currentUserData?.uuid || JSON.parse(sessionStorage.getItem("planprep4u_user") || "{}").uuid;
        const myRank = data.find(
          (item) =>
            item.userId === userUuid
        );

        setMyRankData({
          myRank: myRank?.rank,
          totalParticipants: leaderboardResponse?.data?.metadata?.total,
          percentile: myRank?.percentile
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch result detail:", error);
      setError(error.response?.data?.message || "Failed to load test result");
      toast.error("Failed to load test result");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! 🏆";
    if (percentage >= 80) return "Excellent work! ⭐";
    if (percentage >= 70) return "Great job! ✨";
    if (percentage >= 60) return "Good effort! 👍";
    if (percentage >= 50) return "Keep improving! 📈";
    return "Keep practicing! 💪";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Error loading result
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/test-history")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Test History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/test-history")}
            className="p-2 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Test Results
            </h1>
            <p className="text-sm text-gray-600">{result.testName}</p>
          </div>
        </div>

        {/* Results Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Test Info */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {result.categoryName}
            </h2>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Completed on {formatDate(result.completedAt)}
            </p>
          </div>

          {/* Overall Score */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4">
              <div>
                <div className="text-4xl font-bold">{result.percentage}%</div>
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-1">
              {getPerformanceMessage(result.percentage)}
            </p>
            <p className="text-sm text-gray-600">
              {result.finalScore} out of {result.totalMarks} marks
            </p>
            {/* <p className="text-sm text-gray-600">
              {formatTime(result.timeSpent)} time taken
            </p> */}
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-6">
            {/* My Rank */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-700">
                {myRankData.myRank ?? 0}/{myRankData.totalParticipants ?? 0}
              </div>
              <div className="text-xs sm:text-sm text-yellow-600 font-medium">
                My Rank
              </div>
            </div>
            {/* percentile  */}
            <div className="bg-lime-50 border border-lime-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-lime-700">
                {myRankData.percentile}
              </div>
              <div className="text-xs sm:text-sm text-lime-600 font-medium">
                My Percentile
              </div>
            </div>

            {/* Time Taken */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-700">
                {formatTime(result.timeSpent)}
              </div>
              <div className="text-xs sm:text-sm text-orange-600 font-medium">
                Time Taken
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-6">
            {/* Total Questions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-700">
                {result.totalQuestions}
              </div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium">
                Total Questions
              </div>
            </div>

            {/* Attempted */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-700">
                {result.attempted}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 font-medium">
                Attempted
              </div>
            </div>
          </div>

          {/* Detailed Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Correct */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">
                {result.correct}
              </div>
              <div className="text-sm text-green-600 font-medium">Correct</div>
            </div>

            {/* Wrong */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <XCircleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">
                {result.wrong}
              </div>
              <div className="text-sm text-red-600 font-medium">Wrong</div>
            </div>

            {/* Not Attempted */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <MinusCircleIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-700">
                {result.notAttempted}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Not Attempted
              </div>
            </div>
          </div>

          {/* Marks & Accuracy Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Marks Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Marks:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {result.totalMarks}
                  </span>
                </div>
                {result.negativeMarks > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        Marks Obtained:
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {result.obtainedMarks.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-amber-600">
                        Negative Marks:
                      </span>
                      <span className="text-sm font-semibold text-amber-600">
                        -{result.negativeMarks.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Final Score:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {result.finalScore.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Accuracy */}
              <div className="flex flex-col items-center justify-center border-l-0 sm:border-l-2 border-blue-300">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                  {result.accuracy}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  Accuracy
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.finalScore.toFixed(2)}/{result.attempted} marks
                </div>
                <div className="text-xs text-gray-400">
                  from {result.attempted} attempted
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (result.testUuid) {
                  navigate(
                    `/tests/solutions/${result.testUuid}?session=${sessionId}`
                  );
                } else {
                  navigate(`/test-history/${sessionId}/solutions`);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5" />
              View Solutions
            </button>
            <button
              onClick={() =>
                navigate(
                  `/tests/leaderboard/${result?.sessionId || sessionId || categoryUuid}`
                )
              }
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrophyIcon className="h-5 w-5" />
              View leaderboard
            </button>
            <button
              onClick={() => navigate("/test-history")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChartBarIcon className="h-5 w-5" />
              Back to History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHistoryDetailPage;
