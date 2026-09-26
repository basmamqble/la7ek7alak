import React, { useState, useEffect } from 'react';
import { BookOpen, Search, MapPin, Plus } from 'lucide-react';
import StoryCard from './storyCard';
import DeleteStoryModal from './deleteStoryModal';
import AddStory from './addStory';
import API from '../../api/axios'; 
import toast from 'react-hot-toast';

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

const merchantsList = [
  { id: 1, name: 'متجر الأناقة', category: 'ملابس وأزياء' },
  { id: 2, name: 'مطعم الشلال', category: 'مطاعم' },
  { id: 3, name: 'بيتزا البرنس', category: 'مطاعم' },
  { id: 4, name: 'مخابز السعادة', category: 'حلويات ومخابز' },
  { id: 5, name: 'إلكترونيات القدس', category: 'إلكترونيات' }
];

const getStoryStore = (story) => story.merchant?.store || story.merchant?.stores?.[0] || {};

const getStoryStoreName = (story) => {
  const store = getStoryStore(story);
  return store.name
    || story.merchant?.storeName
    || story.merchant?.store_name
    || story.merchant?.name
    || story.merchant?.user?.name
    || 'متجر';
};

const getStoryCity = (story) => {
  const store = getStoryStore(story);
  const city = story.merchant?.city ?? store.city;
  return String(
    story.merchant?.area
    || store.area
    || (typeof city === 'object' && (city.area || city.city || city.name || city.name_ar))
    || story.merchant?.cityName
    || store.cityName
    || (typeof city === 'string' ? city : '')
    || ''
  ).trim();
};



