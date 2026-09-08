import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Check, 
  ExternalLink, 
  Store, 
  CreditCard, 
  UserPlus, 
  AlertTriangle, 
  Settings 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // قائمة الإشعارات الشاملة مع إضافة أشكال الأيقونات المناسبة
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'قام متجر "القدس" بنشر ستوري جديدة', time: 'منذ 5 دقائق', isRead: false, link: '/stories', type: 'story' },
    { id: 2, title: 'قام متجر "الأناقة" برفع وصل دفع جديد', time: 'منذ 12 دقيقة', isRead: false, link: '/subscriptions', type: 'payment' },
    { id: 3, title: 'انضمام زبون جديد للمنصة (أحمد علي)', time: 'منذ 20 دقيقة', isRead: false, link: '/customers', type: 'user' },
    { id: 4, title: 'تم تقديم بلاغ جديد على عرض مخالف', time: 'منذ ساعة', isRead: false, link: '/reports', type: 'report' },
    { id: 5, title: 'تم تحديث إعدادات النظام بنجاح', time: 'منذ يومين', isRead: true, link: '/settings', type: 'system' },
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // إغلاق القائمة عند النقر خارجها أو الضغط على Esc
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (id, link) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setIsOpen(false);
    if (link) navigate(link);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  // إرجاع الأيقونة المناسبة لكل نوع إشعار
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'story':
        return <Store size={14} className="text-amber-500" />;
      case 'payment':
        return <CreditCard size={14} className="text-emerald-500" />;
      case 'user':
        return <UserPlus size={14} className="text-blue-500" />;
      case 'report':
        return <AlertTriangle size={14} className="text-rose-500" />;
      default:
        return <Settings size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      {/* زر الجرس مع العداد */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative p-2 rounded-xl text-brand-title hover:text-brand-secondary hover:bg-brand-bg transition focus:outline-none cursor-pointer"
        title="الإشعارات"
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-secondary rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-brand-card rounded-2xl shadow-xl border border-brand-border z-[999] overflow-hidden transition-all duration-200">
          {/* الهيدر */}
          <div className="p-3 border-b border-brand-border flex items-center justify-between bg-brand-bg/50 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-title">الإشعارات</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-brand-secondary/15 text-brand-secondary text-[10px] font-bold rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-brand-secondary hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Check size={12} />
                تحديد الكل كقراءة
              </button>
            )}
          </div>

          {/* عناصر القائمة */}
          <div className="max-h-72 overflow-y-auto divide-y divide-brand-border/50">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id, item.link)}
                  className={`p-3 hover:bg-brand-bg transition flex items-start gap-3 cursor-pointer ${
                    !item.isRead ? 'bg-brand-secondary/5' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-brand-bg border border-brand-border/60 shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-xs leading-snug ${
                        !item.isRead ? 'font-bold text-brand-title' : 'text-brand-body'
                      }`}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-gray-400 block font-medium">{item.time}</span>
                  </div>

                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-brand-secondary shrink-0 mt-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-400">لا توجد إشعارات حالياً</div>
            )}
          </div>

          {/* الفوتر */}
          <div className="p-2.5 border-t border-brand-border bg-brand-bg/50 text-center">
            <button
              type="button"
              onClick={handleViewAll}
              className="text-xs font-bold text-brand-secondary hover:text-brand-primary transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              عرض كافة الإشعارات
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}