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
  CreditCard
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const navItems = [
    { title: 'الصفحة الرئيسية', path: '/dashboard', icon: LayoutDashboard },
    { title: 'إدارة التجار', path: '/merchants', icon: UserCheck },
    { title: 'إدارة الزبائن', path: '/customers', icon: Users },
    { title: 'إدارة الـ Stories الحية', path: '/stories', icon: Flame },
    { title: 'إدارة الأقسام والمدن', path: '/categories', icon: FolderTree },
    { title: 'الاشتراكات والوصولات', path: '/subscriptions', icon: CreditCard },
    { title: 'قائمة البلاغات', path: '/reports', icon: AlertTriangle },
    { title: 'الإشعارات', path: '/notifications', icon: Bell },
    { title: 'الإعدادات', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (window.confirm('هل أنت تأكد من رغبتك في تسجيل الخروج؟')) {
      localStorage.clear();
      navigate('/', { replace: true });
    }
  };

  return (
    <aside className="w-64 bg-brand-primary text-white flex flex-col justify-between h-full z-20 shadow-lg select-none">
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* هيدر الشريط الجانبي مع الاسم ولوحة التحكم بدون اللوجو */}
        <div className="p-5 border-b border-brand-primary-hover/40 flex items-center justify-between relative shrink-0">
          <div className="w-full text-center space-y-1">
            <h1 className="text-base font-bold text-white leading-tight">لحّق حالك</h1>
            <span className="text-[11px] text-brand-primary-soft/80 font-medium block">لوحة تحكم الأدمن</span>
          </div>

          {onClose && (
            <button 
              onClick={onClose} 
              type="button"
              className="absolute left-4 top-4 p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              title="إغلاق القائمة"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* قائمة التنقل */}
        <nav 
          dir="ltr" 
          className="p-4 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar"
        >
          <div dir="rtl" className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose} 
                  className={({ isActive }) =>
                    `w-full text-right py-2.5 px-3.5 rounded-xl text-xs font-medium flex items-center justify-between transition group relative ${
                      isActive
                        ? 'bg-brand-secondary text-white font-bold shadow-xs'
                        : 'text-brand-primary-soft/90 hover:bg-brand-primary-hover hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <Icon size={17} className={`${isActive ? 'text-white' : 'text-brand-primary-soft/80 group-hover:text-white'} transition-colors`} />
                        <span>{item.title}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* زر تسجيل الخروج السفلي */}
      <div className="p-4 border-t border-brand-primary-hover/40 shrink-0 bg-brand-primary">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full text-right py-2.5 px-3.5 rounded-xl text-xs font-bold bg-brand-primary-soft/20 text-brand-primary-soft hover:bg-brand-secondary hover:text-white flex items-center gap-2.5 transition cursor-pointer border border-brand-primary-soft/30"
        >
          <LogOut size={16} className="rotate-180" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}