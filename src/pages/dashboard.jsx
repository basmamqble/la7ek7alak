import React, { useEffect, useState } from 'react';
import AnalyticsChart from '../components/dashboard/analyticsChart';
import RecentMerchants from '../components/dashboard/recentMerchants';
import { 
  Store, 
  Users, 
  Flame, 
  AlertTriangle, 
  CreditCard, 
  Clock, 
  Eye, 
  TrendingUp, 
  MapPin,
  Sparkles,
  ArrowUpLeft
} from 'lucide-react';
import API from '../api/axios';

const defaultStats = {
  activeStories: 124,
  storiesChange: '+12% عن أمس',
  totalMerchants: 48,
  merchantsChange: '+3 تجار جدد',
  totalUsers: '1,240',
  usersChange: '+8% هذا الأسبوع',
  pendingReports: 5,
  reportsChange: 'تتطلب مراجعة',
  pendingReceipts: 3,
  receiptsChange: 'بانتظار التأكيد',
  expiringSubs: 4,
  subsChange: 'خلال 3 أيام',
  totalViewsToday: '8,450',
  viewsChange: '+15% تفاعل',
};

const defaultRecentMerchants = [
  { id: 1, name: 'بيتزا البرنس 🍕', location: 'الوسطى - النصيرات', badge: 'مميز ⭐', badgeColor: 'bg-[#F2E8DC] text-[#8E5439]' },
  { id: 2, name: 'متجر الأناقة 🧴', location: 'خان يونس - البلد', badge: 'جديد 🟢', badgeColor: 'bg-emerald-100/70 text-emerald-800' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [recentMerchants, setRecentMerchants] = useState(defaultRecentMerchants);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/admin/dashboard-stats');
      if (response.data) {
        setStats(prev => ({ ...prev, ...response.data }));
        if (response.data.recentMerchants?.length > 0) {
          setRecentMerchants(response.data.recentMerchants);
        }
      }
    } catch (err) {
      console.log('تم استخدام بيانات الواجهة العصرية المحسنة.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCardsData = [
    { title: 'الـ Stories النشطة', value: stats.activeStories, change: stats.storiesChange, icon: Flame, badgeBg: 'bg-orange-100 text-orange-600' },
    { title: 'إجمالي التجار', value: stats.totalMerchants, change: stats.merchantsChange, icon: Store, badgeBg: 'bg-[#EBDCD0] text-[#7A452D]' },
    { title: 'الزبائن المسجلون', value: stats.totalUsers, change: stats.usersChange, icon: Users, badgeBg: 'bg-amber-100 text-amber-700' },
    { title: 'وصولات قيد التدقيق', value: stats.pendingReceipts, change: stats.receiptsChange, icon: CreditCard, badgeBg: 'bg-purple-100 text-purple-700' },
    { title: 'اشتراكات تنتهي قريباً', value: stats.expiringSubs, change: stats.subsChange, icon: Clock, badgeBg: 'bg-[#F0E3D5] text-[#8E5439]' },
    { title: 'بلاغات قيد المراجعة', value: stats.pendingReports, change: stats.reportsChange, icon: AlertTriangle, badgeBg: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <div className="space-y-6 text-right dir-rtl font-sans bg-[#FDFBF7] p-6 rounded-3xl min-h-screen" dir="rtl">
      
      {/* 1. الهيدر الترحيبي العريض */}
      <div className="relative overflow-hidden bg-gradient-to-l from-[#8E5439] via-[#A06449] to-[#C49177] text-white p-7 rounded-3xl shadow-lg shadow-[#8E5439]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="z-10 space-y-1">
          <div className="flex items-center gap-2 text-[#F2E8DC] text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={16} />
            <span>لوحة التحكم الرئيسية</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">مرحباً بك، أدمن منصة لحّق حالك 👋</h1>
          <p className="text-xs text-[#F8F4EF]/80 max-w-xl">
            متابعة فورية ومباشرة لكافة الأنشطة، عروض الستوري، المتاجر الجديدة، ووصولات الدفع.
          </p>
        </div>

        <div className="z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-white">المزامنة الفورية نشطة</span>
        </div>

        {/* لمسة ديكورية للخلفية */}
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 2. كروت الإحصائيات باللون البني الفاتح العصري */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCardsData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className="bg-[#FAF5EF] hover:bg-[#F5ECE2] border border-[#EBE0D3] p-4 rounded-2xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6E5042] group-hover:text-[#4A3227] transition-colors">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${card.badgeBg}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <div className="text-2xl font-black text-[#3D251A] tracking-tight">
                  {card.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#8A6A5C]">
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. المؤشرات السريعة (Quick Insights) - تصميم بني ناعم ومريح */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-gradient-to-bl from-[#F7F0E8] to-[#FAF5EF] border border-[#E8DCCE] p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-[#7A5C4D] font-medium block">مشاهدات العروض اليوم</span>
            <span className="text-xl font-bold text-[#3D251A]">{stats.totalViewsToday}</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              {stats.viewsChange}
            </span>
          </div>
          <div className="p-3 bg-[#EBDCD0] text-[#7A452D] rounded-2xl shadow-xs">
            <Eye size={22} />
          </div>
        </div>

        <div className="bg-gradient-to-bl from-[#F7F0E8] to-[#FAF5EF] border border-[#E8DCCE] p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-[#7A5C4D] font-medium block">معدل التفاعل اليومي</span>
            <span className="text-xl font-bold text-[#3D251A]">78.4%</span>
            <span className="text-[10px] text-[#8E5439] font-semibold bg-[#F0E3D5] px-2 py-0.5 rounded-full inline-block">
              أعلى من المتوسط
            </span>
          </div>
          <div className="p-3 bg-[#EBDCD0] text-[#7A452D] rounded-2xl shadow-xs">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-gradient-to-bl from-[#F7F0E8] to-[#FAF5EF] border border-[#E8DCCE] p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-[#7A5C4D] font-medium block">أعلى منطقة تفاعلاً اليوم</span>
            <span className="text-lg font-bold text-[#3D251A]">الوسطى - النصيرات</span>
            <span className="text-[10px] text-[#8E5439] font-semibold bg-[#F0E3D5] px-2 py-0.5 rounded-full inline-block">
              340 تفاعل نشط
            </span>
          </div>
          <div className="p-3 bg-[#EBDCD0] text-[#7A452D] rounded-2xl shadow-xs">
            <MapPin size={22} />
          </div>
        </div>

      </div>

      {/* 4. الرسم البياني وقائمة أحدث التجار */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FAF5EF] border border-[#EBE0D3] p-5 rounded-3xl shadow-xs">
          <AnalyticsChart />
        </div>
        <div className="bg-[#FAF5EF] border border-[#EBE0D3] p-5 rounded-3xl shadow-xs">
          <RecentMerchants merchants={recentMerchants} loading={loading} />
        </div>
      </div>

    </div>
  );
}