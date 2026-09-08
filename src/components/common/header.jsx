import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('هل أنت تأكد من رغبتك في تسجيل الخروج؟')) {
      localStorage.clear();
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="bg-brand-card border-b border-brand-border px-4 md:px-6 py-3.5 flex items-center justify-between shadow-xs relative z-40">
      {/* الجزء الأيمن: زر القائمة + أيقونة الأدمن ونصه */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 text-brand-primary hover:bg-brand-bg rounded-xl transition cursor-pointer"
          title={isSidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        {/* أيقونة واسم الأدمن على اليمين */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-primary-soft/40 text-brand-primary border border-brand-border flex items-center justify-center">
            <User size={18} />
          </div>
          <h1 className="text-base md:text-lg font-bold text-brand-title">الأدمن</h1>
        </div>
      </div>

      {/* الجزء الأيسر: جرس الإشعارات وزر تسجيل الخروج فقط بألوان الهوية */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* جرس الإشعارات */}
        <NotificationBell />

        <div className="h-5 w-[1px] bg-brand-border hidden sm:block" />

        {/* زر تسجيل الخروج بألوان الهوية */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-primary-soft/40 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition cursor-pointer border border-brand-primary-soft/60"
          title="تسجيل الخروج"
        >
          <LogOut size={15} className="rotate-180" />
          <span className="hidden sm:inline">تسجيل الخروج</span>
        </button>
      </div>
    </header>
  );
}