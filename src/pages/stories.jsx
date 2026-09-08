import React, { useState, useEffect } from 'react';
import { Search, MapPin, Eye, Trash2, Clock, Store, Flame } from 'lucide-react';
import API from '../api/axios';

// قائمة المناطق الثابتة المعتمدة
const CITIES_LIST = [
  'شمال غزة',
  'غزة',
  'النصيرات',
  'البريج',
  'المغازي',
  'دير البلح',
  'خانيونس',
  'رفح',
];

// مكون العداد التنازلي الحركي
function StoryTimer({ initialTime }) {
  const parseTimeToSeconds = (timeStr) => {
    if (typeof timeStr === 'number') return timeStr;
    const [hours, minutes, seconds] = (timeStr || '00:00:00').split(':').map(Number);
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  };

  const [secondsLeft, setSecondsLeft] = useState(() => parseTimeToSeconds(initialTime));

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="absolute top-3 right-3 bg-brand-primary/80 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 font-mono tracking-wider backdrop-blur-xs shadow-xs">
      <Clock size={12} className="text-brand-secondary animate-pulse" />
      <span>متبقي {formatTime(secondsLeft)}</span>
    </div>
  );
}

// بيانات وهمية افتراضية
const defaultStories = [
  {
    id: 1,
    title: 'خصم 30% على الوجبات العائلية',
    storeName: 'بيتزا البرنس',
    location: 'النصيرات - الشارع العام',
    views: 342,
    remainingTime: '05:20:10',
    city: 'النصيرات',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
  },
  {
    id: 2,
    title: 'وجبة سوبر كومبو + مشروب مجاني',
    storeName: 'مطعم الشلال',
    location: 'غزة - الرمال',
    views: 189,
    remainingTime: '11:45:00',
    city: 'غزة',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
  },
  {
    id: 3,
    title: 'تخفيضات 50% على تشكيلة الصيف',
    storeName: 'متجر الأناقة',
    location: 'خانيونس - البلد',
    views: 512,
    remainingTime: '18:10:05',
    city: 'خانيونس',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&q=80',
  },
];

export default function Stories() {
  const [stories, setStories] = useState(defaultStories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedStore, setSelectedStore] = useState('ALL');

  // جلب الـ Stories الحقيقية عند توفر الباك إند
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await API.get('/admin/active-stories');
        if (response.data && response.data.length > 0) {
          setStories(response.data);
        }
      } catch (err) {
        console.log('استخدام البيانات الافتراضية للستوريات');
      }
    };
    fetchStories();
  }, []);

  const handleDeleteStory = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف/تجميد هذه الـ Story المخالفة؟')) {
      try {
        await API.delete(`/admin/stories/${id}`);
      } catch (err) {
        console.log('حذف محلي في حالة عدم توفر السيرفر');
      }
      setStories(stories.filter((story) => story.id !== id));
    }
  };

  // فلترة حسب البحث والمدينة والمتجر
  const filteredStories = stories.filter((story) => {
    const storeName = story.storeName || story.store_name || '';
    const title = story.title || '';
    const city = story.city?.name || story.city || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'ALL' || city === selectedCity;
    const matchesStore = selectedStore === 'ALL' || storeName === selectedStore;

    return matchesSearch && matchesCity && matchesStore;
  });

  // قائمة المتاجر المستخرجة ديناميكياً
  const uniqueStores = Array.from(
    new Set(stories.map((s) => s.storeName || s.store_name).filter(Boolean))
  );

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* الهيدر العلوي */}
      <div className="bg-brand-card p-6 rounded-2xl border border-brand-border shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand-secondary-soft text-brand-primary rounded-2xl">
            <Flame size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-primary">
              إدارة الـ Stories الحية
            </h1>
            <p className="text-xs text-brand-body/70 mt-1">
              مراقبة جميع العروض والخصومات المنشورة حالياً ومراجعة المحتوى
            </p>
          </div>
        </div>
      </div>

      {/* شريط الفلترة والأدوات */}
      <div className="bg-brand-card p-4 rounded-2xl border border-brand-border flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* حقل البحث */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="ابحث باسم العرض أو المتجر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition"
            />
            <Search size={15} className="absolute right-3.5 top-3 text-brand-body/40" />
          </div>

          {/* قائمة المناطق */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-body focus:outline-none focus:border-brand-primary cursor-pointer transition"
          >
            <option value="ALL">المدينة: كل المدن</option>
            {CITIES_LIST.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* قائمة التجار */}
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-3 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-body focus:outline-none focus:border-brand-primary cursor-pointer transition"
          >
            <option value="ALL">المتجر: جميع التجار</option>
            {uniqueStores.map((store, idx) => (
              <option key={idx} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>

        {/* عدد العروض النشطة */}
        <div className="bg-brand-secondary-soft border border-brand-border text-brand-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
          <span>إجمالي العروض النشطة:</span>
          <span className="text-brand-secondary font-mono text-sm">{filteredStories.length}</span>
        </div>
      </div>

      {/* كروت الـ Stories */}
      {filteredStories.length === 0 ? (
        <div className="bg-brand-card rounded-2xl border border-brand-border p-12 text-center text-brand-body/60 space-y-2 shadow-xs">
          <div className="text-3xl">🔥</div>
          <p className="text-xs font-medium">لا توجد Stories نشطة حالياً مطابقة لشروط البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const storeName = story.storeName || story.store_name || 'متجر جديد';
            const location = story.location || story.address || story.city || 'غزة';

            return (
              <div
                key={story.id}
                className="bg-brand-card rounded-2xl border border-brand-border shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:border-brand-border/80"
              >
                <div>
                  <div className="relative h-48 w-full bg-brand-bg">
                    <img
                      src={story.image || story.media_url}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <StoryTimer initialTime={story.remainingTime || story.expiresAt || '12:00:00'} />
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-sm text-brand-primary leading-snug">{story.title}</h3>

                    <div className="space-y-1.5 text-xs">
                      <p className="flex items-center gap-1.5 font-bold text-brand-primary">
                        <Store size={14} className="text-brand-secondary" />
                        <span>{storeName}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-brand-body/70 text-[11px]">
                        <MapPin size={13} className="text-brand-body/50" />
                        <span>{location}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-brand-body/70 text-[11px] pt-1 border-t border-brand-border/50">
                        <Eye size={13} className="text-brand-body/50" />
                        <span>{story.views || 0} مشاهدة حية</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>حذف / تجميد الـ Story المخالفة</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}