export default function Stories() {
  const [currentView, setCurrentView] = useState('list'); // 'list' أو 'add'
  // const [stories, setStories] = useState(initialStories);
  const [stories, setStories] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [selectedRegion, setSelectedRegion] = useState('الكل'); 
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

// أضف هذه الحالة داخل مكون Stories في ملف stories.jsx
const [merchantsList, setMerchantsList] = useState([]);
const [loadingMerchants, setLoadingMerchants] = useState(false);

const fetchActiveStories = async () => {
    try {
      const response = await API.get('/stories/active');
      const formatted = response.data.map(story => {
        const expiresAt = new Date(story.expiresAt);
        const timeLeftSeconds = Math.max(0, Math.floor((expiresAt - new Date()) / 1000));
        const city = getStoryCity(story);
        return {
          id: story.id,
          merchantName: getStoryStoreName(story),
          category: story.merchant?.category || '',
          city,
          locationDetail: city || 'الموقع غير محدد',
          content: story.description,
          timeLeftSeconds: timeLeftSeconds,
          views: 0,
          reportsCount: 0,
          status: story.status,
          imageUrl: story.mediaUrl || story.imageUrl
        };
      }).filter(story => story.timeLeftSeconds > 0);
      setStories(formatted);
    } catch (error) {
      console.error('Error fetching active stories:', error);
    }
  };

// دالة لجلب المتاجر من الباك-إند
const fetchMerchants = async () => {
  try {
    // استخدام نفس endpoint المؤكد في صفحة إدارة التجار
    const response = await API.get('/stories/merchants-list');
    // يدعم الاستجابة المباشرة أو المغلفة داخل data/merchants
    const responseData = response.data;
    const merchants = Array.isArray(responseData)
      ? responseData
      : responseData?.merchants || responseData?.data || [];

    const formatted = merchants.map((merchant) => {
      const store = merchant.store || merchant.stores?.[0] || merchant;
      const category = merchant.category ?? store.category;
      const categoryId = merchant.categoryId
        ?? merchant.category_id
        ?? store.categoryId
        ?? store.category_id
        ?? (typeof category === 'number' || !isNaN(Number(category)) ? category : category?.id)
        ?? '';
      const categoryName = merchant.categoryName
        ?? merchant.category_name
        ?? store.categoryName
        ?? category?.name
        ?? category?.name_ar
        ?? (typeof category === 'string' && isNaN(Number(category)) ? category : '');

      return {
        id: merchant.id ?? store.id,
        name: merchant.user?.name || merchant.name || store.name || 'متجر',
        category,
        categoryId,
        categoryName,
        city: merchant.city || store.city || '',
        cityName: merchant.area
          ?? store.area
          ?? merchant.cityName
          ?? store.cityName
          ?? merchant.city?.area
          ?? merchant.city?.city
          ?? merchant.city?.name
          ?? merchant.city?.name_ar
          ?? ''
      };
    });
    setMerchantsList(formatted);
  } catch (error) {
    console.error('Error fetching merchants:', error);
  }
};

useEffect(() => {
  fetchActiveStories();
  fetchMerchants();
}, []);

// الـ useEffect الخاص بالتايمر التنازلي للقصص
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setStories(prevStories => 
        prevStories.map(story => {
          if (story.timeLeftSeconds > 0) {
            return { ...story, timeLeftSeconds: story.timeLeftSeconds - 1 };
          }
          return story;
        }).filter(story => story.timeLeftSeconds > 0)
      );
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

if (currentView === 'add') {
    return (
      <AddStory 
        regions={regions}
        merchantsList={merchantsList}
        onBack={() => setCurrentView('list')}
        onAddStory={(newStory) => {
          // بعد إضافة ستوري جديدة بنجاح، قم بإعادة جلب القائمة الحية لتحديثها
          fetchActiveStories();
          setCurrentView('list');
        }}
      />
    );
  }

  const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) return "انتهى الوقت";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const confirmDelete = (story) => {
    setStoryToDelete(story);
    setIsModalOpen(true);
  };

  const handleDeleteStory = async () => {
    if (storyToDelete) {
      try {
        await API.delete(`/stories/${storyToDelete.id}`);
        setStories(prevStories => prevStories.filter(story => story.id !== storyToDelete.id));
        setIsModalOpen(false);
        setStoryToDelete(null);
        toast.success('تم حذف الستوري بنجاح');
      } catch (error) {
        toast.error(error.response?.data?.error || 'تعذر حذف الستوري');
      }
    }
  };

  const handleAddStory = (newStory) => {
    setStories([newStory, ...stories]);
    setCurrentView('list');
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          story.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'الكل' || story.city === selectedRegion;

    if (filter === 'active') return matchesSearch && matchesRegion && story.status === 'active';
    if (filter === 'reported') return matchesSearch && matchesRegion && story.reportsCount > 0;
    
    return matchesSearch && matchesRegion;
  });

  // إذا كانت الحالة 'add'، اعرض مكون إضافة الستوري مع تمرير قائمة المتاجر الحقيقية
  if (currentView === 'add') {
    return (
      <AddStory 
        regions={regions}
        merchantsList={merchantsList}
        onBack={() => setCurrentView('list')}
        onAddStory={handleAddStory}
      />
    );
  }

  return (
    <div className="space-y-6 bg-brand-bg min-h-screen p-6 relative" dir="rtl">
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
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3.5 py-2 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-2xl border border-purple-500/30 backdrop-blur-md">
            إجمالي العروض النشطة: {stories.length}
          </span>
          <button
            onClick={() => setCurrentView('add')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-secondary hover:bg-brand-secondary-hover text-white text-xs font-bold rounded-2xl transition shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            إضافة ستوري لمتجر
          </button>
        </div>
      </div>

      {/* شريط البحث وأزرار التصفية */}
      <div className="bg-brand-card p-4 rounded-3xl border border-brand-border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
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

      {/* شريط فلاتر المناطق */}
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
            <StoryCard 
              key={story.id} 
              story={story} 
              formatTime={formatTime} 
              onDeleteClick={confirmDelete} 
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-brand-card rounded-3xl border border-brand-border">
            <p className="text-xs text-brand-body font-medium">لا توجد عروض أو قصص مطابقة لخيارات البحث أو المنطقة المحددة.</p>
          </div>
        )}
      </div>

      {/* نافذة تأكيد الحذف */}
      <DeleteStoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteStory}
        story={storyToDelete}
      />
    </div>
  );
}
