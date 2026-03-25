import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalTests: number;
  completedTests: number;
  totalScore: number;
  rank: number;
  totalStudents: number;
  activeSubscriptions: number;
  recentActivity: {
    id: number;
    type: 'test' | 'pdf';
    title: string;
    date: string;
    score?: number;
    total?: number;
    percentage?: number;
  }[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<DashboardStats>({
    totalTests: 0,
    completedTests: 0,
    totalScore: 0,
    rank: 0,
    totalStudents: 0,
    activeSubscriptions: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {getGreeting()}, {user?.username || 'Student'}!
        </h1>
        <p className="text-gray-600">
          Welcome back to your learning dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Tests */}
        <Link to="/tests" className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 group-hover:text-primary-600 transition-colors">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
              <p className="text-xs text-gray-500 mt-1 group-hover:text-primary-600 transition-colors flex items-center">
                View All <ArrowRightIcon className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <AcademicCapIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Link>

        {/* Completed Tests */}
        <Link to="/test-history" className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 group-hover:text-green-600 transition-colors">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTests}</p>
              <p className="text-xs text-gray-500 mt-1 group-hover:text-green-600 transition-colors flex items-center">
                View All <ArrowRightIcon className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Link>

        {/* Active Subscriptions */}
        <Link to="/enrolled-series" className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 group-hover:text-secondary-600 transition-colors">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
              <p className="text-xs text-gray-500 mt-1 group-hover:text-secondary-600 transition-colors flex items-center">
                View All <ArrowRightIcon className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <TrophyIcon className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {stats.recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ClockIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-sm text-gray-600 mb-4">Start taking tests to see your progress here</p>
                  <Link
                    to="/tests"
                    className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Take Your First Test
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === 'test' ? 'bg-primary-100' : 'bg-primary-100'
                        }`}>
                          {activity.type === 'test' ? (
                            <AcademicCapIcon className="w-5 h-5 text-primary-600" />
                          ) : (
                            <DocumentTextIcon className="w-5 h-5 text-secondary-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      {/* {activity.percentage !== undefined && (
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            activity.percentage >= 75 ? 'bg-green-100 text-green-800' :
                            activity.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {activity.percentage}%
                          </span>
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/tests"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <AcademicCapIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-900">Take a Test</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                to="/pdfs"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="w-5 h-5 text-secondary-600" />
                  </div>
                  <span className="font-medium text-gray-900">Study Materials</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;