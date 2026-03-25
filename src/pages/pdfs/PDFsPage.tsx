import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentIcon,
  EyeIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  BookOpenIcon,
  AcademicCapIcon,
  DocumentArrowDownIcon,
  LockClosedIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  SparklesIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface PDF {
  id: string;
  title: string;
  description: string;
  category_id: string | null;
  file_size: number;
  download_count: number;
  view_count: number;
  access_level: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_featured: boolean;
  // Pricing fields
  price?: number;
  currency?: string;
  is_free?: boolean;
  discount_percentage?: number;
  subscription_required?: boolean;
  preview_pages?: number;
  // Computed properties for UI compatibility
  category?: string;
  fileSize?: string;
  downloadCount?: number;
  isDownloaded?: boolean;
  isPremium?: boolean;
  hasAccess?: boolean;
  uploadDate?: string;
  originalPrice?: number;
  discountedPrice?: number;
}

const PDFsPage: React.FC = () => {
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Categories', icon: FolderIcon, count: 0, color: 'bg-gray-100 text-gray-800' },
    { value: 'notes', label: 'Study Notes', icon: DocumentTextIcon, count: 0, color: 'bg-primary-100 text-primary-800' },
    { value: 'books', label: 'Reference Books', icon: BookOpenIcon, count: 0, color: 'bg-emerald-100 text-emerald-800' },
    { value: 'papers', label: 'Question Papers', icon: AcademicCapIcon, count: 0, color: 'bg-secondary-100 text-secondary-800' },
    { value: 'guides', label: 'Study Guides', icon: DocumentArrowDownIcon, count: 0, color: 'bg-amber-100 text-amber-800' },
  ];

  const accessLevels = [
    { value: 'all', label: 'All Access' },
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'downloads', label: 'Most Downloads' },
    { value: 'name', label: 'Name A-Z' },
  ];

  useEffect(() => {
    fetchPDFs();
  }, [selectedCategory, searchQuery]);

  // Check user's access to a specific PDF
  const checkPDFAccess = async (pdfId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/subscription-access/pdf/${pdfId}`);
      if (response.data.success) {
        return response.data.data.hasAccess;
      }
      return false;
    } catch (error) {
      console.error(`Failed to check access for PDF ${pdfId}:`, error);
      return false; // Default to no access if check fails
    }
  };

  const fetchPDFs = async () => {
    try {
      const response = await api.get('/pdfs', {
        params: {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined
        }
      });

      if (response.data.success) {
        // Transform API response to match UI expectations
        console.log('Raw PDF data from API:', response.data.data.slice(0, 2)); // Show first 2 PDFs for debugging

        const transformedPdfs = await Promise.all(
          response.data.data.map(async (pdf: any) => {
            const originalPrice = parseFloat(pdf.price || 0);
            const discountPercentage = parseFloat(pdf.discount_percentage || 0);
            const discountedPrice = discountPercentage > 0
              ? originalPrice * (1 - discountPercentage / 100)
              : originalPrice;

            // Determine access status
            let hasAccess = false;
            if (pdf.is_free === true || pdf.access_level === 'free') {
              hasAccess = true; // Free PDFs are always accessible
            } else if (pdf.access_level === 'premium') {
              // For premium PDFs, check user's subscription status
              hasAccess = await checkPDFAccess(pdf.id);
            }

            console.log(`PDF: ${pdf.title}`, {
              rawPrice: pdf.price,
              originalPrice,
              discountPercentage,
              discountedPrice,
              is_free: pdf.is_free,
              access_level: pdf.access_level,
              hasAccess
            });

            return {
              ...pdf,
              category: pdf.category_id || 'General',
              fileSize: `${Math.round(pdf.file_size / 1024)} KB`,
              downloadCount: pdf.download_count,
              isDownloaded: false, // This would be determined by user data
              isPremium: pdf.access_level === 'premium' || (!pdf.is_free && originalPrice > 0),
              hasAccess,
              uploadDate: pdf.created_at,
              originalPrice,
              discountedPrice: discountedPrice !== originalPrice ? discountedPrice : null
            };
          })
        );
        setPdfs(transformedPdfs);
      }
    } catch (error: any) {
      console.error('Failed to fetch PDFs:', error);
      toast.error('Failed to load PDFs');
    } finally {
      setIsLoading(false);
    }
  };

  // Removed handleDownload function for security

  const handlePreview = (pdf: PDF) => {
    console.log('handlePreview called for PDF:', {
      title: pdf.title,
      isPremium: pdf.isPremium,
      hasAccess: pdf.hasAccess,
      is_free: pdf.is_free,
      access_level: pdf.access_level,
      price: pdf.price
    });

    if (!pdf.hasAccess && pdf.isPremium) {
      if (pdf.preview_pages && pdf.preview_pages > 0) {
        // Allow limited preview
        navigate(`/pdfs/${pdf.id}`, {
          state: {
            pdfTitle: pdf.title,
            pdfCategory: pdf.category,
            isPreview: true,
            previewPages: pdf.preview_pages
          }
        });
      } else {
        toast.error('Please purchase this PDF to view it');
      }
      return;
    }

    // Navigate to frontend secure PDF viewer page
    navigate(`/pdfs/${pdf.id}`, {
      state: {
        pdfTitle: pdf.title,
        pdfCategory: pdf.category
      }
    });
  };

  const handlePurchase = (pdf: PDF) => {
    // Only proceed to payment if PDF is premium AND user doesn't have access
    if (!pdf.isPremium || pdf.hasAccess) {
      console.log('Skipping payment - PDF is either free or user already has access');
      console.log({ isPremium: pdf.isPremium, hasAccess: pdf.hasAccess, is_free: pdf.is_free, access_level: pdf.access_level });
      return;
    }

    // Navigate to payment page with PDF details
    navigate('/payment', {
      state: {
        type: 'pdf',
        item: pdf,
        amount: pdf.discountedPrice || pdf.originalPrice || 0,
        currency: pdf.currency || 'INR',
        title: `Purchase ${pdf.title}`,
        description: pdf.description
      }
    });
  };

  const PDFCard = ({ pdf, isListView = false }: { pdf: PDF; isListView?: boolean }) => {
    const category = categories.find(cat => cat.value === selectedCategory) || categories[0];

    if (isListView) {
      return (
        <div className="card p-4 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => handlePreview(pdf)}>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">{pdf.title}</h3>
                {pdf.is_featured && (
                  <div className="badge badge-yellow">
                    <StarIcon className="w-3 h-3 mr-1" />
                    Featured
                  </div>
                )}
                {pdf.isPremium && (
                  <div className={cn('badge', pdf.hasAccess ? 'badge-green' : 'badge-blue')}>
                    {pdf.hasAccess ? (
                      <><CheckCircleIcon className="w-3 h-3 mr-1" />Owned</>
                    ) : (
                      <><SparklesIcon className="w-3 h-3 mr-1" />Premium</>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">{pdf.description}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <FolderIcon className="w-3 h-3 mr-1" />
                  {pdf.category}
                </span>
                <span className="flex items-center">
                  <DocumentIcon className="w-3 h-3 mr-1" />
                  {pdf.fileSize}
                </span>
                <span className="flex items-center">
                  <UserGroupIcon className="w-3 h-3 mr-1" />
                  {pdf.downloadCount} downloads
                </span>
                <span className="flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {new Date(pdf.uploadDate || '').toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {pdf.tags && pdf.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  {pdf.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="badge bg-gray-100 text-gray-700 text-xs">
                      {tag}
                    </span>
                  ))}
                  {pdf.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{pdf.tags.length - 2}</span>
                  )}
                </div>
              )}

              {pdf.isPremium && !pdf.hasAccess && (
                <div className="text-right mr-3">
                  {pdf.discountedPrice && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500 line-through">
                        ₹{pdf.originalPrice}
                      </span>
                      <span className="badge badge-red text-xs">
                        -{pdf.discount_percentage}%
                      </span>
                    </div>
                  )}
                  <div className="text-sm font-bold text-gray-900">
                    ₹{pdf.discountedPrice || pdf.originalPrice}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                {pdf.isPremium && !pdf.hasAccess ? (
                  <>
                    {pdf.preview_pages && pdf.preview_pages > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(pdf);
                        }}
                        className="btn btn-outline btn-sm"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Preview
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(pdf);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <ShoppingCartIcon className="w-4 h-4 mr-1" />
                      Buy
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(pdf);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card-hover p-6 cursor-pointer group" onClick={() => handlePreview(pdf)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <DocumentTextIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">{pdf.title}</h3>
                {pdf.is_featured && (
                  <div className="badge badge-yellow">
                    <StarIcon className="w-3 h-3 mr-1" />
                    Featured
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{pdf.description}</p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            {pdf.isPremium && (
              <div className={cn('badge', pdf.hasAccess ? 'badge-green' : 'badge-blue')}>
                {pdf.hasAccess ? (
                  <><CheckCircleIcon className="w-3 h-3 mr-1" />Owned</>
                ) : (
                  <><SparklesIcon className="w-3 h-3 mr-1" />Premium</>
                )}
              </div>
            )}
            {pdf.isPremium && !pdf.hasAccess && (
              <div className="text-right">
                {pdf.discountedPrice && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500 line-through">
                      ₹{pdf.originalPrice}
                    </span>
                    <span className="badge badge-red text-xs">
                      -{pdf.discount_percentage}%
                    </span>
                  </div>
                )}
                <div className="text-lg font-bold text-gray-900">
                  ₹{pdf.discountedPrice || pdf.originalPrice}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <DocumentIcon className="w-4 h-4 text-primary-600 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{pdf.fileSize}</p>
            <p className="text-xs text-gray-500">Size</p>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <UserGroupIcon className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{pdf.downloadCount}</p>
            <p className="text-xs text-gray-500">Downloads</p>
          </div>
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <EyeIcon className="w-4 h-4 text-secondary-600 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{pdf.view_count || 0}</p>
            <p className="text-xs text-gray-500">Views</p>
          </div>
        </div>

        {/* Tags */}
        {pdf.tags && pdf.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <TagIcon className="w-4 h-4 text-gray-400 mt-0.5" />
            {pdf.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="badge bg-gray-100 text-gray-700 text-xs">
                {tag}
              </span>
            ))}
            {pdf.tags.length > 3 && (
              <span className="text-xs text-gray-500 mt-1">+{pdf.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              Uploaded {new Date(pdf.uploadDate || '').toLocaleDateString()}
            </div>
            {pdf.isPremium && !pdf.hasAccess && pdf.preview_pages && pdf.preview_pages > 0 && (
              <div className="text-xs text-primary-600 mt-1">
                Preview {pdf.preview_pages} pages free
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {pdf.isPremium && !pdf.hasAccess ? (
              <>
                {pdf.preview_pages && pdf.preview_pages > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(pdf);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Preview
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(pdf);
                  }}
                  className="btn btn-primary"
                >
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Buy Now
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(pdf);
                }}
                className="btn btn-primary"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                {pdf.hasAccess ? 'View PDF' : 'View'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center">
            <div className="loading-spinner w-12 h-12 mb-4"></div>
            <p className="text-gray-600">Loading study materials...</p>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials</h1>
            <p className="text-gray-600 text-lg">
              Access comprehensive study materials, notes, and reference books to enhance your learning.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
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
              placeholder="Search study materials by title, subject, or topic..."
              className="form-input pl-12 pr-4 py-3 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={cn(
                    'flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    selectedCategory === category.value
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  )}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.label}
                  {category.count > 0 && (
                    <span className="ml-2 bg-white rounded-full px-2 py-0.5 text-xs">
                      {category.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Advanced Filters */}
          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="form-label">Access Level</label>
                <select
                  className="form-input"
                  value={selectedAccessLevel}
                  onChange={(e) => setSelectedAccessLevel(e.target.value)}
                >
                  {accessLevels.map((level) => (
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
                    setSelectedAccessLevel('all');
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
      {pdfs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <DocumentTextIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery ? 'No materials found' : 'No study materials available'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery
              ? `We couldn't find any study materials matching "${searchQuery}". Try adjusting your search or filters.`
              : selectedCategory === 'all'
              ? 'Study materials will be available soon. Check back later for new resources.'
              : `No materials found in the ${categories.find(c => c.value === selectedCategory)?.label} category.`}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedAccessLevel('all');
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
              Showing <span className="font-semibold">{pdfs.length}</span> study materials
              {searchQuery && <span> for "{searchQuery}"</span>}
              {selectedCategory !== 'all' && (
                <span> in {categories.find(c => c.value === selectedCategory)?.label}</span>
              )}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>View:</span>
              <span className="font-medium text-gray-900 capitalize">{viewMode}</span>
            </div>
          </div>

          {/* PDFs Grid/List */}
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}>
            {pdfs.map((pdf) => (
              <PDFCard key={pdf.id} pdf={pdf} isListView={viewMode === 'list'} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFsPage;