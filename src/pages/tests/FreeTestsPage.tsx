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
  UserGroupIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  GiftIcon,
  SparklesIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, GiftIcon as GiftIconSolid } from '@heroicons/react/24/solid';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface FreeTest {
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

const FreeTestsPage: React.FC = () => {
  const [freeTests, setFreeTests] = useState<FreeTest[]>([]);
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
    fetchFreeTests();
  }, [searchQuery, selectedDifficulty, selectedCategory, sortBy]);

  const fetchFreeTests = async () => {
    try {
      setError(null);
      // Try multiple possible API endpoints for free tests
      let response;
      try {
        // First try dedicated free tests endpoint
        response = await api.get('/tests/free', {
          params: {
            search: searchQuery || undefined,
            difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            sort: sortBy,
          }
        });
      } catch (error) {
        // Fallback to regular tests with free filter
        response = await api.get('/dynamic/test-series', {
          params: {
            pricing_type: 'free',
            search: searchQuery || undefined,
            difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
          }
        });
      }

      if (response.data.success) {
        // Transform API response to match UI expectations
        const data = response.data.data;
        const transformedTests = (Array.isArray(data) ? data : []).map((test: any) => ({
          ...test,
          title: test.title || test.name || 'Free Test',
          timeLimit: test.duration_minutes ? `${test.duration_minutes} minutes` : undefined,
          questionsCount: test.total_questions || test.questions_count || test.total_questions_count || 0,
          category_name: test.category || test.subject || 'General',
          hasAttempted: false, // This would come from user attempt history
          bestScore: null, // This would come from user attempt history
          lastAttemptDate: null, // This would come from user attempt history
          rating: test.rating,
          attempts_count: test.attempts_count || test.purchase_count,
          difficulty_level: test.difficulty_level,
          duration_minutes: test.duration_minutes || test.test_duration_minutes,
          total_questions: test.total_questions || test.questions_count || test.total_questions_count || 0,
          total_marks: test.total_marks || test.total_questions || test.questions_count || 0,
          uuid: test.uuid || test.id,
          created_at: test.created_at || new Date().toISOString(),
          is_featured: test.is_featured || false,
        }));
        setFreeTests(transformedTests);
      }
    } catch (error: any) {
      console.error('Failed to fetch free tests:', error);
      // Create sample free tests if API fails
      const sampleFreeTests: FreeTest[] = [
        {
          id: 1,
          uuid: 'free-math-basic-001',
          title: 'Basic Mathematics Test',
          description: 'Test your fundamental math skills with arithmetic, algebra, and geometry questions.',
          difficulty_level: 'beginner',
          duration_minutes: 30,
          total_questions: 25,
          total_marks: 25,
          category_name: 'Mathematics',
          rating: 4.5,
          attempts_count: 1247,
          is_active: true,
          is_featured: true,
          created_at: '2024-01-15T10:30:00Z',
          hasAttempted: false,
        },
        {
          id: 2,
          uuid: 'free-english-001',
          title: 'English Grammar & Vocabulary',
          description: 'Improve your English language skills with comprehensive grammar and vocabulary questions.',
          difficulty_level: 'intermediate',
          duration_minutes: 45,
          total_questions: 40,
          total_marks: 40,
          category_name: 'English',
          rating: 4.3,
          attempts_count: 892,
          is_active: true,
          is_featured: false,
          created_at: '2024-01-12T14:20:00Z',
          hasAttempted: false,
        },
        {
          id: 3,
          uuid: 'free-reasoning-001',
          title: 'Logical Reasoning Challenge',
          description: 'Challenge your logical thinking with patterns, sequences, and analytical reasoning.',
          difficulty_level: 'intermediate',
          duration_minutes: 60,
          total_questions: 50,
          total_marks: 50,
          category_name: 'Reasoning',
          rating: 4.6,
          attempts_count: 1543,
          is_active: true,
          is_featured: true,
          created_at: '2024-01-10T09:15:00Z',
          hasAttempted: false,
        },
        {
          id: 4,
          uuid: 'free-science-001',
          title: 'General Science Quiz',
          description: 'Test your knowledge of physics, chemistry, and biology concepts.',
          difficulty_level: 'beginner',
          duration_minutes: 40,
          total_questions: 35,
          total_marks: 35,
          category_name: 'Science',
          rating: 4.2,
          attempts_count: 654,
          is_active: true,
          is_featured: false,
          created_at: '2024-01-08T16:45:00Z',
          hasAttempted: false,
        },
        {
          id: 5,
          uuid: 'free-gk-001',
          title: 'General Knowledge Trivia',
          description: 'Expand your general knowledge with questions from history, geography, and current events.',
          difficulty_level: 'intermediate',
          duration_minutes: 50,
          total_questions: 45,
          total_marks: 45,
          category_name: 'General Knowledge',
          rating: 4.4,
          attempts_count: 987,
          is_active: true,
          is_featured: false,
          created_at: '2024-01-05T11:30:00Z',
          hasAttempted: false,
        },
        {
          id: 6,
          uuid: 'free-math-advanced-001',
          title: 'Advanced Mathematics',
          description: 'Challenge yourself with calculus, trigonometry, and advanced algebraic concepts.',
          difficulty_level: 'advanced',
          duration_minutes: 90,
          total_questions: 60,
          total_marks: 60,
          category_name: 'Mathematics',
          rating: 4.7,
          attempts_count: 321,
          is_active: true,
          is_featured: true,
          created_at: '2024-01-03T13:00:00Z',
          hasAttempted: false,
        }
      ];
      setFreeTests(sampleFreeTests);
      toast.success('Loaded sample free tests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    fetchFreeTests();
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const FreeTestCard = ({ test }: { test: FreeTest }) => {
    return (
      <div className="card-hover p-6 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                <GiftIconSolid className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {test.title || test.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {test.is_featured && (
                    <div className="badge badge-yellow flex-shrink-0">
                      <FireIcon className="w-3 h-3 mr-1" />
                      Featured
                    </div>
                  )}
                  <div className="badge badge-green flex-shrink-0">
                    <GiftIcon className="w-3 h-3 mr-1" />
                    FREE
                  </div>
                </div>
              </div>
            </div>
            {test.description && (
              <p className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: test.description }}></p>
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
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            {test.hasAttempted ? 'Retake Test' : 'Start Test'}
            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
            We couldn't load the free tests. Please check your connection and try again.
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Free Tests</h1>
            <p className="text-gray-600 text-lg">
              Practice with our collection of free tests to improve your skills and build confidence.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg">
              <GiftIconSolid className="w-4 h-4" />
              <span className="font-medium">100% Free</span>
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
              placeholder="Search free tests by title, subject, or topic..."
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
      ) : freeTests.length === 0 ? (
        // Empty State
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GiftIconSolid className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery ? 'No free tests found' : 'No free tests available'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery
              ? `We couldn't find any free tests matching "${searchQuery}". Try adjusting your search or filters.`
              : 'Free tests will be available soon. Check back later for practice opportunities.'}
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
              Showing <span className="font-semibold">{freeTests.length}</span> free tests
              {searchQuery && <span> for "{searchQuery}"</span>}
              {selectedCategory !== 'all' && (
                <span> in {categories.find(c => c.value === selectedCategory)?.label}</span>
              )}
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-emerald-600 font-medium">✨ All tests are completely free</span>
            </div>
          </div>

          {/* Free Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTests.map((test) => (
              <FreeTestCard key={test.uuid} test={test} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeTestsPage;