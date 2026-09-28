import { useEffect, useState } from 'react';
import { Plus, Loader2, Eye, EyeOff, CheckCircle2, KeyRound, Copy, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import MapPicker from '../mapPicker'; // استيراد مكون الخريطة

export default function MerchantForm({ refreshMerchants, setShowSuccessMessage, onMerchantAdded }) {
  const initialFormState = {
    merchantName: '',
    email: '',
    tempPassword: '',
    storeName: '',
    phone: '',
    categoryId: '',
    cityId: '',
    latitude: 31.5016,  // خط العرض الافتراضي (غزة)
    longitude: 34.4668, // خط الطول الافتراضي (غزة)
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesResponse, locationsResponse] = await Promise.all([
          API.get('/admin/categories'),
          API.get('/admin/locations'),
        ]);
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
        setLocations(Array.isArray(locationsResponse.data) ? locationsResponse.data : []);
      } catch (fetchError) {
        toast.error(fetchError.response?.data?.error || 'تعذر تحميل التصنيفات والمدن من قاعدة البيانات');
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // دالة لتوليد كلمة مرور عشوائية وآمنة تلقائياً
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%!';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, tempPassword: password }));
    
    toast.success('تم توليد كلمة سر مؤقتة بنجاح!', {
      style: { background: '#10B981', color: '#FFFFFF' },
      iconTheme: { primary: '#FFFFFF', secondary: '#10B981' },
    });
  };

  // دالة لنسخ كلمة المرور المؤقتة
  const copyPasswordToClipboard = () => {
    if (!formData.tempPassword) {
      toast.error('لا يوجد كلمة مرور لنسخها');
      return;
    }
    navigator.clipboard.writeText(formData.tempPassword);
    
    toast.success('تم نسخ كلمة المرور للحافظة! 📋', {
      style: { background: '#10B981', color: '#FFFFFF' },
      iconTheme: { primary: '#FFFFFF', secondary: '#10B981' },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cityId') {
      const selectedCity = locations.find((location) => String(location.id) === value);
      if (selectedCity) {
        const latitude = Number(selectedCity.latitude);
        const longitude = Number(selectedCity.longitude);
        setFormData((prev) => ({
          ...prev,
          cityId: value,
          ...(selectedCity.latitude != null && selectedCity.longitude != null
            && Number.isFinite(latitude) && Number.isFinite(longitude)
            ? { latitude, longitude }
            : {}),
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // دالة التقاط الموقع عند النقر المباشر على الخريطة
  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.merchantName || !formData.storeName || !formData.email || !formData.tempPassword
      || !formData.categoryId || !formData.cityId) {
      setError('يرجى تعبئة كافة الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const selectedCatId = Number(formData.categoryId);
      const selectedCityId = Number(formData.cityId);
      const selectedCategory = categories.find((category) => Number(category.id) === selectedCatId);
      const selectedCity = locations.find((location) => Number(location.id) === selectedCityId);
      if (!selectedCategory || !selectedCity) {
        setError('التصنيف أو المدينة المحددة لم تعد متاحة. حدّث الصفحة واختر من القائمة مرة أخرى.');
        return;
      }

      const response = await API.post('/admin/merchants', {
        fullName: formData.merchantName.trim(),
        email: formData.email.trim(),
        password: formData.tempPassword,
        storeName: formData.storeName.trim(),
        phone: formData.phone?.trim() || '0599999999',
        categoryId: selectedCatId,
        cityId: selectedCityId,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      const createdMerchant = response.data?.merchant || response.data?.data || response.data;
      const selectedCategoryName = selectedCategory?.name || '';
      const selectedCityName = selectedCity ? `${selectedCity.governorate} - ${selectedCity.area}` : '';

      const formattedMerchant = {
        id: createdMerchant?.id || createdMerchant?._id || Date.now(),
        fullName: formData.merchantName.trim(),
        storeName: formData.storeName.trim(),
        email: formData.email.trim(),
        phone: formData.phone || '-',
        cityId: selectedCityId,
        categoryId: selectedCatId,
        cityName: selectedCityName,
        categoryName: selectedCategoryName,
        city: { id: selectedCityId, name: selectedCityName, area: selectedCity.area, governorate: selectedCity.governorate },
        category: { id: selectedCatId, name: selectedCategoryName },
        latitude: formData.latitude,
        longitude: formData.longitude,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      if (typeof onMerchantAdded === 'function') {
        onMerchantAdded(formattedMerchant);
      }

      setTimeout(async () => {
        if (typeof refreshMerchants === 'function') {
          await refreshMerchants();
        }
      }, 500);

      if (typeof setShowSuccessMessage === 'function') {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 4000);
      }

      setSuccess(true);
      setFormData(initialFormState);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Error adding merchant:', err);
      const serverMessage = JSON.stringify(err.response?.data || '');

      if (serverMessage.includes('Unique constraint') || serverMessage.includes('email')) {
        setError('البريد الإلكتروني مُستخدَم بالفعل، يرجى استخدام بريد إلكتروني آخر.');
      } else {
        setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة التاجر');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-card rounded-2xl p-4 sm:p-6 shadow-xs border border-brand-border mb-6 transition-all duration-300">
      
      {success && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl mb-5 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all duration-300">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>تم إنشاء حساب التاجر بنجاح وإرسال بيانات الاعتماد له!</span>
        </div>
      )}

      <div className="flex justify-start mb-6">
        <div className="inline-flex items-center gap-2.5 bg-gray-50 border border-gray-200 text-brand-title px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm">
          <Plus size={18} className="text-brand-secondary shrink-0" />
          <span>إضافة تاجر جديد</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-xl mb-5 text-center font-semibold shadow-xs flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <input type="text" style={{ display: 'none' }} aria-hidden="true" />
        <input type="password" style={{ display: 'none' }} aria-hidden="true" />

        {/* الحقول الأساسية بتصميم متجاوب 1 عمود للجوال و3 أعمدة للشاشات الكبيرة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-title mb-1.5">اسم التاجر</label>
            <input
              type="text"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs text-brand-title bg-white shadow-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-title mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs text-brand-title bg-white shadow-sm transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-brand-title">كلمة المرور المبدئية</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-[10px] text-brand-secondary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  title="توليد كلمة مرور عشوائية"
                >
                  <KeyRound size={12} />
                  توليد تلقائي
                </button>
                {formData.tempPassword && (
                  <button
                    type="button"
                    onClick={copyPasswordToClipboard}
                    className="text-[10px] text-gray-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="نسخ كلمة المرور"
                  >
                    <Copy size={12} />
                    نسخ
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="tempPassword"
                value={formData.tempPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                placeholder="انقر توليد أو اكتبها يدوياً"
                className="w-full text-right px-3.5 py-2.5 pl-16 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs font-mono font-bold text-gray-900 bg-white shadow-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-body/60 hover:text-brand-secondary focus:outline-none"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-title mb-1.5">اسم المتجر</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs text-brand-title bg-white shadow-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-title mb-1.5">رقم التواصل</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="off"
              className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs text-brand-title bg-white shadow-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-title mb-1.5">التصنيف</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs text-brand-title bg-white shadow-sm transition-colors appearance-none"
            >
              <option value="" disabled hidden>اختر التصنيف</option>
              <option value="" disabled>{loadingOptions ? 'جاري تحميل التصنيفات...' : 'اختر التصنيف'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-title mb-1.5">الموقع الجغرافي (المنطقة)</label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              required
              className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs text-brand-title bg-white shadow-sm transition-colors appearance-none"
            >
              <option value="" disabled hidden>اختر موقع المتجر</option>
              <option value="" disabled>{loadingOptions ? 'جاري تحميل المدن...' : 'اختر موقع المتجر'}</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.governorate} - {location.area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* قسم الخريطة التفاعلية المتجاوب */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-semibold text-brand-title flex items-center gap-1.5">
            <MapPin size={14} className="text-brand-secondary shrink-0" />
            <span>حدد الموقع الدقيق للمتجر على الخريطة (يتحدث تلقائياً عند اختيار المنطقة أو بالنقر المباشر):</span>
          </label>
          
          <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <MapPicker 
              lat={formData.latitude} 
              lng={formData.longitude} 
              onLocationSelect={handleLocationSelect} 
            />
          </div>
        </div>

        <div className="flex justify-start pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-brand-title hover:bg-brand-title/90 text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            <span>إنشاء حساب التاجر</span>
          </button>
        </div>
      </form>
    </div>
  );
}
