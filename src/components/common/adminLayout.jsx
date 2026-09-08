import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // إغلاق الشريط الجانبي تلقائياً عند الانتقال بين الصفحات في الشاشات الصغيرة (الجوال)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans" dir="rtl">
      
      {/* خلفية معتمة للشاشات الصغيرة عند فتح الـ Sidebar (Backdrop) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#013C58]/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* الشريط الجانبي */}
      <aside
        className={`fixed md:relative z-50 h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-full md:translate-x-0 md:w-0 overflow-hidden opacity-0 md:opacity-100'
        }`}
      >
        {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
      </aside>

      {/* باقي محتوى الصفحة */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* الهيدر */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto bg-brand-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}