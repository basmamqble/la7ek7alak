import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

export default function AdminLayout() {
  // حالة التحكم في ظهور وغياب الشريط البني
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-[#FDFBF7] overflow-hidden" dir="rtl">
      {/* الشريط البني يظهر فقط عندما تكون الحالية true */}
      {isSidebarOpen && (
        <div className="transition-all duration-300 ease-in-out">
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* باقي الصفحة */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* نمرر دالة التبديل للهيدر لنضع به زر فتح/إغلاق القائمة */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto bg-[#FDFBF7]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}