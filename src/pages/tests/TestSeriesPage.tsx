import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon,
  PlayIcon,
  FireIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface TestSeries {
  id: string;
  title: string;
  description: string;
  rating: number;
  totalTests: number;
  duration: string;
  price: number;
  originalPrice?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  isEnrolled: boolean;
  isFree: boolean;
  isPopular?: boolean;
  completionRate: number;
  studentsEnrolled: number;
  lastUpdated: string;
  tags: string[];
}

const TestSeriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API calls
  const categories = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const testSeries: TestSeries[] = [
    {
      id: '1',
      title: 'Complete Mathematics Mastery',
      description: 'Comprehensive mathematics test series covering all topics from basic algebra to advanced calculus',
      rating: 4.8,
      totalTests: 25,
      duration: '3 months',
      price: 499,
      originalPrice: 999,
      difficulty: 'Intermediate',
      category: 'Mathematics',
      isEnrolled: true,
      isFree: false,
      isPopular: true,
      completionRate: 68,
      studentsEnrolled: 1250,
      lastUpdated: '2024-01-10',
      tags: ['Algebra', 'Calculus', 'Geometry']
    },
    {
      id: '2',
      title: 'Physics Fundamentals',
      description: 'Master the core concepts of physics with interactive tests and detailed explanations',
      rating: 4.9,
      totalTests: 18,
      duration: '2 months',
      price: 0,
      difficulty: 'Beginner',
      category: 'Physics',
      isEnrolled: false,
      isFree: true,
      completionRate: 0,
      studentsEnrolled: 890,
      lastUpdated: '2024-01-08',
      tags: ['Mechanics', 'Thermodynamics', 'Optics']
    },
    {
      id: '3',
      title: 'Advanced Chemistry',
      description: 'Deep dive into organic, inorganic, and physical chemistry with advanced problem solving',
      rating: 4.7,
      totalTests: 30,
      duration: '4 months',
      price: 799,
      originalPrice: 1299,
      difficulty: 'Advanced',
      category: 'Chemistry',
      isEnrolled: false,
      isFree: false,
      completionRate: 0,
      studentsEnrolled: 567,
      lastUpdated: '2024-01-12',
      tags: ['Organic', 'Inorganic', 'Physical']
    }
  ];

  const filteredTestSeries = testSeries.filter(series => {
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         series.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || series.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || series.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Series</h1>
              <p className="text-gray-600">
                Choose from our comprehensive collection of test series to boost your preparation
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-600">
                {filteredTestSeries.length} series available
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search test series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input min-w-[120px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="form-input min-w-[120px]"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                Filters
                <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Series Grid */}
      <div className="page-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestSeries.map((series) => (
            <div key={series.id} className="card-interactive group overflow-hidden">
              {/* Card Header */}
              <div className="relative p-6 pb-4">
                {/* Badge for popular/free */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {series.isPopular && (
                    <span className="badge badge-red flex items-center">
                      <FireIcon className="w-3 h-3 mr-1" />
                      Popular
                    </span>
                  )}
                  {series.isFree && (
                    <span className="badge badge-green">Free</span>
                  )}
                </div>

                {/* Category Icon */}
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {series.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {series.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {series.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{series.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpenIcon className="w-4 h-4 mr-1" />
                      <span>{series.totalTests} tests</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (for enrolled courses) */}
                {series.isEnrolled && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{series.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${series.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    {series.isFree ? (
                      <span className="text-2xl font-bold text-green-600">Free</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-gray-900">₹{series.price}</span>
                        {series.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">₹{series.originalPrice}</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center space-x-2">
                    {series.isEnrolled ? (
                      <Link
                        to={`/tests/series/${series.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        <PlayIcon className="w-4 h-4 mr-1" />
                        Continue
                      </Link>
                    ) : (
                      <Link
                        to={`/payment?series=${series.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        {series.isFree ? 'Start Free' : 'Enroll Now'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestSeriesPage;