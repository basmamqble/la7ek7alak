import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Flame, 
  FolderTree, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  X, 
  Bell,
  CreditCard // 👈 1. تم استيراد أيقونة الاشتراكات والوصولات
} from 'lucide-react';
import logo from '../../assets/logo.png';

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const navItems = [
    { title: 'الصفحة الرئيسية', path: '/dashboard', icon: LayoutDashboard },
    { title: 'إدارة التجار', path: '/merchants', icon: UserCheck },
    { title: 'إدارة الزبائن', path: '/customers', icon: Users },
    { title: 'إدارة الـ Stories الحية', path: '/stories', icon: Flame },
    { title: 'إدارة الأقسام والمدن', path: '/categories', icon: FolderTree },
    { title: 'الاشتراكات والوصولات', path: '/subscriptions', icon: CreditCard }, // 👈 2. تمت إضافة خيار الاشتراكات
    { title: 'قائمة البلاغات', path: '/reports', icon: AlertTriangle },
    { title: 'الإشعارات', path: '/notifications', icon: Bell },
    { title: 'الإعدادات', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <aside className="w-64 bg-[#2D1B13] text-white flex flex-col justify-between h-full z-20 shadow-lg">
      <div>
        <div className="p-5 border-b border-[#3D210F] flex items-center justify-between text-right">
          <div className="flex items-center gap-3">
            <img src={logo} alt="لحّق حالك" className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-white leading-tight">لحّق حالك</h1>
              <span className="text-[11px] text-[#C6BCAD] mt-0.5">لوحة تحكم الأدمن</span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose} 
                className={({ isActive }) =>
                  `w-full text-right py-2.5 px-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition ${
                    isActive
                      ? 'bg-[#7E361B] text-white font-bold shadow-sm'
                      : 'text-[#C6BCAD] hover:bg-[#3D210F] hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#3D210F]">
        <button
          onClick={handleLogout}
          className="w-full text-right py-2.5 px-3.5 rounded-xl text-xs font-medium text-red-300 hover:bg-[#3D210F] hover:text-red-200 flex items-center gap-2.5 transition cursor-pointer"
        >
          <LogOut size={16} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}