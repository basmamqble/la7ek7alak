import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  UserPlus, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  CreditCard 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all | unread | customers | stories | report | subscription | system

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'تم نشر ستوري جديدة',
      desc: 'قام متجر "القدس للتسوق" بنشر ستوري عرض جديد وهي متاحة الآن لمدة 24 ساعة.',
      time: 'منذ 3 دقائق',
      isRead: false,
      type: 'story',
      link: '/stories'
    },
    {
      id: 2,
      title: 'تم رفع وصل دفع جديد',
      desc: 'قام متجر "الأناقة" برفع وصل دفع جديد لتجديد الاشتراك الشهري.',
      time: 'منذ 12 دقيقة',
      isRead: false,
      type: 'subscription',
      link: '/subscriptions'
    },
    {
      id: 3,
      title: 'انضمام زبون جديد للمنصة',
      desc: 'قام مستخدم جديد (أحمد علي) بإنشاء حساب زبون وتأكيد رقم الجوال.',
      time: 'منذ 15 دقيقة',
      isRead: false,
      type: 'customer',
      link: '/customers'
    },
    {
      id: 4,
      title: 'تم تقديم بلاغ جديد على عرض',
      desc: 'تم الإبلاغ عن ستوري خاصة بمحل "الأمل" بسبب محتوى مخالف لشروط الاستخدام.',
      time: 'منذ ساعة',
      isRead: false,
      type: 'report',
      link: '/reports'
    },
    {
      id: 5,
      title: 'تم تحديث إعدادات النظام',
      desc: 'تم إكمال النسخ الاحتياطي التلقائي لقاعدة البيانات بنجاح.',
      time: 'منذ يومين',
      isRead: true,
      type: 'system',
      link: '/settings'
    },
  ]);

  const handleNotificationClick = (id, link) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (link) navigate(link);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (e, id) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'customers') return n.type === 'customer';
    if (filter === 'stories') return n.type === 'story';
    if (filter === 'report') return n.type === 'report';
    if (filter === 'subscription') return n.type === 'subscription';
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'customer':
        return <UserPlus size={18} className="text-emerald-600" />;
      case 'story':
        return <Flame size={18} className="text-orange-600" />;
      case 'report':
        return <AlertTriangle size={18} className="text-amber-600" />;
      case 'subscription':
        return <CreditCard size={18} className="text-purple-600" />;
      case 'system':
        return <ShieldCheck size={18} className="text-blue-600" />;
      default:
        return <Bell size={18} className="text-[#8E5439]" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-right dir-rtl">
      {/* الهيدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFECE6] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#8E5439]/10 text-[#8E5439] rounded-xl relative">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2D1B13]">مركز الإشعارات</h1>
            <p className="text-xs text-gray-500 mt-0.5">متابعة تنبيهات انضمام الزبائن، الستوريات المنشورة، الاشتراكات والبلاغات</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#2D1B13] rounded-xl text-xs font-bold transition border border-[#EFECE6] cursor-pointer"
          >
            <CheckCheck size={16} />
            <span>تحديد الكل كُمشاهد</span>
          </button>
        )}
      </div>

      {/* أزرار الفلترة */}
      <div className="flex items-center gap-2 border-b border-[#EFECE6] pb-3 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'all'
              ? 'bg-[#8E5439] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-[#FAF8F5] border border-[#EFECE6]'
          }`}
        >
          الكل ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#8E5439] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-[#FAF8F5] border border-[#EFECE6]'
          }`}
        >
          غير المقروءة ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('stories')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'stories'
              ? 'bg-[#8E5439] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-[#FAF8F5] border border-[#EFECE6]'
          }`}
        >
          الستوريات المنشورة
        </button>
        <button
          onClick={() => setFilter('subscription')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'subscription'
              ? 'bg-[#8E5439] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-[#FAF8F5] border border-[#EFECE6]'
          }`}
        >
          الوصولات والاشتراكات
        </button>
        <button
          onClick={() => setFilter('customers')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'customers'
              ? 'bg-[#8E5439] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-[#FAF8F5] border border-[#EFECE6]'
          }`}
        >
          الزبائن الجدد
        </button>
        <button
          onClick={() => setFilter('report')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'report'
              ? 'bg-[#8E5439] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-[#FAF8F5] border border-[#EFECE6]'
          }`}
        >
          البلاغات
        </button>
      </div>

      {/* قائمة الإشعارات */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item.id, item.link)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer hover:shadow-md ${
                !item.isRead
                  ? 'bg-white border-[#8E5439]/40 shadow-sm'
                  : 'bg-[#FAF8F5]/60 border-[#EFECE6]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      !item.isRead ? 'bg-[#8E5439]' : 'bg-transparent'
                    }`}
                  />
                  <div className="p-2 rounded-xl bg-white border border-[#EFECE6] shadow-xs">
                    {getNotificationIcon(item.type)}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3
                    className={`text-sm ${
                      !item.isRead ? 'font-bold text-[#2D1B13]' : 'font-semibold text-gray-700'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  <span className="text-[10px] text-gray-400 block pt-1">{item.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => deleteNotification(e, item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  title="حذف الإشعار"
                >
                  <Trash2 size={16} />
                </button>
                <div className="p-2 text-gray-300">
                  <ArrowRight size={16} className="rotate-180" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-14 bg-white rounded-2xl border border-[#EFECE6]">
            <Bell size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 font-medium">لا توجد إشعارات متطابقة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}