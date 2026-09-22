import React, { useState } from 'react';
import { Store, MapPin, Upload, ArrowRight, PlusCircle, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddStory({ regions, merchantsList, onBack, onAddStory }) {
  // التصنيفات الرسمية المعتمدة في النظام
  const officialCategories = [
    'ملابس وموضة',
    'مطاعم وكافيهات',
    'إلكترونيات',
    'عطور ومستحضرات',
    'أدوات منزلية',
    'سوبر ماركت'
  ];

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMerchantId, setSelectedMerchantId] = useState('');
  const [city, setCity] = useState(regions && regions.length > 0 ? regions.filter(r => r !== 'الكل')[0] || 'غزة' : 'غزة');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // فلترة المتاجر بناءً على التصنيف المختار
  const filteredMerchants = merchantsList ? merchantsList.filter(m => {
    if (!selectedCategory) return true;
    const merchantCat = (m.category || m.storeCategory || '').trim();
    
    if (selectedCategory === 'مطاعم وكافيهات') {
      return merchantCat.includes('مطاعم') || merchantCat.includes('كافيهات') || merchantCat.includes('مخبز') || merchantCat.includes('حلويات');
    }
    if (selectedCategory === 'ملابس وموضة') {
      return merchantCat.includes('ملابس') || merchantCat.includes('أزياء') || merchantCat.includes('موضة');
    }
    return merchantCat.includes(selectedCategory);
  }) : [];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedMerchantId('');
  };

  // اختيار المتجر وجلب مدينته من قاعدة البيانات تلقائياً 100%
  const handleMerchantSelect = (e) => {
    const merchantId = e.target.value;
    setSelectedMerchantId(merchantId);

    if (merchantId) {
      const chosenMerchant = merchantsList.find(m => m.id.toString() === merchantId.toString());
      if (chosenMerchant) {
        // البحث عن أي حقل يمثل المدينة في بيانات المتجر القادمة من الباك إند
        const merchantCity = chosenMerchant.city || chosenMerchant.region || chosenMerchant.location || chosenMerchant.cityName;
        
        if (merchantCity) {
          // مطابقة المدينة مع القائمة المتاحة لتحديدها تلقائياً
          const matchedRegion = regions.find(r => r.trim() === merchantCity.trim() || r.includes(merchantCity) || merchantCity.includes(r));
          if (matchedRegion) {
            setCity(matchedRegion);
          } else {
            setCity(merchantCity);
          }
        }
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedMerchantId || !content.trim()) {
      toast.error('يرجى اختيار التصنيف، المتجر، وتعبئة تفاصيل العرض', {
        style: { background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 'bold', borderRadius: '16px' },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const chosenMerchant = merchantsList.find(m => m.id.toString() === selectedMerchantId.toString());
      
      const newStory = {
        id: Date.now(),
        merchantId: selectedMerchantId,
        merchantName: chosenMerchant ? chosenMerchant.name : 'متجر معتمد',
        category: selectedCategory,
        city: city,
        locationDetail: `${city} - الفرع الرئيسي`,
        content: content,
        timeLeftSeconds: 24 * 3600,
        views: 0,
        reportsCount: 0,
        status: 'active',
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
      };

      onAddStory(newStory);
      
      toast.success('تمت إضافة الستوري للمتجر بنجاح ✨', {
        style: { background: '#10b981', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', borderRadius: '16px' },
        iconTheme: { primary: '#ffffff', secondary: '#10b981' },
      });

      setIsSubmitting(false);
    } catch (err) {
      console.error('Error adding story:', err);
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء نشر الستوري', {
        style: { background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 'bold', borderRadius: '16px' },
      });
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
          <label className="text-xs font-semibold text-brand-body">1. اختر التصنيف *</label>
          <div className="relative">
            <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-body/60" size={18} />
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full bg-brand-bg pr-11 pl-4 py-3 rounded-2xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-secondary transition"
            >
              <option value="">-- اختر التصنيف --</option>
              {officialCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* اختيار المتجر */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-body">2. اختر المتجر من قائمة التجار المسجلين *</label>
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
                const mCity = m.city || m.region || m.location || m.cityName || '';
                return (
                  <option key={m.id} value={m.id}>
                    {m.name} {mCity ? `(${mCity})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
          {selectedCategory && filteredMerchants.length === 0 && (
            <p className="text-[10px] text-rose-500 mt-1">لا توجد متاجر مسجلة في قاعدة البيانات لهذا التصنيف حالياً.</p>
          )}
        </div>

        {/* تحديد المنطقة أو المدينة تلقائياً مع إمكانية التعديل اليدوي */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-body">المنطقة أو المدينة (تتحدد تلقائياً من بيانات المتجر المسجلة) *</label>
          <div className="relative">
            <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-body/60" size={18} />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-brand-bg pr-11 pl-4 py-3 rounded-2xl border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-secondary transition"
            >
              {regions && regions.filter(r => r !== 'الكل').map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-body">محتوى العرض أو تفاصيل القصة *</label>
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
                accept="image/*" 
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