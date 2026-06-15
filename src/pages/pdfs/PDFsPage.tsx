import React, { useEffect, useState, useMemo } from 'react';
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
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  LockClosedIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  SparklesIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  access_level: 'free' | 'premium';
  price: number;
  currency: string;
  pdf_count: number;
  isPremium: boolean;
}

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
  price?: number;
  currency?: string;
  is_free?: boolean;
  discount_percentage?: number;
  preview_pages?: number;
  category?: string;
  fileSize?: string;
  downloadCount?: number;
  isPremium?: boolean;
  hasAccess?: boolean;
  uploadDate?: string;
  originalPrice?: number;
  discountedPrice?: number | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  '#3B82F6': 'bg-blue-50 border-blue-200 text-blue-700',
  '#10B981': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  '#F59E0B': 'bg-amber-50 border-amber-200 text-amber-700',
  '#EF4444': 'bg-red-50 border-red-200 text-red-700',
  '#8B5CF6': 'bg-violet-50 border-violet-200 text-violet-700',
  '#EC4899': 'bg-pink-50 border-pink-200 text-pink-700',
  '#06B6D4': 'bg-cyan-50 border-cyan-200 text-cyan-700',
  '#84CC16': 'bg-lime-50 border-lime-200 text-lime-700',
};

function getCategoryStyle(color: string) {
  return CATEGORY_COLORS[color] || 'bg-primary-50 border-primary-200 text-primary-700';
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'name', label: 'Name A-Z' },
];

const accessLevels = [
  { value: 'all', label: 'All Access' },
  { value: 'free', label: 'Free' },
  { value: 'premium', label: 'Premium' },
];

