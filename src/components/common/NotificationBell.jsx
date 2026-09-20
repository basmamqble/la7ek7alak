import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ShoppingBag, CreditCard, UserPlus, AlertTriangle, Settings, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios'; // تأكد من صحة مسار ملف Axios لديك

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // لتخزين الإشعارات الحقيقية
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // جلب الإشعارات عند تحميل المكون
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('فشل في جلب الإشعارات:', error);
    }
  };

  // إغلاق النافذة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  // تحديد الكل كمقروء من الجرس
  const markAllAsRead = async () => {
    try {
      await API.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('فشل في تحديد الكل كمقروء:', error);
    }
  };

  // تحديد أيقونة الإشعار بناءً على النوع
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'customer': return { icon: UserPlus, color: 'text-blue-500 bg-blue-50' };
      case 'story': return { icon: ShoppingBag, color: 'text-amber-500 bg-amber-50' };
      case 'report': return { icon: AlertTriangle, color: 'text-rose-500 bg-rose-50' };
      case 'subscription': return { icon: CreditCard, color: 'text-emerald-500 bg-emerald-50' };
      default: return { icon: Settings, color: 'text-gray-500 bg-gray-50' };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  // عرض أول 5 إشعارات فقط في القائمة المنسدلة
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-brand-body hover:text-brand-primary hover:bg-brand-bg rounded-xl transition cursor-pointer"
        title="الإشعارات"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 sm:right-auto sm:left-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          dir="rtl"
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-gray-800">الإشعارات</h3>
              {unreadCount > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-[11px] text-brand-primary hover:underline font-medium flex items-center gap-1 cursor-pointer">
                <Check size={13} />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((item) => {
                const { icon: IconComponent, color } = getNotificationIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-start gap-3 hover:bg-gray-50/80 transition cursor-pointer ${
                      !item.isRead ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${color}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-snug truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            ) : (
               <div className="p-6 text-center text-xs text-gray-400">لا توجد إشعارات حالياً</div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
            <button 
              onClick={handleViewAll}
              className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition flex items-center justify-center gap-1 w-full cursor-pointer"
            >
              <span>عرض كافة الإشعارات</span>
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}