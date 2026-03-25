import {
  ArrowLeftIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  GiftIcon,
  LockClosedIcon,
  TrophyIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

interface TestSeries {
  id: number;
  uuid: string;
  name: string;
  title?: string;
  description?: string;
  pricing_type: "free" | "paid";
  price: number;
  currency: string;
  rating?: number;
  purchase_count?: number;
  is_purchased?: boolean;
  is_subscribed?: boolean;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  categories?: Category[];
}

interface Category {
  uuid: string;
  name: string;
  description?: string;
  has_subcategories: boolean;
  subcategories_count?: number;
  questions_count?: number;
  node_type?: "container" | "question_holder" | "unset";
  is_free_in_paid_series?: boolean;
}

const TestSeriesDetailPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<TestSeries | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptionAccess, setSubscriptionAccess] = useState<any>(null);
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seriesExpanded, setSeriesExpanded] = useState(false); // ✅ ADD THIS

  useEffect(() => {
    if (uuid) {
      fetchSeriesDetail();
      fetchTestHistory();
    }
  }, [uuid]);

  const fetchSeriesDetail = async () => {
    try {
      setError(null);
      // First get the series details
      const seriesResponse = await api.get(`/dynamic/test-series/${uuid}`);

      if (seriesResponse.data.success) {
        const seriesData = seriesResponse.data.data;
        setSeries(seriesData);

        // Categories are included in the response
        if (seriesData.categories) {
          setCategories(seriesData.categories);
        }

        // Fetch subscription access for this series
        try {
          const accessResponse = await api.get(
            `/subscription-access/test-series/${seriesData.id}`
          );
          if (accessResponse.data.success) {
            setSubscriptionAccess(accessResponse.data.data);
          }
        } catch (accessError) {
          console.warn("Failed to fetch subscription access:", accessError);
          // Continue without subscription data
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch series detail:", error);
      setError("Failed to load test series details");
      toast.error("Failed to load test series details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestHistory = async () => {
    try {
      const response = await api.get("/test-history", {
        params: { page: 1, limit: 100 },
      });
      console.log("📚 [TestSeriesDetail] Test history API response:", response.data);
      if (response.data.success && response.data.data.history) {
        console.log("📚 [TestSeriesDetail] History items:", response.data.data.history.length);
        console.log("📚 [TestSeriesDetail] First item sample:", response.data.data.history[0]);
        setTestHistory(response.data.data.history);
      }
    } catch (error) {
      console.warn("Failed to fetch test history:", error);
      // Continue without test history
    }
  };

  const isCategoryCompleted = (categoryUuid: string) => {
    if (!testHistory || testHistory.length === 0) {
      console.log(`🔍 [TestSeriesDetail] No test history for ${categoryUuid}`);
      return false;
    }

    const completed = testHistory.some((item: any) => {
      // Check multiple UUID fields to match (following mobile app strategy)
      const matchesCategoryUuid = item.categoryUuid === categoryUuid;
      const matchesTestUuid = item.testUuid === categoryUuid;

      console.log(`🔍 [TestSeriesDetail] Checking ${categoryUuid}:`, {
        itemCategoryUuid: item.categoryUuid,
        itemTestUuid: item.testUuid,
        matchesCategoryUuid,
        matchesTestUuid,
      });

      return matchesCategoryUuid || matchesTestUuid;
    });

    console.log(`✅ [TestSeriesDetail] Category ${categoryUuid} completed:`, completed);
    return completed;
  };

  const handlePurchase = () => {
    if (!series) return;

    window.location.href = `/payment?seriesId=${series.id
      }&title=${encodeURIComponent(
        series.name || series.title || "Test Series"
      )}&price=${series.price}&type=test-series`;
  };

  const handleCategorySelect = (category: Category) => {
    // For paid series without subscription, check access control
    if (
      series?.pricing_type === "paid" &&
      subscriptionAccess &&
      !subscriptionAccess.hasAccess
    ) {
      // Containers are always navigable (they just hold subcategories)
      if (category.node_type === "container") {
        // Allow navigation to container
        navigate(`/tests/category/${category.uuid}`, {
          state: {
            categoryName: category.name,
            seriesUuid: uuid,
            seriesName: series?.name || series?.title,
          },
        });
        return;
      }

      // Question holders - check is_free_in_paid_series flag
      if (category.node_type === "question_holder") {
        if (!category.is_free_in_paid_series) {
          // Locked test - show error
          toast.error(
            "This test requires a subscription. Please purchase to access."
          );
          return;
        }
        // Free test in paid series - allow navigation
      }
    }

    // Allow navigation (free series, has subscription, or free test in paid series)
    navigate(`/tests/category/${category.uuid}`, {
      state: {
        categoryName: category.name,
        seriesUuid: uuid,
        seriesName: series?.name || series?.title,
      },
    });
  };

  const handleStartFreeTest = () => {
    if (categories && categories.length > 0) {
      handleCategorySelect(categories[0]);
    } else {
      toast.error("No free tests are available in this series");
    }
  };

  const handleViewResults = (categoryUuid: string, categoryName: string) => {
    navigate(`/test-history/test/${categoryUuid}/attempts`, {
      state: { testName: categoryName },
    });
  };

  const CategoryCard = ({ category }: { category: Category }) => {
    // Determine access status for badge
    const isPaidSeries = series?.pricing_type === "paid";
    const hasAccess = subscriptionAccess?.hasAccess || series?.pricing_type === "free";
    const isFreeInPaid = category.is_free_in_paid_series;
    const isLocked = isPaidSeries && !hasAccess && !isFreeInPaid && category.node_type === "question_holder";
    const isAccessible = hasAccess;
    const isFree = isFreeInPaid;
    const isQuestionHolder = category.node_type === "question_holder";
    const isCompleted = isQuestionHolder && isCategoryCompleted(category.uuid);

    const handleCardClick = (e: React.MouseEvent) => {
      // Don't navigate if clicking on Result/Take Test button
      const target = e.target as HTMLElement;
      if (target.closest('.action-button')) {
        return;
      }
      handleCategorySelect(category);
    };

    const handleActionButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isCompleted) {
        handleViewResults(category.uuid, category.name);
      } else {
        handleCategorySelect(category);
      }
    };

    return (
      <div
        className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <FolderIcon className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-medium text-gray-900 truncate">
                {category.name}
              </h3>
              {/* Completion Badge */}
              {isCompleted && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-600 text-white">
                  COMPLETED
                </span>
              )}
              {/* Access Status Badges */}
              {isLocked && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  <LockClosedIcon className="h-3 w-3 mr-1" />
                  Locked
                </span>
              )}
              {isFree && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <GiftIcon className="h-3 w-3 mr-1" />
                  FREE
                </span>
              )}
              {isAccessible && isPaidSeries && !isFree && isQuestionHolder && !isCompleted && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Unlocked
                </span>
              )}
            </div>
            <div className="mt-1">
              <p className="text-sm text-gray-500">
                {category.has_subcategories
                  ? `${category.subcategories_count} subcategories`
                  : `${category.questions_count} questions`}
              </p>
            </div>
            {category.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: category.description }}>

              </p>
            )}
            {/* Result / Take Test Button for Question Holders */}
            {isQuestionHolder && !isLocked && (
              <div className="mt-3">
                <button
                  onClick={handleActionButtonClick}
                  className={`action-button w-full px-4 py-2 rounded-lg font-medium transition-colors ${isCompleted
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                >
                  {isCompleted ? "Result" : "Take Test"}
                </button>
              </div>
            )}
          </div>
          {!isQuestionHolder && (
            <ChevronRightIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          )}
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

        {/* Content Skeleton */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
          <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-16 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/tests")}
            className="p-2 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Error</h1>
        </div>

        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load test series
          </h3>
          <p className="text-gray-600 mb-6">Please try again later</p>
          <button
            onClick={fetchSeriesDetail}
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
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/tests")}
          className="p-2 rounded-lg hover:bg-gray-100 mr-3"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {series.name || series.title}
          </h1>
        </div>
      </div>

      {/* Series Information */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {series.name || series.title}
        </h2>

        {series?.description && (
          <>
            <p
              className={`text-gray-600 mb-2 leading-relaxed ${seriesExpanded ? "" : "line-clamp-6"
                }`}
              dangerouslySetInnerHTML={{ __html: series.description }}
            />

            <button
              onClick={() => setSeriesExpanded(!seriesExpanded)}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              {seriesExpanded ? "Read Less" : "Read More"}
            </button>
          </>
        )}


        {/* Stats Row */}
        <div className="flex items-center space-x-6 mb-6">
          {series.purchase_count > 0 && (
            <>
              {series.rating && (
                <div className="flex items-center">
                  <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">
                    {series.rating.toFixed(1)} rating
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {series.purchase_count} enrolled
                </span>
              </div>
            </>
          )}
          {series.difficulty_level && (
            <div className="flex items-center">
              <TrophyIcon className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-500 capitalize">
                {series.difficulty_level}
              </span>
            </div>
          )}
        </div>

        {/* Access Information */}
        <div className="mb-6">
          {subscriptionAccess?.hasAccess || series.pricing_type === "free" ? (
            <div className="flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-700">
                ✓ You have access to this series
              </span>
            </div>
          ) : (
            <div className="flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <LockClosedIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-700">
                🔒 Purchase required for full access
              </span>
            </div>
          )}
        </div>

        {/* Action Container */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {series.pricing_type === "free" || series.pricing_type === "previous_years_question_papers" ? "Free" : `₹${series.price}`}
            </span>
            {series.pricing_type === "free" || series.pricing_type === "previous_years_question_papers" ? <></> : <span className="text-base text-gray-500">
              {series.currency || "INR"}
            </span>}
          </div>

          <div className="flex items-center space-x-3">
            {series.pricing_type === "free" &&
              !subscriptionAccess?.hasAccess && (
                <button
                  onClick={handleStartFreeTest}
                  className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <GiftIcon className="h-4 w-4 mr-1" />
                  Try Free
                </button>
              )}

            {subscriptionAccess?.hasAccess ? (
              <button
                onClick={() => {
                  if (categories.length > 0) {
                    handleCategorySelect(categories[0]);
                  }
                }}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue Learning
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                className="flex items-center px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <LockClosedIcon className="h-4 w-4 mr-2" />
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Available Categories
          </h3>
          <p className="text-gray-600">
            {categories.length} categories available
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No categories available
            </h4>
            <p className="text-gray-600">Categories will be added soon</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryCard key={category.uuid} category={category} />
            ))}
          </div>
        )}
      </div>
    </div >
  );
};

export default TestSeriesDetailPage;
