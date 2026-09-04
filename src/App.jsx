import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
import Notifications from './pages/Notifications'; // استدعاء الصفحة
import Subscriptions from './pages/Subscriptions';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحة تسجيل الدخول خارج الهيكل الرئيسي */}
        <Route path="/" element={<Login />} />

        {/* مسارات لوحة التحكم المغلفة بالـ AdminLayout المستورد */}
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