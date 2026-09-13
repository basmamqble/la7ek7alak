import axios from 'axios';

const API = axios.create({
  baseURL: 'https://la7ek-7alak.apps.taqat.academy/api', // تأكدي إذا كان الـ /api مطلوباً في نهاية الرابط حسب إعدادات السيرفر الجديد
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. إرسال الـ Token مع كل طلب
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  if (token && !config.url.includes('/login') && !config.url.includes('/register')) {
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
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;