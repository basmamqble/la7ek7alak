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

  const handleNotificationClick = (item) => {
    // تعليم الإشعار كمشاهد
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
    );

    // الانتقال للرابط المرتبط إن وجد
    if (item.link) {
      navigate(item.link);
    }
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
    if (filter === 'system') return n.type === 'system';
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'customer':
        return <UserPlus size={18} className="text-emerald-600" />;
      case 'story':
        return <Flame size={18} className="text-orange-600" />;
      case 'report':
        return <AlertTriangle size={18} className="text-rose-600" />;
      case 'subscription':
        return <CreditCard size={18} className="text-purple-600" />;
      case 'system':
        return <ShieldCheck size={18} className="text-blue-600" />;
      default:
        return <Bell size={18} className="text-brand-secondary" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-right font-sans" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-card p-5 rounded-2xl border border-brand-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-secondary-soft text-brand-primary rounded-xl relative">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-primary">مركز الإشعارات</h1>
            <p className="text-xs text-brand-body/70 mt-0.5">متابعة تنبيهات انضمام الزبائن، الستوريات، الاشتراكات والبلاغات</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-bg hover:bg-brand-border text-brand-primary rounded-xl text-xs font-bold transition border border-brand-border cursor-pointer"
          >
            <CheckCheck size={16} />
            <span>تحديد الكل كُمشاهد</span>
          </button>
        )}
      </div>

      {/* أزرار الفلترة */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'all'
              ? 'bg-brand-secondary text-white shadow-sm'
              : 'bg-brand-card text-brand-body hover:bg-brand-bg border border-brand-border'
          }`}
        >
          الكل ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'unread'
              ? 'bg-brand-secondary text-white shadow-sm'
              : 'bg-brand-card text-brand-body hover:bg-brand-bg border border-brand-border'
          }`}
        >
          غير المقروءة ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('stories')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'stories'
              ? 'bg-brand-secondary text-white shadow-sm'
              : 'bg-brand-card text-brand-body hover:bg-brand-bg border border-brand-border'
          }`}
        >
          الستوريات المنشورة
        </button>
        <button
          onClick={() => setFilter('subscription')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'subscription'
              ? 'bg-brand-secondary text-white shadow-sm'
              : 'bg-brand-card text-brand-body hover:bg-brand-bg border border-brand-border'
          }`}
        >
          الوصولات والاشتراكات
        </button>
        <button
          onClick={() => setFilter('customers')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'customers'
              ? 'bg-brand-secondary text-white shadow-sm'
              : 'bg-brand-card text-brand-body hover:bg-brand-bg border border-brand-border'
          }`}
        >
          الزبائن الجدد
        </button>
        <button
          onClick={() => setFilter('report')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filter === 'report'
              ? 'bg-brand-secondary text-white shadow-sm'
              : 'bg-brand-card text-brand-body hover:bg-brand-bg border border-brand-border'
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
              onClick={() => handleNotificationClick(item)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer hover:shadow-md ${
                !item.isRead
                  ? 'bg-brand-card border-brand-secondary/40 shadow-sm'
                  : 'bg-brand-bg/60 border-brand-border'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      !item.isRead ? 'bg-brand-secondary' : 'bg-transparent'
                    }`}
                  />
                  <div className="p-2 rounded-xl bg-brand-card border border-brand-border shadow-xs">
                    {getNotificationIcon(item.type)}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3
                    className={`text-sm ${
                      !item.isRead ? 'font-bold text-brand-primary' : 'font-semibold text-brand-body'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-body/70 leading-relaxed">{item.desc}</p>
                  <span className="text-[10px] text-brand-body/50 block pt-1">{item.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="p-2 text-brand-body/30">
                  <ArrowRight size={16} className="rotate-180" />
                </div>

                <button
                  onClick={(e) => deleteNotification(e, item.id)}
                  className="p-2 text-brand-body/40 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="حذف الإشعار"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-14 bg-brand-card rounded-2xl border border-brand-border">
            <Bell size={40} className="mx-auto text-brand-body/30 mb-3" />
            <p className="text-sm text-brand-body/70 font-medium">لا توجد إشعارات متطابقة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}