const PDFsPage: React.FC = () => {
  const navigate = useNavigate();

  // ─── Category view state ───────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // ─── PDF list state ────────────────────────────────────────────
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [pdfsLoading, setPdfsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ─── Fetch root categories on mount ────────────────────────────
  useEffect(() => {
    fetchCategories();
  }, []);

  // ─── Fetch PDFs when a category is selected ────────────────────
  useEffect(() => {
    if (selectedCategory) {
      fetchPDFs(selectedCategory.id);
    } else {
      setPdfs([]);
    }
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.get('/pdfs/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const checkPDFAccess = async (pdfId: string): Promise<boolean> => {
    try {
      const res = await api.get(`/subscription-access/pdf/${pdfId}`);
      return res.data?.data?.hasAccess ?? false;
    } catch {
      return false;
    }
  };

  const fetchPDFs = async (categoryId: string) => {
    setPdfsLoading(true);
    try {
      const res = await api.get('/pdfs', {
        params: {
          category_id: categoryId,
          search: searchQuery || undefined,
        },
      });

      if (res.data.success) {
        const transformed = await Promise.all(
          res.data.data.map(async (pdf: any) => {
            const originalPrice = parseFloat(pdf.price || 0);
            const discountPct = parseFloat(pdf.discount_percentage || 0);
            const discountedPrice = discountPct > 0 ? originalPrice * (1 - discountPct / 100) : originalPrice;

            let hasAccess = false;
            if (pdf.is_free === true || pdf.access_level === 'free') {
              hasAccess = true;
            } else if (pdf.access_level === 'premium') {
              hasAccess = await checkPDFAccess(pdf.id);
            }

            return {
              ...pdf,
              category: pdf.category_id || 'General',
              fileSize: `${Math.round(pdf.file_size / 1024)} KB`,
              downloadCount: pdf.download_count,
              isDownloaded: false,
              isPremium: pdf.access_level === 'premium' || (!pdf.is_free && originalPrice > 0),
              hasAccess,
              uploadDate: pdf.created_at,
              originalPrice,
              discountedPrice: discountedPrice !== originalPrice ? discountedPrice : null,
            };
          })
        );
        setPdfs(transformed);
      }
    } catch {
      toast.error('Failed to load PDFs');
    } finally {
      setPdfsLoading(false);
    }
  };

  // ─── Client-side filter + sort ─────────────────────────────────
  const filteredAndSortedPdfs = useMemo(() => {
    let result = [...pdfs];

    if (selectedAccessLevel !== 'all') {
      result = result.filter(p => p.access_level === selectedAccessLevel);
    }

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'popular':
        result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case 'downloads':
        result.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [pdfs, selectedAccessLevel, sortBy]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handlePreview = (pdf: PDF) => {
    if (!pdf.hasAccess && pdf.isPremium) {
      if (pdf.preview_pages && pdf.preview_pages > 0) {
        navigate(`/pdfs/${pdf.id}`, { state: { pdfTitle: pdf.title, isPreview: true, previewPages: pdf.preview_pages } });
      } else {
        toast.error('Please purchase this PDF to view it');
      }
      return;
    }
    navigate(`/pdfs/${pdf.id}`, { state: { pdfTitle: pdf.title, pdfCategory: pdf.category } });
  };

  const handlePurchase = () => {
    if (!selectedCategory || !selectedCategory.isPremium) return;
    // Purchase the ROOT FOLDER — one payment unlocks all PDFs inside it
    navigate('/payment', {
      state: {
        type: 'pdf_folder',
        item: {
          id: selectedCategory.id,
          name: selectedCategory.name,
          price: selectedCategory.price,
        },
        amount: selectedCategory.price,
        currency: selectedCategory.currency || 'INR',
        title: `Unlock ${selectedCategory.name}`,
        description: `Get unlimited access to all PDFs in ${selectedCategory.name}`,
      },
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSelectedAccessLevel('all');
    setSortBy('newest');
    setIsFilterOpen(false);
    setPdfs([]);
  };

  // ─── Loading ───────────────────────────────────────────────────
  if (categoriesLoading) {
    return (
      <div className="page-container flex items-center justify-center py-24">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading study materials...</p>
        </div>
      </div>
    );
  }

  // ─── Category grid view ────────────────────────────────────────
  if (!selectedCategory) {
    return (
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials</h1>
          <p className="text-gray-600 text-lg">
            Choose a category to browse study materials, notes, and reference books.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No categories yet</h3>
            <p className="text-gray-500">Study material categories will appear here once added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const styleClass = getCategoryStyle(cat.color);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'text-left rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500',
                    styleClass
                  )}
                >
                  {/* Icon + Access badge row */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: cat.color + '22' }}
                    >
                      <FolderIcon className="w-7 h-7" style={{ color: cat.color }} />
                    </div>
                    {cat.isPremium ? (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        <SparklesIcon className="w-3 h-3" />
                        {cat.currency === 'INR' ? '₹' : '$'}{cat.price}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Free
                      </span>
                    )}
                  </div>

                  {/* Name + description */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{cat.description}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/10">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <DocumentTextIcon className="w-4 h-4" />
                      {cat.pdf_count} {cat.pdf_count === 1 ? 'PDF' : 'PDFs'}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                      Browse
                      <ChevronRightIcon className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── PDF list view (category selected) ────────────────────────
  const PDFCard = ({ pdf, isListView = false }: { pdf: PDF; isListView?: boolean }) => {
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
                {pdf.is_featured && <span className="badge badge-yellow"><StarIcon className="w-3 h-3 mr-1" />Featured</span>}
                {pdf.isPremium && (
                  <span className={cn('badge', pdf.hasAccess ? 'badge-green' : 'badge-blue')}>
                    {pdf.hasAccess ? <><CheckCircleIcon className="w-3 h-3 mr-1" />Owned</> : <><SparklesIcon className="w-3 h-3 mr-1" />Premium</>}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">{pdf.description}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center"><DocumentIcon className="w-3 h-3 mr-1" />{pdf.fileSize}</span>
                <span className="flex items-center"><UserGroupIcon className="w-3 h-3 mr-1" />{pdf.downloadCount} downloads</span>
                <span className="flex items-center"><ClockIcon className="w-3 h-3 mr-1" />{new Date(pdf.uploadDate || '').toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {Array.isArray(pdf.tags) && pdf.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  {pdf.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="badge bg-gray-100 text-gray-700 text-xs">{tag}</span>
                  ))}
                  {pdf.tags.length > 2 && <span className="text-xs text-gray-500">+{pdf.tags.length - 2}</span>}
                </div>
              )}
              {pdf.isPremium && !pdf.hasAccess && (
                <div className="text-right mr-3">
                  <div className="text-sm font-bold text-gray-900">
                    ₹{pdf.discountedPrice || pdf.originalPrice}
                  </div>
                </div>
              )}
              <div className="flex space-x-2">
                {pdf.isPremium && !pdf.hasAccess ? (
                  <>
                    {pdf.preview_pages && pdf.preview_pages > 0 && (
                      <button onClick={e => { e.stopPropagation(); handlePreview(pdf); }} className="btn btn-outline btn-sm">
                        <EyeIcon className="w-4 h-4 mr-1" />Preview
                      </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); handlePurchase(); }} className="btn btn-primary btn-sm">
                      <ShoppingCartIcon className="w-4 h-4 mr-1" />Unlock All
                    </button>
                  </>
                ) : (
                  <button onClick={e => { e.stopPropagation(); handlePreview(pdf); }} className="btn btn-primary btn-sm">
                    <EyeIcon className="w-4 h-4 mr-1" />View
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card-hover p-6 cursor-pointer group flex flex-col h-full" onClick={() => handlePreview(pdf)}>
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="w-11 h-11 flex-shrink-0 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <DocumentTextIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{pdf.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{pdf.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1 flex-shrink-0">
            {pdf.is_featured && <span className="badge badge-yellow text-xs"><StarIcon className="w-3 h-3 mr-1" />Featured</span>}
            {pdf.isPremium && (
              <span className={cn('badge text-xs', pdf.hasAccess ? 'badge-green' : 'badge-blue')}>
                {pdf.hasAccess ? <><CheckCircleIcon className="w-3 h-3 mr-1" />Owned</> : <><SparklesIcon className="w-3 h-3 mr-1" />Premium</>}
              </span>
            )}
            {pdf.isPremium && !pdf.hasAccess && pdf.originalPrice && pdf.originalPrice > 0 && (
              <div className="text-right">
                {pdf.discountedPrice && <span className="text-xs text-gray-400 line-through mr-1">₹{pdf.originalPrice}</span>}
                <span className="text-base font-bold text-gray-900">₹{pdf.discountedPrice || pdf.originalPrice}</span>
              </div>
            )}
          </div>
        </div>

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

        {Array.isArray(pdf.tags) && pdf.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <TagIcon className="w-4 h-4 text-gray-400 mt-0.5" />
            {pdf.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="badge bg-gray-100 text-gray-700 text-xs">{tag}</span>
            ))}
            {pdf.tags.length > 3 && <span className="text-xs text-gray-500 mt-1">+{pdf.tags.length - 3} more</span>}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="text-xs text-gray-500 flex items-center">
            <ClockIcon className="w-3 h-3 mr-1" />
            Uploaded {new Date(pdf.uploadDate || '').toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            {pdf.isPremium && !pdf.hasAccess ? (
              <>
                {pdf.preview_pages && pdf.preview_pages > 0 && (
                  <button onClick={e => { e.stopPropagation(); handlePreview(pdf); }} className="btn btn-outline btn-sm">
                    <EyeIcon className="w-4 h-4 mr-1" />Preview
                  </button>
                )}
                <button onClick={e => { e.stopPropagation(); handlePurchase(); }} className="btn btn-primary">
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />Unlock All
                </button>
              </>
            ) : (
              <button onClick={e => { e.stopPropagation(); handlePreview(pdf); }} className="btn btn-primary">
                <EyeIcon className="w-4 h-4 mr-2" />
                {pdf.hasAccess ? 'View PDF' : 'View'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button
          onClick={handleBackToCategories}
          className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Study Materials
        </button>
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        <span
          className="font-semibold px-2 py-0.5 rounded-md"
          style={{ backgroundColor: selectedCategory.color + '22', color: selectedCategory.color }}
        >
          {selectedCategory.name}
        </span>
      </div>

      {/* Category header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: selectedCategory.color + '22' }}
          >
            <FolderIcon className="w-7 h-7" style={{ color: selectedCategory.color }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h1>
            {selectedCategory.description && (
              <p className="text-gray-500 text-sm">{selectedCategory.description}</p>
            )}
          </div>
          {selectedCategory.isPremium ? (
            <span className="flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              <SparklesIcon className="w-4 h-4" />
              ₹{selectedCategory.price}
            </span>
          ) : (
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Free
            </span>
          )}
        </div>

        {/* View toggle + filter */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 rounded-md transition-colors', viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-gray-900')}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 rounded-md transition-colors', viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-gray-900')}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="btn btn-outline">
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            Filters
            <ChevronDownIcon className={cn('h-4 w-4 ml-2 transition-transform', isFilterOpen && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Search + filters panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search in ${selectedCategory.name}...`}
            className="form-input pl-12 pr-4 py-3"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="form-label">Access Level</label>
              <select className="form-input" value={selectedAccessLevel} onChange={e => setSelectedAccessLevel(e.target.value)}>
                {accessLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Sort By</label>
              <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setSelectedAccessLevel('all'); setSortBy('newest'); setSearchQuery(''); }}
                className="btn btn-ghost w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Folder purchase banner — shown only when folder is premium and user hasn't bought it */}
      {selectedCategory.isPremium && pdfs.length > 0 && pdfs.some(p => !p.hasAccess) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
          <div className="flex items-start gap-3">
            <SparklesIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">
                Unlock all {pdfs.length} PDFs for ₹{selectedCategory.price}
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                One payment gives you permanent access to every PDF in {selectedCategory.name}.
              </p>
            </div>
          </div>
          <button
            onClick={handlePurchase}
            className="flex-shrink-0 btn btn-primary"
          >
            <ShoppingCartIcon className="w-4 h-4 mr-2" />
            Unlock All — ₹{selectedCategory.price}
          </button>
        </div>
      )}

      {/* PDF list */}
      {pdfsLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner w-10 h-10 mb-3 mx-auto"></div>
            <p className="text-gray-500">Loading PDFs...</p>
          </div>
        </div>
      ) : filteredAndSortedPdfs.length === 0 ? (
        <div className="text-center py-20">
          <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No PDFs found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? `No results for "${searchQuery}" in ${selectedCategory.name}.`
              : selectedAccessLevel !== 'all'
              ? `No ${selectedAccessLevel} PDFs in this category.`
              : `No PDFs in ${selectedCategory.name} yet.`}
          </p>
          {(searchQuery || selectedAccessLevel !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedAccessLevel('all'); setSortBy('newest'); }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Showing <span className="font-semibold">{filteredAndSortedPdfs.length}</span> PDF{filteredAndSortedPdfs.length !== 1 ? 's' : ''}
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </p>
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}>
            {filteredAndSortedPdfs.map(pdf => (
              <PDFCard key={pdf.id} pdf={pdf} isListView={viewMode === 'list'} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFsPage;
