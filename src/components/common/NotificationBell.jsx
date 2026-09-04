import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // قائمة الإشعارات الشاملة الخاصة بالمنصة
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'قام متجر "القدس" بنشر ستوري جديدة', time: 'منذ 5 دقائق', isRead: false, link: '/stories' },
    { id: 2, title: 'قام متجر "الأناقة" برفع وصل دفع جديد', time: 'منذ 12 دقيقة', isRead: false, link: '/subscriptions' },
    { id: 3, title: 'انضمام زبون جديد للمنصة (أحمد علي)', time: 'منذ 20 دقيقة', isRead: false, link: '/customers' },
    { id: 4, title: 'تم تقديم بلاغ جديد على عرض مخالف', time: 'منذ ساعة', isRead: false, link: '/reports' },
    { id: 5, title: 'تم تحديث إعدادات النظام بنجاح', time: 'منذ يومين', isRead: true, link: '/settings' },
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // التعامل مع النقر على إشعار فردي والتوجيه للمسار المطلوب
  const handleItemClick = (id, link) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setIsOpen(false);
    if (link) navigate(link);
  };

  // الانتقال لصفحة الإشعارات الكلية
  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      {/* زر الجرس مع العداد */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative p-2 rounded-xl text-gray-600 hover:text-[#8E5439] hover:bg-[#FAF8F5] transition focus:outline-none cursor-pointer"
        title="الإشعارات"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EFECE6] z-[999] overflow-hidden">
          {/* الهيدر */}
          <div className="p-3 border-b border-[#EFECE6] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2D1B13]">الإشعارات</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-[#8E5439]/10 text-[#8E5439] text-[10px] font-bold rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-[#8E5439] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Check size={12} />
                تحديد الكل كقراءة
              </button>
            )}
          </div>

          {/* عناصر القائمة */}
          <div className="max-h-72 overflow-y-auto divide-y divide-[#EFECE6]/60">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id, item.link)}
                  className={`p-3 hover:bg-[#FAF8F5] transition flex items-start gap-2.5 cursor-pointer ${
                    !item.isRead ? 'bg-[#8E5439]/5' : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !item.isRead ? 'bg-[#8E5439]' : 'bg-transparent'
                    }`}
                  />
                  <div className="flex-1 space-y-0.5">
                    <p
                      className={`text-xs ${
                        !item.isRead ? 'font-bold text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-gray-400 block">{item.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-gray-400">لا توجد إشعارات حالياً</div>
            )}
          </div>

          {/* الفوتر - رابط التوجيه لصفحة الإشعارات الكلية */}
          <div className="p-2.5 border-t border-[#EFECE6] bg-gray-50 text-center">
            <button
              type="button"
              onClick={handleViewAll}
              className="text-xs font-bold text-[#8E5439] hover:text-[#2D1B13] transition inline-flex items-center gap-1 cursor-pointer"
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