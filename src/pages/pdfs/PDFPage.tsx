import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  TagIcon,
  CalendarDaysIcon,
  UserIcon,
  ChevronDownIcon,
  FolderIcon,
  DocumentChartBarIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

interface PDF {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'Study Notes' | 'Reference Books' | 'Question Papers' | 'Solutions';
  subject: string;
  author: string;
  pages: number;
  size: string;
  downloadCount: number;
  rating: number;
  uploadDate: string;
  tags: string[];
  thumbnail: string;
  isPremium: boolean;
  isBookmarked: boolean;
}

const PDFPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All PDFs');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data - replace with actual API calls
  const categories = ['All PDFs', 'Study Notes', 'Reference Books', 'Question Papers', 'Solutions'];
  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
  const types = ['All', 'Study Notes', 'Reference Books', 'Question Papers', 'Solutions'];

  const pdfs: PDF[] = [
    {
      id: '1',
      title: 'Complete Calculus Study Guide',
      description: 'Comprehensive notes covering differential and integral calculus with solved examples',
      category: 'Study Notes',
      type: 'Study Notes',
      subject: 'Mathematics',
      author: 'Dr. Rajesh Kumar',
      pages: 156,
      size: '12.5 MB',
      downloadCount: 2340,
      rating: 4.8,
      uploadDate: '2024-01-10',
      tags: ['Calculus', 'Derivatives', 'Integration'],
      thumbnail: '/thumbnails/calculus.jpg',
      isPremium: false,
      isBookmarked: true
    },
    {
      id: '2',
      title: 'Organic Chemistry Mechanisms',
      description: 'Detailed reaction mechanisms and problem-solving strategies for organic chemistry',
      category: 'Reference Books',
      type: 'Reference Books',
      subject: 'Chemistry',
      author: 'Prof. Priya Sharma',
      pages: 284,
      size: '18.7 MB',
      downloadCount: 1876,
      rating: 4.9,
      uploadDate: '2024-01-08',
      tags: ['Organic', 'Mechanisms', 'Reactions'],
      thumbnail: '/thumbnails/organic.jpg',
      isPremium: true,
      isBookmarked: false
    },
    {
      id: '3',
      title: 'Physics Mock Test Papers',
      description: 'Collection of previous year question papers with detailed solutions',
      category: 'Question Papers',
      type: 'Question Papers',
      subject: 'Physics',
      author: 'PlanPrep4u Team',
      pages: 92,
      size: '8.3 MB',
      downloadCount: 3421,
      rating: 4.7,
      uploadDate: '2024-01-12',
      tags: ['Mock Tests', 'Previous Year', 'Solutions'],
      thumbnail: '/thumbnails/physics.jpg',
      isPremium: false,
      isBookmarked: true
    }
  ];

  const filteredPDFs = pdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pdf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All PDFs' || pdf.category === selectedCategory;
    const matchesSubject = selectedSubject === 'All' || pdf.subject === selectedSubject;
    const matchesType = selectedType === 'All' || pdf.type === selectedType;

    return matchesSearch && matchesCategory && matchesSubject && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Study Notes':
        return <BookOpenIcon className="w-5 h-5" />;
      case 'Reference Books':
        return <AcademicCapIcon className="w-5 h-5" />;
      case 'Question Papers':
        return <DocumentChartBarIcon className="w-5 h-5" />;
      case 'Solutions':
        return <NewspaperIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials</h1>
              <p className="text-gray-600">
                Access comprehensive study notes, reference books, and practice materials
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredPDFs.length} materials available
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {getTypeIcon(category)}
                <span className="ml-2">{category}</span>
              </button>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search study materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-input min-w-[120px]"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-input min-w-[120px]"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input min-w-[120px]"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Grid/List */}
      <div className="page-container py-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPDFs.map((pdf) => (
              <div key={pdf.id} className="card-interactive group overflow-hidden">
                {/* PDF Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                  </div>

                  {/* Premium Badge */}
                  {pdf.isPremium && (
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-yellow">Premium</span>
                    </div>
                  )}

                  {/* Bookmark */}
                  <button className="absolute top-3 left-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors">
                    <svg className={`w-4 h-4 ${pdf.isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                    <Link
                      to={`/pdfs/view/${pdf.id}`}
                      className="btn btn-sm bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </Link>
                    <button className="btn btn-sm bg-primary-600 text-white hover:bg-primary-700">
                      <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>

                {/* PDF Info */}
                <div className="p-6">
                  {/* Type and Subject */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`badge ${
                      pdf.type === 'Study Notes' ? 'badge-blue' :
                      pdf.type === 'Reference Books' ? 'badge-purple' :
                      pdf.type === 'Question Papers' ? 'badge-green' :
                      'badge-yellow'
                    }`}>
                      {pdf.type}
                    </span>
                    <span className="text-xs text-gray-500">{pdf.subject}</span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {pdf.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {pdf.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {pdf.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{pdf.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        <span>{pdf.downloadCount.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-xs">{pdf.pages} pages</span>
                  </div>

                  {/* Author and Date */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex items-center">
                      <UserIcon className="w-3 h-3 mr-1" />
                      <span>{pdf.author}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-3 h-3 mr-1" />
                      <span>{new Date(pdf.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredPDFs.map((pdf) => (
              <div key={pdf.id} className="card p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-6">
                  {/* PDF Icon */}
                  <div className="w-16 h-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                  </div>

                  {/* PDF Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                            {pdf.title}
                          </h3>
                          <span className={`badge ${
                            pdf.type === 'Study Notes' ? 'badge-blue' :
                            pdf.type === 'Reference Books' ? 'badge-purple' :
                            pdf.type === 'Question Papers' ? 'badge-green' :
                            'badge-yellow'
                          }`}>
                            {pdf.type}
                          </span>
                          {pdf.isPremium && (
                            <span className="badge badge-yellow">Premium</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{pdf.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>By {pdf.author}</span>
                          <span>{pdf.pages} pages</span>
                          <span>{pdf.size}</span>
                          <div className="flex items-center">
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span>{pdf.rating}</span>
                          </div>
                          <span>{pdf.downloadCount.toLocaleString()} downloads</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/pdfs/view/${pdf.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </Link>
                        <button className="btn btn-primary btn-sm">
                          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredPDFs.length === 0 && (
          <div className="text-center py-12">
            <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse our featured materials.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All PDFs');
                setSelectedSubject('All');
                setSelectedType('All');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFPage;