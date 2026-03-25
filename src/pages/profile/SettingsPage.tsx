import React, { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  CameraIcon,
  LanguageIcon,
  BellIcon,
  EyeIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  LogArrowUpIcon
} from '@heroicons/react/24/outline';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile Management',
      icon: <UserIcon className="w-5 h-5" />,
      description: 'Update your personal information and profile picture'
    },
    {
      id: 'language',
      title: 'Language & Region',
      icon: <LanguageIcon className="w-5 h-5" />,
      description: 'Choose your preferred language and regional settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <BellIcon className="w-5 h-5" />,
      description: 'Manage your notification preferences'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      description: 'Control your privacy settings and account security'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <SunIcon className="w-5 h-5" />,
      description: 'Customize the look and feel of the app'
    }
  ];

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await authService.uploadAvatar(formData);

      if (response.success) {
        dispatch(updateUser(response.data));
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload profile picture';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    // Here you would typically update the i18n context
    toast.success(`Language changed to ${selectedLanguage === 'en' ? 'English' : 'ગુજરાતી'}`);
  };

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    // Here you would typically update the theme context
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
    toast.success(`Theme changed to ${selectedTheme}`);
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast.success('Notification preferences updated');
  };

  const renderProfileSection = () => (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2 hover:bg-primary-600 transition-colors"
              disabled={isUpdating}
            >
              <CameraIcon className="w-4 h-4 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</h4>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-2">
              Click the camera icon to upload a new profile picture
            </p>
            <p className="text-xs text-gray-400">
              Recommended: 400x400 pixels, max 5MB (JPG, PNG)
            </p>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <UserIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Full Name</p>
              <p className="text-sm text-gray-500">{user?.fullName || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <PhoneIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Phone</p>
              <p className="text-sm text-gray-500">{user?.phoneNumber || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <GlobeAltIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Location</p>
              <p className="text-sm text-gray-500">
                {user?.city && user?.state ? `${user.city}, ${user.state}` : 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Language Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Select Language
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="lang-en"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="mr-3"
                />
                <label htmlFor="lang-en" className="flex items-center cursor-pointer">
                  <span className="text-2xl mr-3">🇺🇸</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">English</p>
                    <p className="text-xs text-gray-500">Default language</p>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="lang-gu"
                  name="language"
                  value="gu"
                  checked={language === 'gu'}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="mr-3"
                />
                <label htmlFor="lang-gu" className="flex items-center cursor-pointer">
                  <span className="text-2xl mr-3">🇮🇳</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">ગુજરાતી (Gujarati)</p>
                    <p className="text-xs text-gray-500">Regional language</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.email ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive push notifications on your device</p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange('push')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.push ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Marketing Updates</p>
                <p className="text-xs text-gray-500">Receive promotional content and offers</p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange('marketing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.marketing ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Theme Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Choose Theme
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="theme-light"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="mr-3"
                />
                <label htmlFor="theme-light" className="flex items-center cursor-pointer">
                  <SunIcon className="w-5 h-5 mr-3 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Light Mode</p>
                    <p className="text-xs text-gray-500">Clean and bright interface</p>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="theme-dark"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="mr-3"
                />
                <label htmlFor="theme-dark" className="flex items-center cursor-pointer">
                  <MoonIcon className="w-5 h-5 mr-3 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                    <p className="text-xs text-gray-500">Easy on the eyes</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Privacy & Security</h3>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <EyeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
                  <p className="text-xs text-gray-500">Control who can see your profile</p>
                </div>
              </div>
              <select className="text-sm border rounded-md px-3 py-1">
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <KeyIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500">Update your account password</p>
                </div>
              </div>
              <button className="text-sm bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600">
                Change
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LogArrowUpIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Data Export</p>
                  <p className="text-xs text-gray-500">Download your account data</p>
                </div>
              </div>
              <button className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'language':
        return renderLanguageSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'appearance':
        return renderAppearanceSection();
      case 'privacy':
        return renderPrivacySection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings & Preferences</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Settings Navigation */}
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left ${
                  activeSection === section.id
                    ? 'bg-primary-50 text-primary-700 hover:text-primary-700 hover:bg-primary-50'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`truncate mr-3 ${
                    activeSection === section.id
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                >
                  {section.icon}
                </span>
                <span className="truncate">{section.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="lg:col-span-9">
          <div className="py-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {settingsSections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {settingsSections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;