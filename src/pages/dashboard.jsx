import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Store, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  MapPin, 
  ShieldAlert,
  ChevronLeft
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// بيانات تجريبية لتحليلات نمو المستخدمين والقصص
const activityData = [
  { time: '10 AM', stories: 12, users: 45 },
  { time: '12 PM', stories: 28, users: 89 },
  { time: '2 PM', stories: 45, users: 130 },
  { time: '4 PM', stories: 35, users: 95 },
  { time: '6 PM', stories: 60, users: 180 },
  { time: '8 PM', stories: 50, users: 140 },
];

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

      {/* الـ 4 بطاقات الرئيسية (KPIs) - بخلغيات ملونة جذابة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* العملاء */}
        <div 
          onClick={() => navigate('/customers')}
          className="bg-gradient-to-br from-blue-500/10 via-brand-card to-brand-card p-5 rounded-3xl border border-blue-200/50 shadow-sm space-y-3 cursor-pointer hover:shadow-md hover:border-blue-400 transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-sm group-hover:scale-110 transition">
              <Users size={20} />
            </div>
            <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl text-xs font-bold">
              <ArrowUpRight size={14} /> +18%
            </span>
          </div>
          <div>
            <p className="text-xs text-brand-body font-semibold">إجمالي العملاء</p>
            <h3 className="text-2xl font-black text-brand-primary mt-1">12,540</h3>
          </div>
          <p className="text-[11px] text-brand-body/70">مقارنة بالأسبوع الماضي</p>
        </div>

        {/* المتاجر */}
        <div 
          onClick={() => navigate('/merchants')}
          className="bg-gradient-to-br from-amber-500/10 via-brand-card to-brand-card p-5 rounded-3xl border border-amber-200/50 shadow-sm space-y-3 cursor-pointer hover:shadow-md hover:border-amber-400 transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-sm group-hover:scale-110 transition">
              <Store size={20} />
            </div>
            <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl text-xs font-bold">
              <ArrowUpRight size={14} /> +7%
            </span>
          </div>
          <div>
            <p className="text-xs text-brand-body font-semibold">المتاجر النشطة</p>
            <h3 className="text-2xl font-black text-brand-primary mt-1">438</h3>
          </div>
          <p className="text-[11px] text-brand-body/70">موزعة ميدانياً بفاعلية</p>
        </div>

        {/* القصص والعروض */}
        <div 
          onClick={() => navigate('/stories')}
          className="bg-gradient-to-br from-purple-500/10 via-brand-card to-brand-card p-5 rounded-3xl border border-purple-200/50 shadow-sm space-y-3 cursor-pointer hover:shadow-md hover:border-purple-400 transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-sm group-hover:scale-110 transition">
              <BookOpen size={20} />
            </div>
            <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl text-xs font-bold">
              <ArrowUpRight size={14} /> +24%
            </span>
          </div>
          <div>
            <p className="text-xs text-brand-body font-semibold">القصص النشطة اليوم</p>
            <h3 className="text-2xl font-black text-brand-primary mt-1">1,240</h3>
          </div>
          <p className="text-[11px] text-brand-body/70">تغلق تباعاً خلال ساعات</p>
        </div>

        {/* البلاغات المعلقة */}
        <div 
          onClick={() => navigate('/reports')}
          className="bg-gradient-to-br from-rose-500/10 via-brand-card to-brand-card p-5 rounded-3xl border border-rose-200/50 shadow-sm space-y-3 cursor-pointer hover:shadow-md hover:border-rose-400 transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-sm group-hover:scale-110 transition">
              <AlertTriangle size={20} />
            </div>
            <span className="flex items-center gap-0.5 text-rose-700 bg-rose-100 px-2.5 py-1 rounded-xl text-xs font-bold">
              <ArrowDownRight size={14} /> -4%
            </span>
          </div>
          <div>
            <p className="text-xs text-brand-body font-semibold">البلاغات المعلقة</p>
            <h3 className="text-2xl font-black text-brand-primary mt-1">23</h3>
          </div>
          <p className="text-[11px] text-brand-body/70">تتطلب مراجعة فورية</p>
        </div>
      </div>

      {/* قسم الإجراءات العاجلة (Action Required) - بتصميم ملون وواضح */}
      <div className="bg-gradient-to-l from-amber-500/15 via-amber-500/5 to-brand-card p-6 rounded-3xl border border-amber-300/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-sm">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="font-bold text-base text-brand-primary">إجراءات عاجلة تتطلب تدخلك</h2>
            <p className="text-xs text-brand-body">تنبيهات سريعة لمتابعة جودة المحتوى والرقابة</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* البطاقة الأولى: القصص المبلغ عنها */}
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

          {/* البطاقة الثانية: قصص تنتهي قريباً */}
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

      {/* الرسوم البيانية والتحليلات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* نشاط القصص والمستخدمين على مدار اليوم */}
        <div className="lg:col-span-2 bg-brand-card p-6 rounded-3xl border border-brand-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-2xl">
                <TrendingUp size={20} />
              </div>
              <h2 className="font-bold text-base text-brand-primary">حركة تفاعل المستخدمين والقصص اليوم</h2>
            </div>
            <span className="text-xs text-brand-body bg-brand-bg px-3 py-1.5 rounded-xl border border-brand-border font-medium">
              اليوم الحالي
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e2e8f0', 
                    borderRadius: '16px',
                    fontSize: '12px',
                    direction: 'rtl',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="users" name="العملاء المتفاعلون" stroke="#0f172a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="stories" name="القصص المنشورة" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStories)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* توزيع المتاجر حسب المحافظات (City Performance) */}
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

      {/* قسم التصنيفات الأكثر طلباً */}
      <div className="bg-brand-card p-6 rounded-3xl border border-brand-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-brand-border">
          <h2 className="font-bold text-base text-brand-primary">التصنيفات الأكثر نشاطاً وتفاعلاً</h2>
          <span 
            onClick={() => navigate('/categories')}
            className="text-xs text-brand-secondary font-bold cursor-pointer hover:underline flex items-center gap-1 bg-brand-secondary/10 px-3 py-1.5 rounded-xl transition hover:bg-brand-secondary/20"
          >
            عرض الكل <ChevronLeft size={14} />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
  );
}