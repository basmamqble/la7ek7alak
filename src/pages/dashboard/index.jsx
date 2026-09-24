import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Store, 
  BookOpen, 
  AlertTriangle, 
  MapPin, 
  ShieldAlert,
  ChevronLeft
} from 'lucide-react';

// استيراد المكونات المنفصلة
import StatCard from '../../components/dashboard/statCard';
import AnalyticsChart from '../../components/dashboard/analyticsChart';
import RecentMerchants from '../../components/dashboard/recentMerchants';

const categoryData = [
  { name: 'مطاعم', count: 45 },
  { name: 'ملابس وأزياء', count: 34 },
  { name: 'إلكترونيات', count: 22 },
  { name: 'حلويات ومخابز', count: 18 },
  { name: 'صحة وجمال', count: 12 },
];

const cityData = [
  { city: 'غزة', percentage: 48, count: 210 },
  { city: 'الوسطى', percentage: 28, count: 125 },
  { city: 'خانيونس', percentage: 16, count: 70 },
  { city: 'رفح', percentage: 8, count: 35 },
];

const sampleMerchants = [
  { storeName: 'متجر الشروق للإلكترونيات', city: 'غزة' },
  { storeName: 'مطعم السعادة', city: 'الوسطى' },
  { storeName: 'أزياء ريم', city: 'خانيونس' },
  { storeName: 'مخابز الأمل', city: 'رفح' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-brand-bg min-h-screen p-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-l from-brand-primary to-slate-900 p-6 rounded-3xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">
            أهلاً بك، يا أدمن 👋
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            إليك نظرة شاملة ومحدثة على حركة ونشاط منصة <span className="font-semibold text-brand-secondary">لحّق حالك</span> اليوم.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-2xl border border-emerald-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            النظام يعمل بكفاءة عالية
          </span>
        </div>
      </div>

      {/* الـ 4 بطاقات الرئيسية (KPIs) باستخدام مكون StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي العملاء" 
          value="12,540" 
          icon={Users} 
          trend="+18%" 
          trendType="up"
          description="مقارنة بالأسبوع الماضي"
          bgGradient="bg-gradient-to-br from-blue-500/10 via-brand-card to-brand-card border-blue-200/50 hover:border-blue-400"
          iconBg="bg-blue-500"
          onClick={() => navigate('/customers')}
        />
        <StatCard 
          title="المتاجر النشطة" 
          value="438" 
          icon={Store} 
          trend="+7%" 
          trendType="up"
          description="موزعة ميدانياً بفاعلية"
          bgGradient="bg-gradient-to-br from-amber-500/10 via-brand-card to-brand-card border-amber-200/50 hover:border-amber-400"
          iconBg="bg-amber-500"
          onClick={() => navigate('/merchants')}
        />
        <StatCard 
          title="القصص النشطة اليوم" 
          value="1,240" 
          icon={BookOpen} 
          trend="+24%" 
          trendType="up"
          description="تغلق تباعاً خلال ساعات"
          bgGradient="bg-gradient-to-br from-purple-500/10 via-brand-card to-brand-card border-purple-200/50 hover:border-purple-400"
          iconBg="bg-purple-600"
          onClick={() => navigate('/stories')}
        />
        <StatCard 
          title="البلاغات المعلقة" 
          value="23" 
          icon={AlertTriangle} 
          trend="-4%" 
          trendType="down"
          description="تتطلب مراجعة فورية"
          bgGradient="bg-gradient-to-br from-rose-500/10 via-brand-card to-brand-card border-rose-200/50 hover:border-rose-400"
          iconBg="bg-rose-600"
          onClick={() => navigate('/reports')}
        />
      </div>

      {/* قسم الإجراءات العاجلة (Action Required) متضمنة طلبات التوثيق */}
      <div className="bg-gradient-to-l from-amber-500/15 via-amber-500/5 to-brand-card p-6 rounded-3xl border border-amber-300/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-sm">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="font-bold text-base text-brand-primary">إجراءات عاجلة تتطلب تدخلك</h2>
            <p className="text-xs text-brand-body">تنبيهات سريعة لمتابعة جودة المحتوى والرقابة وطلبات المتاجر</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* طلبات توثيق المتاجر */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-200 flex items-center justify-between shadow-sm hover:border-amber-400 transition">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg">توثيق المتاجر</span>
              <p className="text-xs font-bold text-brand-primary">طلبات توثيق معلقة</p>
              <p className="text-[11px] text-brand-body">5 متاجر رفعت أوراقها بانتظار الاعتماد</p>
            </div>
            <button 
              onClick={() => navigate('/verifications')}
              className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition cursor-pointer shadow-sm"
            >
              مراجعة
            </button>
          </div>

          {/* قصص مبلغ عنها */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-rose-200 flex items-center justify-between shadow-sm hover:border-rose-400 transition">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-lg">رقابة المحتوى</span>
              <p className="text-xs font-bold text-brand-primary">قصص مبلغ عنها</p>
              <p className="text-[11px] text-brand-body">8 قصص تحتوي بلاغات تضلل المستخدمين</p>
            </div>
            <button 
              onClick={() => navigate('/reports')}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition cursor-pointer shadow-sm"
            >
              فحص الآن
            </button>
          </div>

          {/* قصص تنتهي قريباً */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-200 flex items-center justify-between shadow-sm hover:border-blue-400 transition">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg">حركة العروض</span>
              <p className="text-xs font-bold text-brand-primary">قصص تنتهي خلال ساعة</p>
              <p className="text-[11px] text-brand-body">14 قصة ستختفي قريباً من المنصة</p>
            </div>
            <button 
              onClick={() => navigate('/stories')}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-hover transition cursor-pointer shadow-sm"
            >
              استعراض
            </button>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية وأداء المحافظات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>

        <div className="bg-brand-card p-6 rounded-3xl border border-brand-border shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-brand-border">
            <div className="p-2.5 bg-brand-secondary/10 text-brand-secondary rounded-2xl">
              <MapPin size={20} />
            </div>
            <h2 className="font-bold text-base text-brand-primary">أداء ونشاط المحافظات</h2>
          </div>

          <div className="space-y-4 pt-2">
            {cityData.map((item, index) => (
              <div key={index} className="space-y-1.5 bg-brand-bg/60 p-3 rounded-2xl border border-brand-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-primary">{item.city}</span>
                  <span className="text-brand-body font-medium">{item.count} متجر ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-secondary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-brand-body/80 bg-brand-secondary/5 p-3 rounded-2xl border border-brand-secondary/20">
              📍 تركز العروض الأعلى حالياً في محافظة غزة والمحافظة الوسطى.
            </p>
          </div>
        </div>
      </div>

      {/* أحدث التجار والتصنيفات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <RecentMerchants merchants={sampleMerchants} onViewAll={() => navigate('/merchants')} />
        </div>

        <div className="lg:col-span-2 bg-brand-card p-6 rounded-3xl border border-brand-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <h2 className="font-bold text-base text-brand-primary">التصنيفات الأكثر نشاطاً وتفاعلاً</h2>
            <span 
              onClick={() => navigate('/categories')}
              className="text-xs text-brand-secondary font-bold cursor-pointer hover:underline flex items-center gap-1 bg-brand-secondary/10 px-3 py-1.5 rounded-xl transition hover:bg-brand-secondary/20"
            >
              عرض الكل <ChevronLeft size={14} />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryData.map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate('/categories')}
                className="bg-gradient-to-br from-brand-bg to-brand-card p-4 rounded-2xl border border-brand-border space-y-2 hover:border-brand-secondary hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-brand-body/70 bg-brand-border/40 px-2 py-0.5 rounded-md">#0{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full bg-brand-secondary group-hover:scale-125 transition"></span>
                </div>
                <h3 className="font-bold text-brand-primary text-sm pt-1">{cat.name}</h3>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-brand-border/50">
                  <span className="text-brand-body/80">العروض النشطة:</span>
                  <span className="font-black text-brand-secondary">{cat.count} قصة</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}