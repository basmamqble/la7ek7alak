import { useEffect, useState } from 'react';
import { Store, MapPin, Upload, ArrowRight, PlusCircle, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const CITY_NAMES = {
  1: 'شمال غزة',
  2: 'غزة',
  3: 'النصيرات',
  4: 'البريج',
  5: 'المغازي',
  6: 'دير البلح',
  7: 'خانيونس',
};

const ALLOWED_IMAGE_TYPES = ['image/jpg','image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

const getCityName = (merchant) => {
  const store = merchant?.store || merchant?.stores?.[0] || {};
  const city = merchant?.city ?? store.city;
  const cityValue = typeof city === 'object' ? (
    city.area
    ?? city.city
    ?? city.cityName
    ?? city.name
    ?? city.name_ar
    ?? ''
  ) : city;
  const cityId = merchant?.cityId
    ?? merchant?.city_id
    ?? store.cityId
    ?? store.city_id
    ?? (typeof city === 'object' ? city.id : undefined);

  return String(
    merchant?.area
    || store.area
    || merchant?.cityName
    || store.cityName
    || cityValue
    || CITY_NAMES[cityId]
    || ''
  ).trim();
};

export default function AddStory({ merchantsList, onBack, onAddStory }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedMerchantId, setSelectedMerchantId] = useState('');
  const [city, setCity] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/admin/categories');
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error(error.response?.data?.error || 'تعذر تحميل تصنيفات قاعدة البيانات');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const getMerchantCategory = (merchant) => {
    const category = merchant.category;
    const categoryId = merchant.categoryId
      ?? merchant.category_id
      ?? merchant.store?.categoryId
      ?? merchant.store?.category_id
      ?? (typeof category === 'number' || !isNaN(Number(category)) ? category : category?.id);
    const categoryName = merchant.categoryName ?? merchant.category_name ?? merchant.storeCategory ?? category?.name ?? category?.name_ar;

    return {
      id: categoryId == null ? '' : String(categoryId),
      name: typeof categoryName === 'string'
        ? categoryName.trim()
        : typeof category === 'string' && isNaN(Number(category))
          ? category.trim()
          : '',
    };
  };

  // فلترة المتاجر بناءً على التصنيف المختار
  const filteredMerchants = merchantsList ? merchantsList.filter(m => {
    if (!selectedCategory) return true;
    const merchantCategory = getMerchantCategory(m);
    const category = categories.find((item) => String(item.id) === selectedCategory);
    if (merchantCategory.id) return merchantCategory.id === selectedCategory;
    return Boolean(category && merchantCategory.name === category.name);
  }) : [];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedMerchantId('');
  };

  // اختيار المتجر وجلب مدينته من بيانات قاعدة البيانات تلقائياً
  const handleMerchantSelect = (e) => {
    const merchantId = e.target.value;
    setSelectedMerchantId(merchantId);

    if (merchantId) {
      // البحث عن المتجر المختار من القائمة
      const merchant = merchantsList.find(m => String(m.id ?? m._id) === String(merchantId));

      if (merchant) {
        setCity(getCityName(merchant));
      }
    } else {
      setCity('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_IMAGE_TYPES.includes(file.type) || !ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
        toast.error('الملف غير مدعوم. ارفع صورة بصيغة JPG أو PNG أو WEBP فقط؛ الفيديو غير مسموح.');
        e.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('حجم الصورة يجب ألا يتجاوز 10 ميغابايت');
        e.target.value = '';
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(String(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedMerchantId || !content.trim() || !imageFile) {
      toast.error('يرجى اختيار التصنيف والمتجر وإضافة التفاصيل والصورة', {
        style: { background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 'bold', borderRadius: '16px' },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('merchantId', selectedMerchantId);
      formData.append('description', content.trim());

      const response = await API.post('/stories/addstories', formData);

      onAddStory(response.data.story);

      toast.success('تمت إضافة الستوري للمتجر بنجاح ✨', {
        style: { background: '#10b981', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', borderRadius: '16px' },
        iconTheme: { primary: '#ffffff', secondary: '#10b981' },
        
      });

    } catch (err) {
      console.error('Error adding story:', err);
      toast.error(err.response?.data?.error || 'حدث خطأ أثناء نشر الستوري', {
        style: { background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 'bold', borderRadius: '16px' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  

  return (
    <div className="space-y-6 bg-brand-bg min-h-screen p-6 max-w-3xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between bg-brand-card p-6 rounded-3xl border border-brand-border shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-brand-primary flex items-center gap-2">
            <PlusCircle className="text-brand-secondary" size={22} />
            إضافة ستوري جديدة لمتجر
          </h1>
          <p className="text-xs text-brand-body mt-1">
            اختر التصنيف، ثم المتجر ليتم تعيين مدينته تلقائياً، وأضف تفاصيل العرض.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-bg hover:bg-brand-border/40 text-brand-primary border border-brand-border rounded-2xl text-xs font-bold transition cursor-pointer"
        >
          <ArrowRight size={16} />
          العودة للقصص
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-card p-6 rounded-3xl border border-brand-border space-y-5 shadow-sm">

        {/* اختيار التصنيف */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-body">1. اختر التصنيف</label>
          <div className="relative">
            <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-body/60" size={18} />
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={loadingCategories || categories.length === 0}
              className="w-full bg-brand-bg pr-11 pl-4 py-3 rounded-2xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-secondary transition"
            >
              <option value="">{loadingCategories ? 'جاري تحميل التصنيفات...' : '-- اختر التصنيف --'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* اختيار المتجر */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-body">2. اختر المتجر من قائمة التجار المسجلين </label>
          <div className="relative">
            <Store className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-body/60" size={18} />
            <select
              value={selectedMerchantId}
              onChange={handleMerchantSelect}
              disabled={!selectedCategory}
              className="w-full bg-brand-bg pr-11 pl-4 py-3 rounded-2xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-secondary transition disabled:opacity-50"
            >
              <option value="">{selectedCategory ? '-- اختر المتجر --' : 'الرجاء اختيار التصنيف أولاً'}</option>
              {filteredMerchants.map((m) => {
                const mCity = getCityName(m);
                return (
                  <option key={m.id} value={m.id}>
                    {m.storeName || m.name || 'متجر بدون اسم'} {mCity ? `- (${mCity})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
          {selectedCategory && filteredMerchants.length === 0 && (
            <p className="text-[10px] text-rose-500 mt-1">لا توجد متاجر مسجلة في قاعدة البيانات لهذا التصنيف حالياً.</p>
          )}
        </div>

        {/* عرض المدينة المرتبطة بالمتجر المختار */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-body">المدينة (تُحدد تلقائياً من بيانات المتجر)</label>
          <div className="relative">
            <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-body/60" size={18} />
            <input
              type="text"
              value={city}
              readOnly
              placeholder="اختر المتجر أولاً"
              className="w-full bg-brand-bg pr-11 pl-4 py-3 rounded-2xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-secondary transition read-only:cursor-not-allowed read-only:opacity-80"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-body">محتوى العرض أو تفاصيل القصة </label>
          <textarea
            rows="4"
            placeholder="اكتب تفاصيل العرض هنا..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-brand-bg p-3.5 rounded-2xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-secondary transition resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-body">صورة العرض (من ملفات الجهاز)</label>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-border border-dashed rounded-2xl cursor-pointer bg-brand-bg hover:bg-brand-border/20 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                <Upload className="w-7 h-7 mb-2 text-brand-secondary" />
                <p className="text-xs font-bold text-brand-primary">
                  {imageFile ? imageFile.name : 'اضغط لاختيار صورة من ملفاتك'}
                </p>
                <p className="text-[10px] text-brand-body mt-1">PNG, JPG, WEBP</p>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-brand-border">
                <img src={imagePreview} alt="معاينة الصورة" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(''); }}
                  className="absolute top-2 left-2 bg-rose-600 text-white p-1.5 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-rose-700 transition"
                >
                  حذف الصورة
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3.5 bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold rounded-2xl text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'جاري النشر...' : 'نشر الستوري للمتجر'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3.5 bg-brand-bg hover:bg-brand-border/40 text-brand-primary border border-brand-border font-bold rounded-2xl text-xs transition cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
