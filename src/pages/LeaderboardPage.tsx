import React, { useEffect, useState } from 'react';
import { TrophyIcon, UserIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface LeaderboardEntry {
  rank: number;
  userId: string | number;
  name: string;
  totalScore: number;
  testsCompleted: number;
  avatar?: string;
  percentage?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  completionDate?: string;
  testSeriesName?: string;
  isDemo?: boolean;
}

interface LeaderboardResponse {
  success: boolean;
  message: string;
  data: LeaderboardEntry[];
  metadata: {
    total: number;
    limit: number;
    hasMore: boolean;
    dataSource: 'real' | 'demo' | 'leaderboard' | 'sessions';
  };
}

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [metadata, setMetadata] = useState<LeaderboardResponse['metadata'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get<LeaderboardResponse>('/leaderboard');
      if (response.data.success) {
        setLeaderboard(response.data.data);
        setMetadata(response.data.metadata);
      }
    } catch (error: any) {
      console.error('Failed to fetch leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <TrophyIcon className="w-8 h-8 mr-3 text-yellow-500" />
          Leaderboard
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            See how you rank against other students
          </p>
          {metadata && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Showing {metadata.total} {metadata.total === 1 ? 'student' : 'students'}
              </span>
              {metadata.dataSource === 'demo' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Demo Data
                </span>
              )}
              {metadata.dataSource === 'real' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Live Results
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <TrophyIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rankings Yet</h3>
            <p className="text-gray-600">
              Complete some tests to see rankings appear here
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score & Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tests Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Attempt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.userId}
                    className={`hover:bg-gray-50 ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && (
                          <span className="text-2xl mr-2">🥇</span>
                        )}
                        {index === 1 && (
                          <span className="text-2xl mr-2">🥈</span>
                        )}
                        {index === 2 && (
                          <span className="text-2xl mr-2">🥉</span>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {entry.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={entry.avatar}
                              alt={entry.name}
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {entry.totalScore} points
                        </div>
                        {entry.percentage && (
                          <div className="text-xs text-gray-600">
                            {entry.percentage.toFixed(1)}% accuracy
                          </div>
                        )}
                        {/* {entry.correctAnswers && entry.totalQuestions && (
                          <div className="text-xs text-green-600 flex items-center">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            {entry.correctAnswers}/{entry.totalQuestions} correct
                          </div>
                        )} */}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.testsCompleted}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.testsCompleted === 1 ? 'test' : 'tests'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {entry.completionDate && (
                          <div className="text-xs text-gray-600 flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {formatDate(entry.completionDate)}
                          </div>
                        )}
                        {entry.testSeriesName && (
                          <div className="text-xs text-primary-600 max-w-32 truncate">
                            {entry.testSeriesName}
                          </div>
                        )}
                        {!entry.completionDate && !entry.testSeriesName && (
                          <div className="text-xs text-gray-400">
                            No recent activity
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;