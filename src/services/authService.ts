import api from './api';

// Local type definitions to avoid import issues
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

interface User {
  id?: number;
  uuid: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  schoolName?: string;
  city?: string;
  state?: string;
  avatarUrl?: string;
  role?: 'student' | 'admin' | 'super_admin';
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
  stats?: {
    testsCompleted: number;
    totalScore: number;
    averageScore: number;
    rank: number;
    studyHours: number;
    streak: number;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

class AuthService {
  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  }

  // Register
  async register(data: RegisterData): Promise<ApiResponse<{ message: string; email: string }>> {
    const response = await api.post('/users/register', data);
    return response.data;
  }

  // Verify OTP
  async verifyOTP(email: string, otp: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/users/otp-verify', { email, otp });
    return response.data;
  }

  // Forgot Password
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/users/forgotPassword', { email });
    return response.data;
  }

  // Reset Password
  async resetPassword(email: string, otp: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/users/resetPassword', { email, otp, newPassword });
    return response.data;
  }

  // Resend OTP
  async resendOTP(email: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/users/resend-otp', { email });
    return response.data;
  }

  // Get user profile
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get('/profile/profile');
    return response.data;
  }

  // Update user profile - use base64 approach to avoid FormData issues
  async updateProfile(data: any): Promise<ApiResponse<User>> {
    const updatePayload: any = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber || '',
      dateOfBirth: data.dateOfBirth || null,
      schoolName: data.schoolName || '',
      city: data.city || '',
      state: data.state || '',
    };

    // Handle avatar as base64 string to avoid FormData issues
    if (data.avatar && data.avatar instanceof Blob) {
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(data.avatar);

        const base64String = await base64Promise;
        updatePayload.avatarBase64 = base64String;
      } catch (error) {
        console.error('Failed to convert avatar to base64:', error);
        throw new Error('Failed to process avatar image');
      }
    }

    const response = await api.put('/profile/profile', updatePayload);
    return response.data;
  }

  // Upload avatar - now uses updateProfile internally
  async uploadAvatar(formData: FormData): Promise<ApiResponse<User>> {
    const response = await api.put('/profile/profile', formData);
    return response.data;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/users/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  // Refresh token (if implemented in backend)
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post('/users/refresh-token');
    return response.data;
  }

  // Logout (if backend tracks sessions)
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/users/logout');
    return response.data;
  }

  // Check if token is valid
  async validateToken(): Promise<ApiResponse<{ valid: boolean; user?: User }>> {
    try {
      const response = await api.get('/users/validate-token');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Invalid token',
        data: { valid: false },
      };
    }
  }
}

export const authService = new AuthService();
export default authService;