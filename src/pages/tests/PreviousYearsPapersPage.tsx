import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  PlayIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  FireIcon,
  BookOpenIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, DocumentTextIcon as DocumentTextIconSolid } from '@heroicons/react/24/solid';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface PYQTest {
  id: number;
  uuid: string;
  title: string;
  name?: string;
  description?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  category?: string;
  subject?: string;
  rating?: number;
  attempts_count?: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  // Computed properties
  timeLimit?: string;
  questionsCount?: number;
  category_name?: string;
  hasAttempted?: boolean;
  bestScore?: number;
  lastAttemptDate?: string;
}

const PreviousYearsPapersPage: React.FC = () => {
  const [pyqTests, setPyqTests] = useState<PYQTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  const categories = [
    { value: 'all', label: 'All Categories', icon: BookOpenIcon },
    { value: 'mathematics', label: 'Mathematics', icon: AcademicCapIcon },
    { value: 'science', label: 'Science', icon: SparklesIcon },
    { value: 'english', label: 'English', icon: BookOpenIcon },
    { value: 'reasoning', label: 'Reasoning', icon: QuestionMarkCircleIcon },
    { value: 'general-knowledge', label: 'General Knowledge', icon: CalendarIcon },
  ];

  const difficultyLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'easy', label: 'Easiest First' },
    { value: 'hard', label: 'Hardest First' },
    { value: 'short', label: 'Shortest First' },
    { value: 'long', label: 'Longest First' },
  ];

  useEffect(() => {
    fetchPYQTests();
  }, [searchQuery, selectedDifficulty, selectedCategory, sortBy]);

  const fetchPYQTests = async () => {
    try {
      setError(null);
      // Fetch from the dedicated previous-years endpoint
      const response = await api.get('/tests/previous-years', {
        params: {
          search: searchQuery || undefined,
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sort: sortBy,
        }
      });

      if (response.data.success) {
        // Transform API response to match UI expectations
        const data = response.data.data;
        // The API returns { tests: [], pagination: {} }
        const testsArray = data.tests || [];
        const transformedTests = testsArray.map((test: any) => ({
          ...test,
          id: test.id,
          uuid: test.uuid,
          title: test.title || test.name || 'Previous Years Paper',
          name: test.name,
          description: test.description,
          difficulty_level: test.difficulty_level,
          duration_minutes: test.estimated_duration || test.duration_minutes || 0,
          total_questions: test.total_questions || 0,
          total_marks: test.total_questions || 0,
          category_name: test.category || test.subject || 'General',
          rating: test.rating,
          attempts_count: test.attempts_count || 0,
          is_active: test.is_active,
          is_featured: test.is_featured || false,
          created_at: test.created_at || new Date().toISOString(),
          hasAttempted: false,
          bestScore: null,
          lastAttemptDate: null,
        }));
        setPyqTests(transformedTests);
      }
    } catch (error: any) {
      console.error('Failed to fetch previous years papers:', error);
      setError('Failed to load previous years papers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    fetchPYQTests();
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const PYQTestCard = ({ test }: { test: PYQTest }) => {
    return (
      <div className="card-hover p-6 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
                <DocumentTextIconSolid className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900">
                  {test.title || test.name}
                </h3>
              </div>
            </div>
            {test.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4" dangerouslySetInnerHTML={{ __html: test.description }}></p>
            )}
          </div>
        </div>

        {/* Previous Attempt Info */}
        {test.hasAttempted && (
          <div className="mb-4 p-3 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircleIcon className="w-4 h-4 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-primary-900">Previously Attempted</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary-900">{test.bestScore}%</p>
                <p className="text-xs text-primary-600">Best Score</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end">
          <Link
            to={`/tests/series/${test.uuid}`}
            className="btn btn-primary group w-full justify-center"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/tests/series/${test.uuid}`;
            }}
          >
            <ArrowRightIcon className="w-4 h-4 mr-2" />
            View Series
          </Link>
        </div>
      </div>
    );
  };

  // Error State
  if (error) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We couldn't load the previous years papers. Please check your connection and try again.
          </p>
          <button onClick={handleRetry} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Previous Years Papers</h1>
            <p className="text-gray-600 text-lg">
              Practice with actual exam papers from previous years to master your preparation.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2 bg-secondary-50 text-secondary-700 px-3 py-2 rounded-lg">
              <DocumentTextIconSolid className="w-4 h-4" />
              <span className="font-medium">PYQ Papers</span>
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn btn-outline"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              Filters
              <ChevronDownIcon className={cn('h-4 w-4 ml-2 transition-transform', isFilterOpen && 'rotate-180')} />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search previous years papers by title, subject, or topic..."
              className="form-input pl-12 pr-4 py-3 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Options */}
          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Difficulty Level</label>
                <select
                  className="form-input"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Sort By</label>
                <select
                  className="form-input"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSortBy('newest');
                    setSearchQuery('');
                  }}
                  className="btn btn-ghost w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        // Loading State
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pyqTests.length === 0 ? (
        // Empty State
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <DocumentTextIconSolid className="h-10 w-10 text-secondary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery ? 'No previous years papers found' : 'No previous years papers available'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery
              ? `We couldn't find any previous years papers matching "${searchQuery}". Try adjusting your search or filters.`
              : 'Previous years papers will be available soon. Check back later for practice opportunities.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="btn btn-primary"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{pyqTests.length}</span> previous years papers
              {searchQuery && <span> for "{searchQuery}"</span>}
              {selectedCategory !== 'all' && (
                <span> in {categories.find(c => c.value === selectedCategory)?.label}</span>
              )}
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-secondary-600 font-medium">📄 Actual exam papers</span>
            </div>
          </div>

          {/* PYQ Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pyqTests.map((test) => (
              <PYQTestCard key={test.uuid} test={test} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousYearsPapersPage;
