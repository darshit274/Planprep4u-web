import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import MockTaleLogo from '../../assets/planprep4u-logo.jpg';
import {
  HomeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  UserCircleIcon,
  BookOpenIcon,
  GiftIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  GiftIcon as GiftIconSolid,
  ClockIcon as ClockIconSolid,
  DocumentDuplicateIcon as DocumentDuplicateIconSolid
} from '@heroicons/react/24/solid';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface ModernSidebarProps {
  children: React.ReactNode;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Test Series',
      href: '/tests',
      icon: AcademicCapIcon,
      iconSolid: AcademicCapIconSolid,
    },
    {
      name: 'Study Materials',
      href: '/pdfs',
      icon: DocumentTextIcon,
      iconSolid: DocumentTextIconSolid,
    },
    {
      name: 'Free Tests',
      href: '/free-tests',
      icon: BookOpenIcon,
      iconSolid: BookOpenIconSolid,
    },
    {
      name: 'Previous Years Papers',
      href: '/previous-years-papers',
      icon: DocumentDuplicateIcon,
      iconSolid: DocumentDuplicateIconSolid,
    },
    // Removed: "Free Samples" page - Free samples now shown inline in hierarchy with FREE badges
    // {
    //   name: 'Free Samples',
    //   href: '/free-in-paid-tests',
    //   icon: GiftIcon,
    //   iconSolid: GiftIconSolid,
    // },
    {
      name: 'Test History',
      href: '/test-history',
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserCircleIcon,
      iconSolid: UserCircleIconSolid,
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden">
              <img
                src={MockTaleLogo}
                alt="PlanPrep4u"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-lg font-bold text-gray-900">PlanPrep4u</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const IconComponent = active ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <IconComponent
                  className={`mr-3 h-5 w-5 ${
                    active ? 'text-primary-600' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Student
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Page title placeholder */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 hidden lg:block">
                {navigation.find(item => isActive(item.href))?.name || 'PlanPrep4u'}
              </h2>
            </div>

            {/* User avatar */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.username || 'User'}
              </span>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ModernSidebar;