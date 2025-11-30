import axios from 'axios';

const isLocalhost =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
  baseURL: isLocalhost ? '/api' : import.meta.env.VITE_API_URL || '/api',
  timeout: 1000000,
  withCredentials: true,
});

// Store CSRF token in memory
let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

// Helper function to get CSRF token from cookie
const getCSRFTokenFromCookie = (): string | null => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

// Helper function to fetch CSRF token from API
const fetchCSRFToken = async (): Promise<string> => {
  // If already fetching, return the existing promise
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  // Create new fetch promise
  csrfTokenPromise = (async () => {
    try {
      const baseURL = isLocalhost ? '/api' : import.meta.env.VITE_API_URL || '/api';
      const response = await axios.get(`${baseURL}/auth/csrf/`, {
        withCredentials: true,
      });
      const token = response.data.csrf_token;
      csrfToken = token;
      return token;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      throw error;
    } finally {
      csrfTokenPromise = null;
    }
  })();

  return csrfTokenPromise;
};

// Helper function to get CSRF token (from cookie, memory, or fetch)
const getCSRFToken = async (): Promise<string | null> => {
  // Check cookie first
  const cookieToken = getCSRFTokenFromCookie();
  if (cookieToken) {
    csrfToken = cookieToken;
    return cookieToken;
  }

  // Check memory
  if (csrfToken) {
    return csrfToken;
  }

  // Fetch from API
  try {
    return await fetchCSRFToken();
  } catch (error) {
    console.error('Could not obtain CSRF token:', error);
    return null;
  }
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  async (config) => {
    // Get CSRF token
    const token = await getCSRFToken();

    // Add CSRF token header if token exists
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Şəbəkə xətası. İnternet bağlantınızı yoxlayın.',
        type: 'network',
        originalError: error,
      });
    }

    const { status, data } = error.response;

    // Handle CSRF token errors with retry
    if (status === 403 && data?.detail?.includes('CSRF') && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Clear cached CSRF token and fetch a new one
        csrfToken = null;
        const newToken = await fetchCSRFToken();
        originalRequest.headers['X-CSRFToken'] = newToken;
        return api(originalRequest);
      } catch (csrfError) {
        console.error('CSRF token refresh failed:', csrfError);
      }
    }

    // Handle authentication errors
    if (status === 401) {
      // Clear any cached auth data
      csrfToken = null;

      // Don't redirect if already on login/landing page
      const currentPath = window.location.pathname;
      if (!['/login', '/landing', '/'].includes(currentPath)) {
        console.warn('Unauthorized access - redirecting to login');
        window.location.href = '/login';
      }

      return Promise.reject({
        message: 'Giriş müddəti bitib. Zəhmət olmasa yenidən daxil olun.',
        type: 'authentication',
        status,
        originalError: error,
      });
    }

    // Handle forbidden errors
    if (status === 403) {
      return Promise.reject({
        message: data?.detail || 'Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur.',
        type: 'authorization',
        status,
        originalError: error,
      });
    }

    // Handle not found errors
    if (status === 404) {
      return Promise.reject({
        message: data?.detail || 'Axtarılan məlumat tapılmadı.',
        type: 'not_found',
        status,
        originalError: error,
      });
    }

    // Handle validation errors
    if (status === 400) {
      return Promise.reject({
        message: data?.detail || 'Göndərilən məlumatlar yanlışdır.',
        type: 'validation',
        status,
        data: data,
        originalError: error,
      });
    }

    // Handle server errors
    if (status >= 500) {
      return Promise.reject({
        message: data?.detail || 'Server xətası baş verdi. Zəhmət olmasa sonra yenidən cəhd edin.',
        type: 'server',
        status,
        originalError: error,
      });
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Sorğu vaxtı bitdi. Zəhmət olmasa yenidən cəhd edin.',
        type: 'timeout',
        originalError: error,
      });
    }

    // Handle any other errors
    return Promise.reject({
      message: data?.detail || error.message || 'Gözlənilməz xəta baş verdi.',
      type: 'unknown',
      status,
      originalError: error,
    });
  }
);

export default api;
