import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  FolderIcon,
  DocumentTextIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  GiftIcon,
  ArrowRightIcon,
  LockOpenIcon,
  SparklesIcon as SparklesIconOutline,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

interface CategoryDetail {
  uuid: string;
  name: string;
  name_gujarati?: string;
  description?: string;
  description_gujarati?: string;
  hierarchy_level: number;
  parent_id?: string;
  has_subcategories: boolean;
  subcategories?: SubCategory[];
  questions?: Question[];
  test_duration_minutes?: number;
  negative_marking_enabled?: boolean;
  negative_marks_per_wrong?: number;
  node_type?: 'container' | 'question_holder' | 'unset';
  is_free_in_paid_series?: boolean;
}

interface SubCategory {
  uuid: string;
  name: string;
  name_gujarati?: string;
  description?: string;
  hierarchy_level: number;
  has_subcategories: boolean;
  subcategories_count?: number;
  questions_count?: number;
  node_type: 'container' | 'question_holder' | 'unset';
  is_free_in_paid_series?: boolean;
}

interface SubscriptionAccessState {
  hasAccess: boolean;
  isPaidSeries: boolean;
  isLoading: boolean;
  testSeries?: {
    uuid: string;
    title: string;
    pricing_type: 'free' | 'paid';
    price?: number;
    currency?: string;
  };
}

interface Question {
  id: number;
  uuid: string;
  question_text: string;
  question_text_gujarati?: string;
  option_a: string;
  option_a_gujarati?: string;
  option_b: string;
  option_b_gujarati?: string;
  option_c: string;
  option_c_gujarati?: string;
  option_d: string;
  option_d_gujarati?: string;
  correct_answer: string;
  explanation?: string;
  explanation_gujarati?: string;
  marks: number;
}

const CategoryDetailPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testHistory, setTestHistory] = useState<any[]>([]);

  // Subscription state
  const [subscriptionAccess, setSubscriptionAccess] = useState<SubscriptionAccessState>({
    hasAccess: false,
    isPaidSeries: false,
    isLoading: true,
  });

  // Modal state
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [lockedTestName, setLockedTestName] = useState('');

  // Get navigation data from location state
  const { categoryName, seriesUuid, seriesName } = location.state || {};

  useEffect(() => {
    if (uuid) {
      fetchCategoryDetail();
      fetchTestHistory();
    }
  }, [uuid]);

  // Fetch subscription access on page load
  useEffect(() => {
    if (seriesUuid) {
      fetchSubscriptionAccess();
    }
  }, [seriesUuid]);

  const fetchSubscriptionAccess = async () => {
    try {
      const response = await api.get(`/subscription-access/test-series/${seriesUuid}`);
      if (response.data.success) {
        setSubscriptionAccess({
          hasAccess: response.data.data.hasAccess,
          isPaidSeries: response.data.data.testSeries.pricing_type === 'paid',
          isLoading: false,
          testSeries: response.data.data.testSeries,
        });
      }
    } catch (error) {
      console.error('Failed to check subscription access:', error);
      setSubscriptionAccess((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const fetchCategoryDetail = async () => {
    try {
      setError(null);
      const response = await api.get(`/dynamic/categories/${uuid}`);

      if (response.data.success) {
        const responseData = response.data.data;
        // The API returns { category, content_type, content, breadcrumb, statistics }
        setCategory({
          ...responseData.category,
          has_subcategories: responseData.content_type === 'categories',
          subcategories: responseData.content_type === 'categories' ? responseData.content : [],
          questions: responseData.content_type === 'questions' ? responseData.content : []
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch category detail:', error);
      setError('Failed to load category details');
      toast.error('Failed to load category details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestHistory = async () => {
    try {
      const response = await api.get('/test-history', {
        params: { page: 1, limit: 100 },
      });
      console.log('📚 [CategoryDetail] Test history API response:', response.data);
      if (response.data.success && response.data.data.history) {
        console.log('📚 [CategoryDetail] History items:', response.data.data.history.length);
        console.log('📚 [CategoryDetail] First item sample:', response.data.data.history[0]);
        setTestHistory(response.data.data.history);
      }
    } catch (error) {
      console.warn('Failed to fetch test history:', error);
      // Continue without test history
    }
  };

  const isCurrentCategoryCompleted = (): boolean => {
    if (!testHistory || testHistory.length === 0 || !uuid) {
      console.log(`🔍 [CategoryDetail] No test history for ${uuid}`);
      return false;
    }

    const completed = testHistory.some((item: any) => {
      // Check multiple UUID fields to match
      const matchesCategoryUuid = item.categoryUuid === uuid;
      const matchesTestUuid = item.testUuid === uuid;

      console.log(`🔍 [CategoryDetail] Checking ${uuid}:`, {
        itemCategoryUuid: item.categoryUuid,
        itemTestUuid: item.testUuid,
        matchesCategoryUuid,
        matchesTestUuid,
      });

      return matchesCategoryUuid || matchesTestUuid;
    });

    console.log(`✅ [CategoryDetail] Category ${uuid} completed:`, completed);
    return completed;
  };

  // Helper to determine if a subcategory is accessible
  const isSubcategoryAccessible = (subcategory: SubCategory): boolean => {
    // Free series - all accessible
    if (!subscriptionAccess.isPaidSeries) return true;

    // Paid series with subscription - all accessible
    if (subscriptionAccess.hasAccess) return true;

    // Paid series without subscription
    // Containers are always navigable (no lock)
    if (subcategory.node_type === 'container') return true;

    // Question holders - check is_free_in_paid_series
    if (subcategory.node_type === 'question_holder') {
      return subcategory.is_free_in_paid_series === true;
    }

    // Default: not accessible
    return false;
  };

  const handleSubcategorySelect = (subcategory: SubCategory) => {
    const isAccessible = isSubcategoryAccessible(subcategory);

    // If not accessible, show subscription modal
    if (subscriptionAccess.isPaidSeries && !isAccessible) {
      setLockedTestName(subcategory.name);
      setShowSubscriptionModal(true);
      return;
    }

    // Navigate to subcategory
    navigate(`/tests/category/${subcategory.uuid}`, {
      state: {
        categoryName: subcategory.name,
        seriesUuid,
        seriesName,
        parentCategoryName: category?.name
      }
    });
  };

  const handleViewResults = () => {
    if (!uuid || !category) return;
    navigate(`/test-history/test/${uuid}/attempts`, {
      state: { testName: category.name },
    });
  };

  const handleReattempt = () => {
    // Re-attempt means starting the quiz fresh
    handleStartQuiz();
  };

  const handleStartQuiz = async () => {
    console.log('🎮 Starting quiz - Debug info:', {
      category: category?.name,
      seriesUuid,
      seriesName,
      questionsCount: category?.questions?.length,
      nodeType: category?.node_type,
      isFreeInPaidSeries: category?.is_free_in_paid_series
    });

    if (!category || !category.questions || category.questions.length === 0) {
      toast.error('No questions available in this category');
      return;
    }

    // Check subscription access using the same logic as subcategory navigation
    if (subscriptionAccess.isPaidSeries && !subscriptionAccess.hasAccess) {
      // If this is a free sample in a paid series, allow access
      if (category.is_free_in_paid_series === true) {
        console.log('✅ Free sample in paid series - allowing quiz');
      } else {
        // Not a free sample - block access
        console.log('❌ Locked test - blocking access');
        toast.error('This test requires a subscription. Please purchase the test series to access this content.');
        return;
      }
    }

    console.log('✅ Navigating to quiz page');
    navigate(`/tests/quiz/${uuid}`, {
      state: {
        categoryName: category.name,
        seriesName,
        questionCount: category.questions.length
      }
    });
  };

  const SubcategoryCard = ({ subcategory }: { subcategory: SubCategory }) => {
    const isQuestionHolder = subcategory.node_type === 'question_holder';
    const isContainer = subcategory.node_type === 'container';
    const isAccessible = isSubcategoryAccessible(subcategory);
    const isFreeInPaid =
      subscriptionAccess.isPaidSeries &&
      !subscriptionAccess.hasAccess &&
      isQuestionHolder &&
      subcategory.is_free_in_paid_series;
    const isLocked =
      subscriptionAccess.isPaidSeries &&
      !subscriptionAccess.hasAccess &&
      isQuestionHolder &&
      !isAccessible;
    const isCompleted = testHistory.some(item => item?.categoryUuid === subcategory?.uuid);

    return (
      <div
        className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${isLocked ? 'opacity-70 border-dashed border-gray-300 bg-gray-50' : 'border-gray-100'
          }`}
        onClick={() => handleSubcategorySelect(subcategory)}
      >
        <div className="flex items-center">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isLocked ? 'bg-gray-200' : 'bg-primary-100'
              }`}
          >
            {isLocked ? (
              <LockClosedIcon className="h-5 w-5 text-gray-500" />
            ) : isContainer ? (
              <FolderIcon className="h-5 w-5 text-primary-600" />
            ) : (
              <DocumentTextIcon className="h-5 w-5 text-primary-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3
                className={`text-base font-medium truncate ${isLocked ? 'text-gray-500' : 'text-gray-900'
                  }`}
              >
                {subcategory.name}
              </h3>

              {/* FREE Badge */}
              {isFreeInPaid && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-green-700 bg-green-100 border border-green-200">
                  <GiftIcon className="h-3 w-3" />
                  FREE
                </span>
              )}

              {/* LOCKED Badge */}
              {isLocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200">
                  <LockClosedIcon className="h-3 w-3" />
                  LOCKED
                </span>
              )}
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-primary-600 bg-primary-100 border border-primary-200">
                  <LockClosedIcon className="h-3 w-3" />
                  COMPLETED
                </span>
              )}
            </div>

            <div className="mt-1">
              <p className="text-sm text-gray-500">
                {subcategory.has_subcategories
                  ? `${subcategory.subcategories_count} subcategories`
                  : `${subcategory.questions_count} questions`}
              </p>
            </div>

            {subcategory.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: subcategory.description }}>
                {/* {subcategory.description} */}
              </p>
            )}
          </div>

          {/* Arrow */}
          <ChevronRightIcon
            className={`h-5 w-5 flex-shrink-0 ${isLocked ? 'text-gray-300' : 'text-gray-400'
              }`}
          />
        </div>
      </div>
    );
  };

  const QuizCard = ({ questions }: { questions: Question[] }) => {
    const isCompleted = isCurrentCategoryCompleted();

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
              <PlayIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isCompleted ? 'Quiz Completed' : 'Start Quiz'}
                </h3>
                {isCompleted && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-600 text-white">
                    COMPLETED
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  <span>{questions.length} questions</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>
                    {category?.test_duration_minutes
                      ? `${category.test_duration_minutes} min`
                      : `${Math.ceil(questions.length * 1.5)} min`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Free Practice
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mt-3">
          <p className="text-sm text-gray-600">
            Practice questions from <strong>{category?.name}</strong> category. Test your knowledge and improve your understanding.
          </p>
        </div>

        {/* Action Buttons */}
        {isCompleted ? (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleViewResults}
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <DocumentTextIcon className="h-5 w-5" />
              View Results
            </button>
            <button
              onClick={handleReattempt}
              className="flex-1 px-4 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <PlayIcon className="h-5 w-5" />
              Re-attempt
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartQuiz}
            className="w-full mt-4 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <PlayIcon className="h-5 w-5" />
            Start Quiz
          </button>
        )}
      </div>
    );
  };

  const BreadcrumbNav = () => (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <button
        onClick={() => navigate('/tests')}
        className="hover:text-gray-700 transition-colors"
      >
        Test Series
      </button>
      <ChevronRightIcon className="h-4 w-4" />
      {seriesName && (
        <>
          <button
            onClick={() => navigate(`/tests/series/${seriesUuid}`)}
            className="hover:text-gray-700 transition-colors truncate max-w-32"
          >
            {seriesName}
          </button>
          <ChevronRightIcon className="h-4 w-4" />
        </>
      )}
      <span className="font-medium text-gray-900 truncate">
        {category?.name || categoryName || 'Category'}
      </span>
    </nav>
  );

  // Subscription Required Modal Component
  const SubscriptionRequiredModal = () => {
    if (!showSubscriptionModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setShowSubscriptionModal(false)}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            {/* Close Button */}
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Premium Content
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              Subscribe to unlock unlimited access to all tests and features in this series.
            </p>

            {/* Locked Test Badge */}
            {lockedTestName && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
                <LockClosedIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium truncate">
                  {lockedTestName}
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Later
              </button>
              <button
                onClick={() => {
                  setShowSubscriptionModal(false);
                  navigate(`/tests/series/${seriesUuid}`);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mr-3"></div>
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full h-20 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Error</h1>
        </div>

        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load category</h3>
          <p className="text-gray-600 mb-6">Please try again later</p>
          <button
            onClick={fetchCategoryDetail}
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Subscription Required Modal */}
      <SubscriptionRequiredModal />

      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 mr-3"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {category.name}
          </h1>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <BreadcrumbNav />

      {/* Category Description */}
      {category.description && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: category.description }}>
            {/* {category.description} */}
          </p>
        </div>
      )}

      {/* Subcategories */}
      {category.has_subcategories && category.subcategories && category.subcategories.length > 0 && (() => {
        // Filter out unset types
        const visibleSubcategories = category.subcategories.filter(
          (sub) => sub.node_type !== 'unset'
        );

        return visibleSubcategories.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Subcategories ({visibleSubcategories.length})
            </h2>
            <div className="space-y-4">
              {visibleSubcategories.map((subcategory) => (
                <SubcategoryCard key={subcategory.uuid} subcategory={subcategory} />
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Quiz/Questions */}
      {category.questions && category.questions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Practice Quiz ({category.questions.length} questions)
          </h2>
          <QuizCard questions={category.questions} />
        </div>
      )}

      {/* Empty State */}
      {(!category.subcategories || category.subcategories.length === 0) &&
        (!category.questions || category.questions.length === 0) && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
            <p className="text-gray-600">This category doesn't have any subcategories or tests yet.</p>
          </div>
        )}

      {/* Unlock All Tests Button */}
      {subscriptionAccess.isPaidSeries && !subscriptionAccess.hasAccess && (
        <button
          onClick={() => navigate(`/tests/series/${seriesUuid}`)}
          className="w-full mt-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <LockOpenIcon className="h-5 w-5" />
          <span>Unlock All Tests in This Series</span>
          <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default CategoryDetailPage;