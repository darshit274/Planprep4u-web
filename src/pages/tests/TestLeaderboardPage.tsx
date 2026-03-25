import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import {
  ArrowLeftIcon,
  TrophyIcon,
  UserIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { en } from 'zod/v4/locales';

interface LeaderboardEntry {
  id: number;
  user_id: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  unanswered: number;
  percentage: number;
  time_taken_seconds: number;
  rank?: number;
  percentile?: number;
  completion_date: string;
  is_current_user: boolean;
  user?: {
    uuid: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

interface LeaderboardData {
  category: {
    id: number;
    uuid: string;
    name: string;
  };
  leaderboard: LeaderboardEntry[];
  user_rank: number | null;
  total_participants: number;
  dataSource?: 'real' | 'demo';
}

const TestLeaderboardPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get test result data from location state
  const { categoryName, userScore, totalQuestions } = location.state || {};

  useEffect(() => {
    if (uuid) {
      fetchLeaderboard();
    }
  }, [uuid]);

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard data from API for test series:', uuid);

      // Try to fetch real leaderboard data from the test-series specific API
      const response = await api.get(`/leaderboard/test-series/${uuid}`);

      if (response.data.success) {
        console.log('API response:', response.data);

        if (response.data.data.length > 0) {
          console.log('API returned participant data:', response.data);
          const totalParticipants = response.data.data.length;

          // Transform the real API data to match our interface
          const realLeaderboard = response.data.data.map((entry: any, index: number) => ({
            id: index + 1,
            user_id: entry.userId?.toString() || `user-${index + 1}`,
            username: entry.name || `User ${index + 1}`,
            fullName: entry.name || `User ${index + 1}`,
            avatarUrl: entry.avatar,
            rank: entry.rank || (index + 1),
            score: entry.finalScore ?? (entry.totalScore || 0),
            total_questions: entry.totalQuestions || 10,
            correct_answers: entry.correctAnswers || 0,
            wrong_answers: (entry.totalQuestions || 10) - (entry.correctAnswers || 0),
            unanswered: 0,
            percentage: entry.percentage || ((entry.correctAnswers || 0) / (entry.totalQuestions || 10)) * 100,
            time_taken_seconds: entry.timeTaken || 120,
            percentile: entry.percentile,
            completion_date: entry.completionDate || new Date().toISOString(),
            is_current_user: entry.userId === JSON.parse(sessionStorage.getItem("planprep4u_user") || "{}").uuid,
            user: {
              uuid: entry.userId?.toString() || `user-${index + 1}`,
              username: entry.name || `User ${index + 1}`,
              fullName: entry.name || `User ${index + 1}`,
              avatarUrl: entry.avatar
            }
          }));

          const leaderboardData: LeaderboardData = {
            category: {
              id: 1,
              uuid: uuid!,
              name: categoryName || 'Quiz Category'
            },
            leaderboard: realLeaderboard,
            user_rank: null,
            total_participants: realLeaderboard.length,
            dataSource: 'real'
          };

          setLeaderboardData(leaderboardData);
          console.log('Using real leaderboard data successfully');
        } else {
          // No participants yet - show empty state
          console.log('No participants found for this test series yet');
          const emptyLeaderboardData: LeaderboardData = {
            category: {
              id: 1,
              uuid: uuid!,
              name: categoryName || 'Quiz Category'
            },
            leaderboard: [],
            user_rank: null,
            total_participants: 0,
            dataSource: 'empty'
          };
          setLeaderboardData(emptyLeaderboardData);
        }
      } else {
        console.log('API call failed');
        // Fallback for API errors - could show demo data or error state
        const transformedLeaderboard = response.data.data.map((entry: any, index: number) => ({
          id: index + 1,
          user_id: entry.userId?.toString() || `user-${index + 1}`,
          username: index === 0 ? (user?.username || 'You') : entry.name, // First entry becomes current user
          fullName: index === 0 ? (user?.fullName || user?.username || 'Your Performance') : entry.name,
          avatarUrl: entry.avatar,
          rank: entry.rank || (index + 1),
          score: index === 0 ? (userScore || entry.totalScore || 0) : entry.totalScore || 0,
          total_questions: entry.totalQuestions || 10,
          correct_answers: index === 0 ? (userScore || entry.correctAnswers || 0) : entry.correctAnswers || 0,
          wrong_answers: entry.totalQuestions ?
            (entry.totalQuestions - (index === 0 ? (userScore || entry.correctAnswers || 0) : entry.correctAnswers || 0)) :
            (10 - (index === 0 ? (userScore || entry.correctAnswers || 0) : entry.correctAnswers || 0)),
          unanswered: 0,
          percentage: index === 0 ?
            Math.round(((userScore || entry.correctAnswers || 0) / (totalQuestions || entry.totalQuestions || 10)) * 100) :
            entry.percentage || ((entry.correctAnswers || 0) / (entry.totalQuestions || 10)) * 100,
          time_taken_seconds: entry.timeTaken || 120,
          percentile: Math.max(10, 100 - (index * 10)),
          completion_date: entry.completionDate || new Date().toISOString(),
          is_current_user: index === 0, // First entry is current user
          user: {
            uuid: entry.userId?.toString() || `user-${index + 1}`,
            username: index === 0 ? (user?.username || 'You') : entry.name,
            fullName: index === 0 ? (user?.fullName || user?.username || 'Your Performance') : entry.name,
            avatarUrl: entry.avatar
          }
        }));

        // Calculate user's actual rank based on their score
        const userActualScore = userScore || transformedLeaderboard[0]?.score || 0;
        let calculatedUserRank = 1;

        // Find where the user would rank based on their actual score
        for (let i = 0; i < transformedLeaderboard.length; i++) {
          if (transformedLeaderboard[i].score > userActualScore) {
            calculatedUserRank = i + 2; // +2 because we want the rank after this higher score
          } else {
            break;
          }
        }

        const demoLeaderboardData: LeaderboardData = {
          category: {
            id: 1,
            uuid: uuid!,
            name: categoryName || 'Quiz Category'
          },
          leaderboard: transformedLeaderboard,
          user_rank: calculatedUserRank,
          total_participants: transformedLeaderboard.length,
          dataSource: 'demo'
        };

        setLeaderboardData(demoLeaderboardData);
      }
    } catch (error: any) {
      console.error('Failed to fetch leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-600';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">No leaderboard data found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const userEntry = leaderboardData.leaderboard.find(entry => entry.is_current_user);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 mr-3"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrophyIcon className="h-8 w-8 text-secondary-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Score Card</h1>
          </div>
          <p className="text-gray-600">{leaderboardData.category.name}</p>
          <div className="flex items-center justify-center space-x-3 mt-1">
            <p className="text-sm text-gray-500">
              {leaderboardData.total_participants} participants
            </p>
            {leaderboardData.dataSource === 'demo' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Demo Data
              </span>
            )}
            {leaderboardData.dataSource === 'real' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Live Results
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Your Performance Card */}
      {userEntry && (
        <div className="bg-gradient-to-r from-secondary-500 to-primary-600 rounded-2xl p-6 text-white mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Your Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold">{getRankIcon(userEntry.rank)}</p>
                <p className="text-sm opacity-90">Rank {userEntry.rank}</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{userEntry.percentile}</p>
                <p className="text-sm opacity-90">Percentile</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{formatTime(userEntry.time_taken_seconds)}</p>
                <p className="text-sm opacity-90">Time</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            {leaderboardData.leaderboard.length > 0 ? 'Top Performers' : 'Participants'}
          </h3>
        </div>

        {leaderboardData.leaderboard.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center">
            <TrophyIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No participants yet</h3>
            <p className="text-gray-500 mb-6">Be the first to take a test in this series and claim the top spot!</p>
            <button
              onClick={() => navigate(`/tests/quiz/${uuid}`)}
              className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              Take Test Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leaderboardData.leaderboard.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`p-6 transition-colors ${entry.is_current_user
                  ? 'bg-primary-50 border-l-4 border-primary-500'
                  : 'hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 text-center">
                      <span className={`text-2xl font-bold ${getRankColor(entry.rank)}`}>
                        {getRankIcon(entry.rank)}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.is_current_user ? 'bg-primary-100' : 'bg-gray-100'
                        }`}>
                        <UserIcon className={`h-5 w-5 ${entry.is_current_user ? 'text-primary-600' : 'text-gray-600'
                          }`} />
                      </div>
                      <div>
                        <p className={`font-medium ${entry.is_current_user ? 'text-primary-900' : 'text-gray-900'
                          }`}>
                          {entry.username}
                          {entry.is_current_user && (
                            <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {/* {entry.correct_answers}/{entry.total_questions} correct • {entry.percentage}% • {entry.percentile}th percentile */}
                          {entry.score}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-4 text-sm text-gray-500">
                      {/* <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{formatTime(entry.time_taken_seconds)}</span>
                    </div> */}
                      <div className="flex items-center">
                        <StarIcon className={`h-4 w-4 mr-1 ${entry.percentage >= 70 ? 'text-green-500' :
                          entry.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
                          }`} />
                        <span>{entry.percentile}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(entry.completion_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => navigate(`/tests/quiz/${uuid}`)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retake Quiz
        </button>
        <button
          onClick={() => navigate(`/tests/solutions/${uuid}`, {
            state: {
              categoryName: leaderboardData.category.name,
              userAnswers: {},
              score: userEntry?.score || 0,
              percentage: userEntry?.percentage || 0
            }
          })}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          View Solutions
        </button>
      </div>
    </div>
  );
};

export default TestLeaderboardPage;