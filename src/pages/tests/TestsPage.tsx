import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  LockClosedIcon,
  StarIcon,
  UsersIcon,
  GiftIcon,
  PlayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  FireIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';
import HTMLContent from '../../components/common/HTMLContent';

interface TestSeries {
  id: number;
  uuid: string;
  name: string;
  title?: string;
  description?: string;
  pricing_type: 'free' | 'paid' | 'previous_years_question_papers';
  price: number;
  currency: string;
  rating?: number;
  purchase_count?: number;
  free_tests?: number;
  tests_count?: number;
  total_tests?: number;
  is_purchased?: boolean;
  is_subscribed?: boolean;
  is_featured: boolean;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  original_price?: number;
  discount_percentage?: number;
  validity_days?: number;
}

// Component for individual test series card
const TestSeriesCard = ({
  series,
  subscriptionData,
  handleSeriesClick,
  handlePurchase
}: {
  series: TestSeries;
  subscriptionData: Record<number, any>;
  handleSeriesClick: (series: TestSeries) => void;
  handlePurchase: (series: TestSeries) => void;
}) => {
  const subscriptionAccess = subscriptionData[series.id];
  const hasAccess = subscriptionAccess?.hasAccess || series.pricing_type === 'free';

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="card-hover p-6 cursor-pointer group"
      onClick={() => handleSeriesClick(series)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {series.name || series.title}
            </h3>
            {series.is_featured && (
              <div className="badge badge-yellow flex-shrink-0">
                <FireIcon className="w-3 h-3 mr-1" />
                Featured
              </div>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-2">
            {series.difficulty_level && (
              <div className={cn('badge text-xs', getDifficultyColor(series.difficulty_level))}>
                {series.difficulty_level.charAt(0).toUpperCase() + series.difficulty_level.slice(1)}
              </div>
            )}
            {series.purchase_count > 0 && (
              <div className="flex items-center">
                <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-900">{typeof series.rating === 'number' ? series.rating.toFixed(1) : '4.5'}</span>
                <span className="text-xs text-gray-500 ml-1">({series.purchase_count} reviews)</span>
              </div>
            )}
          </div>
        </div>
        {hasAccess && series.pricing_type === 'paid' && (
          <div className="badge badge-green flex-shrink-0">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Enrolled
          </div>
        )}
      </div>

      {/* Description */}
      {series.description && (
        <div className="text-sm text-gray-600 mb-4 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }} dangerouslySetInnerHTML={{ __html: series.description }}>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <PlayIcon className="h-5 w-5 text-primary-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{series.tests_count || series.total_tests || 0}</p>
          <p className="text-xs text-gray-500">Tests</p>
        </div>
        <div className="text-center p-3 bg-secondary-50 rounded-lg">
          <ClockIcon className="h-5 w-5 text-secondary-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{series.validity_days}</p>
          <p className="text-xs text-gray-500">Days</p>
        </div>
        <div className="text-center p-3 bg-emerald-50 rounded-lg">
          <CheckCircleIcon className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">Full</p>
          <p className="text-xs text-gray-500">Access</p>
        </div>
      </div>

      {/* Price and Action */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl font-bold text-gray-900">
              {series.pricing_type === 'free' ? 'Free' : `₹${series.price}`}
            </span>
            {series.original_price && series.original_price > series.price && (
              <>
                <span className="text-lg text-gray-500 line-through">₹{series.original_price}</span>
                <div className="badge bg-red-100 text-red-800">
                  {Math.round((1 - series.price / series.original_price) * 100)}% OFF
                </div>
              </>
            )}
          </div>
          {series.purchase_count > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <UsersIcon className="h-4 w-4 mr-1" />
              <span>{series.purchase_count} students enrolled</span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          {hasAccess ? (
            <Link
              to={`/tests/series/${series.uuid}`}
              className="btn btn-primary group"
            >
              Continue
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePurchase(series);
              }}
              className="btn btn-primary group"
            >
              <LockClosedIcon className="h-4 w-4 mr-2" />
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TestsPage: React.FC = () => {
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchTestSeries();
  }, [searchQuery, page]);

  const fetchTestSeries = async () => {
    try {
      setError(null);
      const response = await api.get('/dynamic/test-series', {
        params: {
          page,
          limit: 20,
          search: searchQuery || undefined
        }
      });

      if (response.data.success) {
        const series = response.data.data;
        // Filter out PYQs - they should only appear in Previous Years Papers page
        const filteredSeries = series.filter((s: TestSeries) =>
          s.pricing_type !== 'previous_years_question_papers'
        );
        setTestSeries(filteredSeries);
        setPagination(response.data.pagination);

        // Fetch subscription access for each series (use filtered series)
        const subscriptionPromises = filteredSeries.map(async (s: TestSeries) => {
          try {
            const accessResponse = await api.get(`/subscription-access/test-series/${s.id}`);
            return {
              seriesId: s.id,
              data: accessResponse.data.success ? accessResponse.data.data : null
            };
          } catch (error) {
            console.warn(`Failed to fetch subscription access for series ${s.id}:`, error);
            return { seriesId: s.id, data: null };
          }
        });

        const subscriptionResults = await Promise.all(subscriptionPromises);
        const subscriptionMap: Record<number, any> = {};
        
        subscriptionResults.forEach(result => {
          subscriptionMap[result.seriesId] = result.data;
        });
        
        setSubscriptionData(subscriptionMap);
      }
    } catch (error: any) {
      console.error('Failed to fetch test series:', error);
      setError('Failed to load test series');
      toast.error('Failed to load test series');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = (series: TestSeries) => {
    // For now, show a message since payment integration is not yet implemented
    toast.success('Payment integration coming soon! This series is currently free to access.');
    // Navigate to series detail page to explore content
    window.location.href = `/tests/series/${series.uuid}`;
  };

  const handleRetry = () => {
    setIsLoading(true);
    fetchTestSeries();
  };

  const handleSeriesClick = (series: TestSeries) => {
    // Navigate to series detail page
    window.location.href = `/tests/series/${series.uuid}`;
  };

  // Filter test series based on selected filters
  const filteredTestSeries = testSeries.filter((series) => {
    // Pricing filter
    if (selectedPricing !== 'all' && series.pricing_type !== selectedPricing) {
      return false;
    }

    // Enrollment filter
    if (selectedEnrollment !== 'all') {
      const subscriptionAccess = subscriptionData[series.id];
      const isEnrolled = subscriptionAccess?.hasAccess && series.pricing_type === 'paid';

      if (selectedEnrollment === 'enrolled' && !isEnrolled) {
        return false;
      }
      if (selectedEnrollment === 'not-enrolled' && (isEnrolled || series.pricing_type === 'free')) {
        return false;
      }
    }

    return true;
  });

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">Please try again later</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Series</h1>
            <p className="text-gray-600 text-lg">
              Choose from our comprehensive collection of test series to enhance your preparation.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
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
              placeholder="Search test series by name, subject, or topic..."
              className="form-input pl-12 pr-4 py-3 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Options */}
          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="form-label">Pricing</label>
                <select
                  className="form-input"
                  value={selectedPricing}
                  onChange={(e) => setSelectedPricing(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="form-label">Enrollment</label>
                <select
                  className="form-input"
                  value={selectedEnrollment}
                  onChange={(e) => setSelectedEnrollment(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="enrolled">Enrolled Only</option>
                  <option value="not-enrolled">Not Enrolled</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedPricing('all');
                    setSelectedEnrollment('all');
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
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTestSeries.length === 0 ? (
        // Empty State
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AcademicCapIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery || selectedPricing !== 'all' || selectedEnrollment !== 'all' ? 'No results found' : 'No test series available'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery || selectedPricing !== 'all' || selectedEnrollment !== 'all'
              ? `No test series match your current filters. Try adjusting your search or filters.`
              : 'Check back later for new test series to enhance your preparation.'}
          </p>
          {(searchQuery || selectedPricing !== 'all' || selectedEnrollment !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPricing('all');
                setSelectedEnrollment('all');
              }}
              className="btn btn-primary"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        // Test Series Grid
        <div>
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredTestSeries.length}</span> of <span className="font-semibold">{testSeries.length}</span> test series
              {searchQuery && <span> for "{searchQuery}"</span>}
            </p>
          </div>

          {/* Test Series Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestSeries.map((series) => (
              <TestSeriesCard
                key={series.uuid}
                series={series}
                subscriptionData={subscriptionData}
                handleSeriesClick={handleSeriesClick}
                handlePurchase={handlePurchase}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'btn btn-sm',
                      pageNum === page ? 'btn-primary' : 'btn-ghost'
                    )}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestsPage;