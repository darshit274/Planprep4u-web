// API Configuration
export const API_CONFIG = {
  // BASE_URL: 'https://planprep4u.com/backend',
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // For local development
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/users/register',
      LOGIN: '/api/users/login',
      OTP_VERIFY: '/api/users/otp-verify',
      FORGOT_PASSWORD: '/api/users/forgotPassword',
      RESET_PASSWORD: '/api/users/resetPassword',
      PROFILE: '/api/users/profile',
      UPDATE_PROFILE: '/api/users/profile',
    },
    TESTS: {
      CATEGORIES: '/api/categories',
      TEST_SERIES: '/api/test-series',
      QUESTIONS: '/api/questions',
      SUBMIT_ANSWERS: '/api/test-responses',
      RESULTS: '/api/test-results',
      LEADERBOARD: '/api/leaderboard',
    },
    PDFS: {
      LIST: '/api/pdfs',
      CATEGORIES: '/api/pdf-categories',
      DOWNLOAD: '/api/pdfs/download',
    },
    FREE_TESTS: {
      LIST: '/api/free-tests',
      CATEGORIES: '/api/free-test-categories',
      SUBMIT: '/api/free-tests/submit',
    }
  },
  TIMEOUT: 30000, // 30 seconds (increased for solutions API)
};

// Auth Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'planprep4u_token',
  USER_KEY: 'planprep4u_user',
  TOKEN_EXPIRY_BUFFER: 60, // 1 minute buffer before actual expiry
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'PlanPrep4u',
  VERSION: '1.0.0',
  IS_DEVELOPMENT: import.meta.env.DEV,
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  THEME: {
    DEFAULT: 'light',
    STORAGE_KEY: 'planprep4u_theme',
  }
};

// Route Configuration
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: '/dashboard',
  TESTS: {
    LIST: '/tests',
    SERIES: '/tests/series/:id',
    TAKE: '/tests/take/:id',
    RESULTS: '/tests/results/:id',
    SOLUTIONS: '/tests/solutions/:id',
  },
  PDFS: {
    LIST: '/pdfs',
    VIEW: '/pdfs/view/:id',
  },
  FREE_TESTS: {
    LIST: '/free-tests',
    TAKE: '/free-tests/take/:id',
  },
  PROFILE: {
    VIEW: '/profile',
    EDIT: '/profile/edit',
    PERFORMANCE: '/profile/performance',
  },
  LEADERBOARD: '/leaderboard',
} as const;