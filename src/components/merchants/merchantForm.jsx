import React, { useState } from 'react';
import { Plus, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import API from '../../api/axios';

const CATEGORY_MAP = {
  1: 'ملابس وموضة',
  2: 'مطاعم وكافيهات',
  3: 'إلكترونيات',
  4: 'عطور ومستحضرات',
  5: 'أدوات منزلية',
  6: 'سوبر ماركت',
};

const CITY_MAP = {
  1: 'شمال غزة',
  2: 'غزة',
  3: 'النصيرات',
  4: 'البريج',
  5: 'المغازي',
  6: 'دير البلح',
  7: 'خانيونس',
};

export default function MerchantForm({ refreshMerchants, setShowSuccessMessage, onMerchantAdded }) {
  const initialFormState = {
    merchantName: '',
    email: '',
    tempPassword: '',
    storeName: '',
    phone: '',
    categoryId: '',
    cityId: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.merchantName || !formData.storeName || !formData.email || !formData.tempPassword) {
      setError('يرجى تعبئة كافة الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const selectedCatId = Number(formData.categoryId) || 1;
      const selectedCityId = Number(formData.cityId) || 2;

      const response = await API.post('/admin/merchants', {
        fullName: formData.merchantName.trim(),
        email: formData.email.trim(),
        password: formData.tempPassword,
        storeName: formData.storeName.trim(),
        phone: formData.phone?.trim() || '0599999999',
        categoryId: selectedCatId,
        cityId: selectedCityId,
      });

      const createdMerchant = response.data?.merchant || response.data?.data || response.data;
      const selectedCategoryName = CATEGORY_MAP[selectedCatId] || 'عام';
      const selectedCityName = CITY_MAP[selectedCityId] || 'غزة';

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
        city: { id: selectedCityId, name: selectedCityName },
        category: { id: selectedCatId, name: selectedCategoryName },
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
    <div className="bg-brand-card rounded-2xl p-6 shadow-xs border border-brand-border mb-6 transition-all duration-300">
      
      {success && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl mb-5 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all duration-300">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>تم إنشاء حساب التاجر بنجاح وإرسال بيانات الاعتماد له!</span>
        </div>
      )}

      {/* التعديل هنا: عنوان القسم أصبح مطابقاً لتصميم (قائمة التجار المسجلين) */}
      <div className="flex justify-start mb-6">
        <div className="inline-flex items-center gap-2.5 bg-gray-50 border border-gray-200 text-brand-title px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm">
          <Plus size={18} className="text-brand-secondary" />
          <span>إضافة تاجر جديد</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-xl mb-5 text-center font-semibold shadow-xs flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <input type="text" style={{ display: 'none' }} aria-hidden="true" />
        <input type="password" style={{ display: 'none' }} aria-hidden="true" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-xs font-semibold text-brand-title mb-1.5">كلمة المرور المبدئية</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="tempPassword"
                value={formData.tempPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full text-right px-3.5 py-2.5 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs text-brand-title bg-white shadow-sm transition-colors"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {Object.entries(CATEGORY_MAP).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-brand-title mb-1.5">الموقع الجغرافي</label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              required
              className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-secondary text-xs text-brand-title bg-white shadow-sm transition-colors appearance-none"
            >
              <option value="" disabled hidden>اختر موقع المتجر</option>
              {Object.entries(CITY_MAP).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-start">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-title hover:bg-brand-title/90 text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>إنشاء حساب التاجر</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}