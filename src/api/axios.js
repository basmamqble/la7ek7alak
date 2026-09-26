import axios from 'axios';

const API = axios.create({
  baseURL: 'https://la7ek-7alak.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. إرسال الـ Token مع كل طلب
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  if (token && !config.url.includes('auth/login') && !config.url.includes('auth/register')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. معالجة خطأ انتهاء صلاحية التوكن تلقائياً
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthRequest = requestUrl.includes('auth/login') || requestUrl.includes('auth/register');
    const isNotificationRequest = requestUrl.includes('/notifications');

    if (error.response?.status === 401 && !isAuthRequest && !isNotificationRequest) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');

      // التصحيح: توجيه المستخدم لصفحة تسجيل الدخول بدلاً من '/'
      const loginPath = '/auth/login'; // عدل هذا المسار حسب مسار صفحة الـ Login لديك في الـ Router
      if (!window.location.pathname.includes(loginPath)) {
        window.location.replace(loginPath);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
