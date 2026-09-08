import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// استيراد المكونات المشتركة والـ Layout
import AdminLayout from './components/common/adminLayout';

// استيراد الصفحات
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Merchants from './pages/merchants';
import Stories from './pages/stories';
import Categories from './pages/categories';
import Reports from './pages/reports';
import Settings from './pages/settings';
import Customers from "./components/customers/customers.jsx";
import Notifications from './pages/Notifications';
import Subscriptions from './pages/Subscriptions';

function App() {
  return (
    <BrowserRouter>
      {/* ضبط الـ Toaster باستعمال متغيّرات ألوان باليت المشروع */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'inherit',
            fontSize: '13px',
            borderRadius: '12px',
            direction: 'rtl',
            padding: '12px 16px',
            background: 'var(--color-primary)',
            color: '#fff',
            border: '1px solid var(--color-border)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            style: {
              background: 'var(--color-primary)',
              color: '#fff',
            },
            iconTheme: {
              primary: 'var(--color-secondary)',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#991B1B',
              color: '#fff',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* صفحة تسجيل الدخول خارج الهيكل الرئيسي */}
        <Route path="/" element={<Login />} />

        {/* مسارات لوحة التحكم المغلفة بالـ AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
        </Route>

        {/* إعادة التوجيه للمسارات غير المعروفة */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;