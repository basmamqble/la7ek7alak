import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-white border-b border-[#EFECE6] px-6 py-4 flex items-center justify-between shadow-sm relative z-40">
      <div className="flex items-center gap-3">
        {/* زر لإظهار/إخفاء الشريط البني */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-[#2D1B13] hover:bg-gray-100 rounded-xl transition cursor-pointer"
          title="إظهار/إخفاء القائمة"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold text-[#2D1B13]">لوحة التحكم</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* المكون الجديد هنا مكان الجرس القديم */}
        <NotificationBell />

        {/* زر تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#FCEAEB] text-[#A92A32] hover:bg-[#f8d7da] rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <LogOut size={14} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </header>
  );
}