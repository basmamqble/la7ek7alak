import axios from 'axios';

const API = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL || 'https://la7ek-7alak-production.up.railway.app/api',  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. إرسال الـ Token مع كل طلب
API.interceptors.request.use((config) => {
  // يفضل التوحيد على مفتاح واحد، مثلاً adminToken
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  if (token && !config.url.includes('/login') && !config.url.includes('/register')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. معالجة خطأ انتهاء صلاحية التوكن تلقائياً (إضافة مهمة)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // تنظيف التوكنات الخاطئة وتوجيه المستخدم لصفحة الدخول
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      
      // توجيه لصفحة تسجيل الدخول إذا لم يكن فيها بالفعل
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;