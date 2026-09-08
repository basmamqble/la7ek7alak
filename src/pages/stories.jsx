import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Eye, 
  Trash2, 
  Store, 
  Search, 
  MapPin 
} from 'lucide-react';

// بيانات تجريبية مع المناطق الفعلية وثوانٍ متبقية حقيقية
const initialStories = [
  {
    id: 1,
    merchantName: 'متجر الأناقة',
    category: 'ملابس وأزياء',
    city: 'خانيونس',
    locationDetail: 'خانيونس - البلد',
    content: 'تخفيضات 50% على تشكيلة الصيف',
    timeLeftSeconds: 18 * 3600 + 9 * 60 + 59,
    views: 512,
    reportsCount: 0,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    merchantName: 'مطعم الشلال',
    category: 'مطاعم',
    city: 'غزة',
    locationDetail: 'غزة - الرمال',
    content: 'وجبة سوبر كومبو + مشروب مجاني',
    timeLeftSeconds: 11 * 3600 + 44 * 60 + 54,
    views: 189,
    reportsCount: 0,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    merchantName: 'بيتزا البرنس',
    category: 'مطاعم',
    city: 'النصيرات',
    locationDetail: 'النصيرات - الشارع العام',
    content: 'خصم 30% على الوجبات العائلية',
    timeLeftSeconds: 5 * 3600 + 20 * 60 + 4,
    views: 342,
    reportsCount: 1,
    status: 'reported',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  }
];

// قائمة المناطق الفعلية
const regions = [
  "الكل",
  "شمال غزة",
  "غزة",
  "النصيرات",
  "البريج",
  "المغازي",
  "دير البلح",
  "خانيونس"
];

export default function Stories() {
  const [stories, setStories] = useState(initialStories);
  const [filter, setFilter] = useState('all'); 
  const [selectedRegion, setSelectedRegion] = useState('الكل'); 
  const [searchQuery, setSearchQuery] = useState('');

  // تشغيل التايمر الحقيقي (ينقص ثانية كل ثانية)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setStories(prevStories => 
        prevStories.map(story => {
          if (story.timeLeftSeconds > 0) {
            return { ...story, timeLeftSeconds: story.timeLeftSeconds - 1 };
          }
          return story;
        })
      );
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // دالة تحويل الثواني إلى صيغة وقت نصية (HH:MM:SS)
  const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) return "انتهى الوقت";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleDeleteStory = (id) => {
    setStories(stories.filter(story => story.id !== id));
  };

  // تصفية القصص بناءً على البحث، الحالة، والمنطقة المحددة
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          story.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'الكل' || story.city === selectedRegion;

    if (filter === 'active') return matchesSearch && matchesRegion && story.status === 'active';
    if (filter === 'reported') return matchesSearch && matchesRegion && story.reportsCount > 0;
    
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6 bg-brand-bg min-h-screen p-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-l from-brand-primary to-slate-900 p-6 rounded-3xl text-white shadow-lg">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="text-brand-secondary" size={24} />
            إدارة الـ Stories الحية (Active Stories Moderation)
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            مراقبة جميع العروض المنشورة حالياً في التطبيق، تصفيتها حسب المناطق، ومتابعة العدادات الحية.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-2 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-2xl border border-purple-500/30 backdrop-blur-md">
            إجمالي العروض النشطة: {stories.length}
          </span>
        </div>
      </div>

      {/* شريط البحث وأزرار تصفية الحالة */}
      <div className="bg-brand-card p-4 rounded-3xl border border-brand-border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* خانة البحث */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-body/60" size={18} />
          <input 
            type="text" 
            placeholder="ابحث باسم العرض أو المتجر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-bg pr-10 pl-4 py-2.5 rounded-2xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-secondary transition"
          />
        </div>

        {/* أزرار تصفية الحالة */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              filter === 'all' ? 'bg-brand-primary text-white shadow-sm' : 'bg-brand-bg text-brand-body hover:bg-brand-border/40'
            }`}
          >
            كل العروض
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              filter === 'active' ? 'bg-brand-secondary text-white shadow-sm' : 'bg-brand-bg text-brand-body hover:bg-brand-border/40'
            }`}
          >
            النشطة فقط
          </button>
          <button 
            onClick={() => setFilter('reported')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              filter === 'reported' ? 'bg-rose-600 text-white shadow-sm' : 'bg-brand-bg text-brand-body hover:bg-brand-border/40'
            }`}
          >
            مبلغ عنها ⚠️
          </button>
        </div>
      </div>

      {/* شريط فلاتر المناطق بتصميم أزرار (Pills) أنيقة بدل القائمة المنسدلة */}
      <div className="bg-brand-card p-3.5 rounded-3xl border border-brand-border shadow-sm flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-body font-bold shrink-0">
          <MapPin size={15} className="text-brand-secondary" />
          <span>المناطق:</span>
        </div>
        <div className="flex items-center gap-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedRegion === region 
                  ? 'bg-brand-secondary text-white shadow-sm' 
                  : 'bg-brand-bg text-brand-body hover:bg-brand-border/50 border border-brand-border/60'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* شبكة عرض القصص */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.length > 0 ? (
          filteredStories.map((story) => (
            <div 
              key={story.id} 
              className="bg-brand-card rounded-3xl border border-brand-border shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md"
            >
              {/* جزء الصورة والتايمر الحي */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img 
                  src={story.imageUrl} 
                  alt={story.merchantName} 
                  className="w-full h-full object-cover opacity-90"
                />
                
                {/* التايمر التنازلي الحي الفعال */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/15 shadow-lg">
                  <Clock size={12} className="text-amber-400 animate-pulse" />
                  <span dir="ltr" className="tracking-wider">متبقي {formatTime(story.timeLeftSeconds)}</span>
                </div>
              </div>

              {/* تفاصيل العرض والمتجر */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 text-center">
                  <h3 className="font-bold text-brand-primary text-sm">{story.content}</h3>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-brand-body">
                    <Store size={14} className="text-brand-secondary" />
                    <span className="font-semibold">{story.merchantName}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-brand-body/70">
                    <MapPin size={12} />
                    <span>{story.locationDetail}</span>
                  </div>
                </div>

                {/* المشاهدات */}
                <div className="flex items-center justify-center gap-1 text-xs text-brand-body/80 pt-2 border-t border-brand-border/60">
                  <Eye size={14} className="text-brand-secondary" />
                  <span>{story.views} مشاهدة الحالية</span>
                </div>

                {/* زر حذف / تجميد القصة */}
                <div className="pt-2">
                  <button 
                    onClick={() => handleDeleteStory(story.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-bold rounded-2xl border border-rose-200 transition cursor-pointer shadow-sm"
                  >
                    <Trash2 size={14} /> حذف / تجميد الـ Story المخالفة
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-brand-card rounded-3xl border border-brand-border">
            <p className="text-xs text-brand-body font-medium">لا توجد عروض أو قصص مطابقة لخيارات البحث أو المنطقة المحددة.</p>
          </div>
        )}
      </div>
    </div>
  );
}