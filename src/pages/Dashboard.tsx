import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  UserGroupIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalTests: 12,
    completedTests: 8,
    totalPdfs: 24,
    rank: 156,
    totalStudents: 10234,
    studyStreak: 15
  };

  const recentActivity = [
    {
      id: 1,
      type: 'test',
      title: 'Mathematics Mock Test 3',
      score: 87,
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'pdf',
      title: 'Physics Chapter 5 Notes',
      timestamp: '1 day ago',
      status: 'downloaded'
    },
    {
      id: 3,
      type: 'test',
      title: 'Chemistry Practice Test',
      score: 92,
      timestamp: '2 days ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Reached 15-day study streak!',
      timestamp: '3 days ago',
      status: 'achievement'
    }
  ];

  const upcomingTests = [
    {
      id: 1,
      title: 'Physics Final Mock Test',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '3 hours',
      difficulty: 'Advanced'
    },
    {
      id: 2,
      title: 'Chemistry Weekly Test',
      date: '2024-01-17',
      time: '2:00 PM',
      duration: '2 hours',
      difficulty: 'Intermediate'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Alex! 👋
              </h1>
              <p className="text-gray-600">
                Track your progress and continue your learning journey
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-lg">
                <FireIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{stats.studyStreak} day streak</span>
              </div>
              <Link
                to="/tests"
                className="btn btn-primary"
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Take Test
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Tests */}
              <div className="card p-6 group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <AcademicCapIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    12%
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalTests}</div>
                <div className="text-gray-600 text-sm">Total Tests</div>
              </div>

              {/* Completed Tests */}
              <div className="card p-6 group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    8%
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.completedTests}</div>
                <div className="text-gray-600 text-sm">Completed Tests</div>
              </div>

              {/* PDFs Downloaded */}
              <div className="card p-6 group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <DocumentTextIcon className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    15%
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPdfs}</div>
                <div className="text-gray-600 text-sm">PDFs Downloaded</div>
              </div>

              {/* Rank */}
              <div className="card p-6 group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <TrophyIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    23
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">#{stats.rank}</div>
                <div className="text-gray-600 text-sm">Your Rank</div>
              </div>
            </div>

            {/* Performance Chart Section */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
                <div className="flex items-center space-x-2">
                  <button className="btn btn-sm btn-outline">7 Days</button>
                  <button className="btn btn-sm btn-secondary">30 Days</button>
                  <button className="btn btn-sm btn-outline">90 Days</button>
                </div>
              </div>

              {/* Simple Chart Placeholder */}
              <div className="h-64 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Performance chart will be displayed here</p>
                  <p className="text-sm text-gray-400">Integration with Chart.js or similar library</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <Link to="/activity" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                  View All
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'test' ? 'bg-primary-100' :
                      activity.type === 'pdf' ? 'bg-primary-100' :
                      'bg-green-100'
                    }`}>
                      {activity.type === 'test' && <AcademicCapIcon className="w-5 h-5 text-primary-600" />}
                      {activity.type === 'pdf' && <DocumentTextIcon className="w-5 h-5 text-secondary-600" />}
                      {activity.type === 'achievement' && <TrophyIcon className="w-5 h-5 text-green-600" />}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.timestamp}</p>
                    </div>

                    {activity.score && (
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          activity.score >= 90 ? 'bg-green-100 text-green-800' :
                          activity.score >= 75 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.score}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/tests"
                  className="w-full btn btn-primary justify-start"
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Take a Test
                </Link>
                <Link
                  to="/pdfs"
                  className="w-full btn btn-outline justify-start"
                >
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Browse PDFs
                </Link>
                <Link
                  to="/profile/performance"
                  className="w-full btn btn-outline justify-start"
                >
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Upcoming Tests */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Tests</h3>
              <div className="space-y-4">
                {upcomingTests.map((test) => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <h4 className="font-medium text-gray-900 mb-2">{test.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {test.date} at {test.time}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {test.duration}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`badge ${
                          test.difficulty === 'Advanced' ? 'badge-red' :
                          test.difficulty === 'Intermediate' ? 'badge-yellow' :
                          'badge-green'
                        }`}>
                          {test.difficulty}
                        </span>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Start Test
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Streak */}
            <div className="card p-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Study Streak</h3>
                <FireIcon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold mb-2">{stats.studyStreak} Days</div>
              <p className="text-orange-100 text-sm mb-4">
                Keep going! You're doing great.
              </p>
              <div className="w-full bg-orange-300/30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-orange-100 mt-2">5 more days to reach next milestone</p>
            </div>

            {/* Leaderboard Preview */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performers</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      rank === 2 ? 'bg-gray-100 text-gray-800' :
                      rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {rank}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Student {rank}</div>
                      <div className="text-xs text-gray-600">
                        {Math.floor(Math.random() * 1000) + 800} points
                      </div>
                    </div>
                    {rank <= 3 && (
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                ))}
              </div>
              <Link
                to="/leaderboard"
                className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4"
              >
                View Full Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;