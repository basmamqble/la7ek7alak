import React, { useState } from 'react';
import { Store, MapPin, Loader2, Edit, Phone, Lock, Eye, EyeOff, X, CheckCircle } from 'lucide-react';
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

export default function MerchantTable({ merchants, refreshMerchants, loading }) {
  const [updatingId, setUpdatingId] = useState(null);

  // حالات مودال التعديل
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // لإظهار/إخفاء كلمة المرور
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // دالة تغيير حالة التاجر (نشط / غير نشط)
  const toggleStatus = async (id, currentStatus) => {
    if (!id || updatingId) return;

    setUpdatingId(id);
    try {
      const nextStatus = currentStatus === 'active' || currentStatus === 'نشط' ? 'inactive' : 'active';
      await API.patch(`/admin/merchants/${id}/status`, { status: nextStatus });

      if (typeof refreshMerchants === 'function') {
        await refreshMerchants();
      }
    } catch (err) {
      console.error('فشل تغيير حالة التاجر:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // فتح نافذة التعديل
  const handleOpenEdit = (item) => {
    setSelectedMerchant(item);
    const merchantName = item.fullName || item.name || item.merchantName || item.merchant_name || '';
    setEditFormData({
      name: merchantName,
      phone: item.phone || item.phoneNumber || '',
      password:'', // عرض كلمة السر إن وجدت بالباك إند
    });
    setShowPassword(true); // إظهار الكلمة تلقائياً للأدمن عند الفتح
    setIsEditModalOpen(true);
  };

  // حفظ تعديلات التاجر
  const handleSaveMerchant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const targetId = selectedMerchant.id || selectedMerchant._id;
      const payload = {
        name: editFormData.name,
        phone: editFormData.phone,
      };

      if (editFormData.password.trim() !== '') {
        payload.password = editFormData.password;
      }

      await API.put(`/admin/merchants/${targetId}`, payload);

      setFeedback({ type: 'success', text: 'تم تحديث بيانات التاجر بنجاح!' });
      setTimeout(async () => {
        setIsEditModalOpen(false);
        setFeedback({ type: '', text: '' });
        if (typeof refreshMerchants === 'function') {
          await refreshMerchants();
        }
      }, 1200);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'حدث خطأ أثناء تعديل بيانات التاجر',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeMerchants = Array.isArray(merchants) ? merchants : [];

  const getLocationName = (item) => {
    if (item.cityName) return item.cityName;
    if (item.city?.name) return item.city.name;
    if (item.city?.name_ar) return item.city.name_ar;

    const store = item.store || item.stores?.[0];
    if (store?.city?.name) return store.city.name;
    if (store?.city?.name_ar) return store.city.name_ar;
    if (store?.cityName) return store.cityName;

    const rawId = item.cityId ?? item.city_id ?? store?.cityId ?? store?.city_id;
    if (rawId && CITY_MAP[rawId]) return CITY_MAP[rawId];

    if (typeof item.city === 'string' && isNaN(Number(item.city))) return item.city;

    return 'غزة';
  };

  const getCategoryName = (item) => {
    if (item.categoryName) return item.categoryName;
    if (item.category?.name) return item.category.name;
    if (item.category?.name_ar) return item.category.name_ar;

    const store = item.store || item.stores?.[0];
    if (store?.category?.name) return store.category.name;
    if (store?.category?.name_ar) return store.category.name_ar;
    if (store?.categoryName) return store.categoryName;

    const rawId = item.categoryId ?? item.category_id ?? store?.categoryId ?? store?.category_id;
    if (rawId && CATEGORY_MAP[rawId]) return CATEGORY_MAP[rawId];

    if (typeof item.category === 'string' && isNaN(Number(item.category))) return item.category;

    return 'عام';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EFECE6]">
      <div className="flex items-center gap-2 mb-4">
        <Store size={18} className="text-[#8E5439]" />
        <h2 className="text-base font-bold text-[#8E5439]">قائمة التجار المسجلين</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#FAF6F0] text-[#2D1B13] text-xs font-semibold border-b border-[#EFECE6]">
              <th className="py-3 px-4">اسم المتجر</th>
              <th className="py-3 px-4">اسم التاجر</th>
              <th className="py-3 px-4">رقم الهاتف</th>
              <th className="py-3 px-4">موقع المتجر</th>
              <th className="py-3 px-4">التصنيف</th>
              <th className="py-3 px-4 text-center">حالة الحساب</th>
              <th className="py-3 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#8E5439]" />
                    <span>جاري تحميل بيانات التجار...</span>
                  </div>
                </td>
              </tr>
            ) : safeMerchants.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  لا يوجد تجار مسجلون حالياً.
                </td>
              </tr>
            ) : (
              safeMerchants.map((item, index) => {
                const itemId = item.id || item._id || index;
                const isActive = item.status === 'active' || item.status === 'نشط' || item.isActive === true;
                const storeName = item.storeName || item.store_name || item.stores?.[0]?.name || item.shopName || 'غير محدد';
                const merchantName = item.fullName || item.name || item.merchantName || item.merchant_name || 'غير محدد';
                const phone = item.phone || item.phoneNumber || '-';

                const location = getLocationName(item);
                const category = getCategoryName(item);

                const isCurrentlyUpdating = updatingId === itemId;

                return (
                  <tr key={itemId} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-4 font-medium text-[#2D1B13]">{storeName}</td>
                    <td className="py-3.5 px-4 text-gray-600">{merchantName}</td>
                    <td className="py-3.5 px-4 text-gray-600">{phone}</td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-[#8E5439]" />
                        {location}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{category}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        disabled={isCurrentlyUpdating}
                        onClick={() => toggleStatus(itemId, item.status)}
                        title="اضغط لتغيير الحالة"
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold transition duration-200 cursor-pointer disabled:opacity-50 ${
                          isActive
                            ? 'bg-[#E5F7ED] text-[#1E7242] hover:bg-[#d5f2e1]'
                            : 'bg-[#FCEAEB] text-[#A92A32] hover:bg-[#faaaaf]'
                        }`}
                      >
                        {isCurrentlyUpdating && <Loader2 size={12} className="animate-spin" />}
                        {isActive ? 'نشط' : 'غير نشط'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-3 py-1.5 bg-[#F5EBE6] text-[#8E5439] hover:bg-[#8E5439] hover:text-white rounded-lg transition font-medium flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <Edit size={14} />
                        <span>تعديل</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* مودال تعديل التاجر */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 relative text-right">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-base font-bold text-[#2D1B13] mb-4 flex items-center gap-2">
              <Store size={18} className="text-[#8E5439]" />
              تعديل بيانات التاجر
            </h2>

            {feedback.text && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle size={16} />}
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveMerchant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1B13] mb-1.5">اسم التاجر</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7E361B] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1B13] mb-1.5">رقم الهاتف</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full text-right px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7E361B] text-xs"
                  />
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1B13] mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    placeholder="كلمة المرور الخاصة بالتاجر"
                    className="w-full text-right pr-3.5 pl-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7E361B] text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8E5439] transition cursor-pointer"
                    title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#2D1B13] text-white rounded-xl text-xs font-medium hover:bg-[#1F120C] transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}