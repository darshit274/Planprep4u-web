import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CameraIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

// Match mobile app exactly
const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional().refine((val) => {
    if (!val || val === '') return true; // Optional field
    const cleaned = val.replace(/[^\d]/g, '');
    return cleaned.length >= 10; // Allow 10 or more digits for international numbers
  }, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  schoolName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileEditPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      schoolName: '',
      city: '',
      state: '',
    },
  });

  // Watch for form changes
  const watchedValues = profileForm.watch();
  
  useEffect(() => {
    const subscription = profileForm.watch((values, { name, type }) => {
      if (type === 'change') {
        setHasChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [profileForm]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile data...');
        const response = await authService.getProfile();
        console.log('Profile response:', response);
        
        if (response.success && response.data) {
          const profile = response.data;
          setUserProfile(profile);
          setImageUri(profile.avatarUrl || null);
          
          // Reset form with fetched data - match mobile app structure
          const formData = {
            fullName: profile.fullName || profile.username || '',
            email: profile.email || '',
            phoneNumber: profile.phoneNumber || '',
            dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
            schoolName: profile.schoolName || '',
            city: profile.city || '',
            state: profile.state || '',
          };
          
          profileForm.reset(formData);
          setHasChanges(false);
        } else {
          console.error('Profile fetch failed:', response);
          toast.error(response.message || 'Failed to load profile data');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [profileForm]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Image upload started:', { name: file.name, size: file.size, type: file.type });

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('Image converted to base64, length:', (reader.result as string).length);
      setImageUri(reader.result as string);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);
      console.log('Submitting profile update:', data);

      // Prepare update payload - match mobile app format
      const updateData: any = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber || '',
        dateOfBirth: data.dateOfBirth || null,
        schoolName: data.schoolName || '',
        city: data.city || '',
        state: data.state || '',
      };

      // Handle image upload if changed
      if (imageUri && imageUri !== userProfile?.avatarUrl && imageUri.startsWith('data:')) {
        try {
          console.log('Converting base64 to blob...');
          
          // Convert base64 to blob more safely
          const base64Response = await fetch(imageUri);
          const blob = await base64Response.blob();
          
          console.log('Blob created successfully:', { 
            size: blob.size, 
            type: blob.type,
            isValidBlob: blob instanceof Blob 
          });
          
          if (blob.size === 0) {
            throw new Error('Blob is empty');
          }
          
          updateData.avatar = blob;
        } catch (avatarError) {
          console.error('Avatar conversion failed:', avatarError);
          toast.error('Failed to process image. Please try again.');
          return;
        }
      }

      // Use single endpoint like mobile app
      const profileResponse = await authService.updateProfile(updateData);
      console.log('Update response:', profileResponse);
      
      if (!profileResponse.success) {
        toast.error(profileResponse.message || 'Failed to update profile');
        return;
      }

      // Update local state and Redux
      setUserProfile(profileResponse.data);
      if (profileResponse.data.avatarUrl) {
        setImageUri(profileResponse.data.avatarUrl);
      }
      console.log('Dispatching updateUser with:', profileResponse.data);
      dispatch(updateUser(profileResponse.data));
      
      toast.success('Profile updated successfully!');
      setHasChanges(false);
      navigate('/profile');

    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {imageUri ? (
                    <img
                      src={imageUri}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center border-3 border-white hover:bg-primary-700 transition-colors"
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-primary-600 font-medium">Tap to change photo</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...profileForm.register('fullName')}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {profileForm.formState.errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...profileForm.register('email')}
                  type="email"
                  placeholder="Enter your email"
                  disabled
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              {profileForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...profileForm.register('phoneNumber')}
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {profileForm.formState.errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...profileForm.register('dateOfBirth')}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* School/Institution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School/Institution
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...profileForm.register('schoolName')}
                  type="text"
                  placeholder="Enter your school name"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location - City and State in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    {...profileForm.register('city')}
                    type="text"
                    placeholder="City"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  {...profileForm.register('state')}
                  type="text"
                  placeholder="State"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!hasChanges || isUpdating}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                !hasChanges || isUpdating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckIcon className="w-5 h-5" />
              )}
              <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;