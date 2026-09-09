import React, { useState } from 'react';
import { Store, MapPin, Loader2, Edit, Save, X, Search, AlertTriangle } from 'lucide-react';
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

export default function MerchantTable({ merchants, refreshMerchants, loading, onOpenAddMerchant }) {
  const [updatingId, setUpdatingId] = useState(null);

  // حالات التعديل المباشر (Inline Editing)
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    storeName: '',
    merchantName: '',
    phone: '',
    cityId: '',
    categoryId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حالة البحث (Search State)
  const [searchQuery, setSearchQuery] = useState('');

  // حالات مودال تأكيد تغيير الحالة
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    merchantId: null,
    currentStatus: null,
    storeName: '',
  });

  // فتح مودال تأكيد تغيير الحالة
  const handleOpenStatusConfirm = (item) => {
    const itemId = item.id || item._id;
    const storeName = item.storeName || item.store_name || item.stores?.[0]?.name || item.shopName || 'المتجر';
    const isActive = item.status === 'active' || item.status === 'نشط' || item.isActive === true;

    setConfirmModal({
      isOpen: true,
      merchantId: itemId,
      currentStatus: isActive ? 'active' : 'inactive',
      storeName: storeName,
    });
  };

  // التنفيذ الفعلي لتغيير الحالة بعد التأكيد
  const confirmToggleStatus = async () => {
    const { merchantId, currentStatus } = confirmModal;
    if (!merchantId) return;

    setUpdatingId(merchantId);
    setConfirmModal({ isOpen: false, merchantId: null, currentStatus: null, storeName: '' });

    try {
      const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await API.patch(`/admin/merchants/${merchantId}/status`, { status: nextStatus });

      if (typeof refreshMerchants === 'function') {
        await refreshMerchants();
      }
    } catch (err) {
      console.error('فشل تغيير حالة التاجر:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // تفعيل وضع التعديل المباشر للصف
  const handleStartEdit = (item) => {
    const itemId = item.id || item._id;
    setEditingId(itemId);
    
    const storeName = item.storeName || item.store_name || item.stores?.[0]?.name || item.shopName || '';
    const merchantName = item.fullName || item.name || item.merchantName || item.merchant_name || '';
    const phone = item.phone || item.phoneNumber || '';
    const cityId = item.cityId ?? item.city_id ?? item.store?.cityId ?? item.store?.city_id ?? '';
    const categoryId = item.categoryId ?? item.category_id ?? item.store?.categoryId ?? item.store?.category_id ?? '';

    setEditFormData({
      storeName,
      merchantName,
      phone,
      cityId,
      categoryId,
    });
  };

  // إلغاء التعديل
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ storeName: '', merchantName: '', phone: '', cityId: '', categoryId: '' });
  };

  // حفظ تعديلات التاجر المباشرة
  const handleSaveEdit = async (itemId) => {
    setIsSubmitting(true);
    try {
      const payload = {
        storeName: editFormData.storeName,
        name: editFormData.merchantName,
        phone: editFormData.phone,
        cityId: editFormData.cityId ? Number(editFormData.cityId) : undefined,
        categoryId: editFormData.categoryId ? Number(editFormData.categoryId) : undefined,
      };

      await API.put(`/admin/merchants/${itemId}`, payload);

      setEditingId(null);
      if (typeof refreshMerchants === 'function') {
        await refreshMerchants();
      }
    } catch (err) {
      console.error('حدث خطأ أثناء تعديل بيانات التاجر:', err);
      alert(err.response?.data?.message || 'حدث خطأ أثناء تعديل بيانات التاجر');
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

  // تصفية التجار بناءً على حقل البحث
  const filteredMerchants = safeMerchants.filter((item) => {
    const storeName = item.storeName || item.store_name || item.stores?.[0]?.name || item.shopName || '';
    const merchantName = item.fullName || item.name || item.merchantName || item.merchant_name || '';
    const location = getLocationName(item);

    const query = searchQuery.toLowerCase();
    return (
      storeName.toLowerCase().includes(query) ||
      merchantName.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-brand-card rounded-2xl p-6 shadow-xs border border-brand-border space-y-5">
      
      {/* عنوان قائمة التجار المسجلين */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 inline-flex items-center gap-2 text-brand-title font-bold text-sm shadow-xs">
          <Store size={18} className="text-brand-secondary" />
          <span>قائمة التجار المسجلين</span>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="w-full relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-body/60" size={18} />
        <input
          type="text"
          placeholder="ابحث باسم المتجر أو التاجر أو المنطقة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-brand-bg pr-11 pl-4 py-3 rounded-xl border border-brand-border text-xs text-brand-title focus:outline-none focus:border-brand-secondary transition shadow-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-brand-bg text-brand-title text-xs font-semibold border-b border-brand-border">
              <th className="py-3 px-4">اسم المتجر</th>
              <th className="py-3 px-4">اسم التاجر</th>
              <th className="py-3 px-4">رقم الهاتف</th>
              <th className="py-3 px-4">موقع المتجر</th>
              <th className="py-3 px-4">التصنيف</th>
              <th className="py-3 px-4 text-center">حالة الحساب</th>
              <th className="py-3 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border text-xs text-brand-body">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-brand-body/60">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-brand-secondary" />
                    <span>جاري تحميل بيانات التجار...</span>
                  </div>
                </td>
              </tr>
            ) : filteredMerchants.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-brand-body/60">
                  لا توجد نتائج مطابقة لبحثك.
                </td>
              </tr>
            ) : (
              filteredMerchants.map((item, index) => {
                const itemId = item.id || item._id || index;
                const isEditing = editingId === itemId;
                const isActive = item.status === 'active' || item.status === 'نشط' || item.isActive === true;
                const storeName = item.storeName || item.store_name || item.stores?.[0]?.name || item.shopName || 'غير محدد';
                const merchantName = item.fullName || item.name || item.merchantName || item.merchant_name || 'غير محدد';
                const phone = item.phone || item.phoneNumber || '-';

                const location = getLocationName(item);
                const category = getCategoryName(item);

                const isCurrentlyUpdating = updatingId === itemId;

                return (
                  <tr key={itemId} className="hover:bg-brand-bg/50 transition">
                    {/* اسم المتجر */}
                    <td className="py-3.5 px-4 font-medium text-brand-title">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.storeName}
                          onChange={(e) => setEditFormData({ ...editFormData, storeName: e.target.value })}
                          className="w-full bg-brand-bg px-2.5 py-1.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-secondary text-xs text-brand-title"
                        />
                      ) : (
                        storeName
                      )}
                    </td>

                    {/* اسم التاجر */}
                    <td className="py-3.5 px-4 text-brand-body">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.merchantName}
                          onChange={(e) => setEditFormData({ ...editFormData, merchantName: e.target.value })}
                          className="w-full bg-brand-bg px-2.5 py-1.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-secondary text-xs text-brand-title"
                        />
                      ) : (
                        merchantName
                      )}
                    </td>

                    {/* رقم الهاتف */}
                    <td className="py-3.5 px-4 text-brand-body">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          className="w-full bg-brand-bg px-2.5 py-1.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-secondary text-xs text-brand-title"
                        />
                      ) : (
                        phone
                      )}
                    </td>

                    {/* موقع المتجر (المدينة) */}
                    <td className="py-3.5 px-4 text-brand-body">
                      {isEditing ? (
                        <select
                          value={editFormData.cityId}
                          onChange={(e) => setEditFormData({ ...editFormData, cityId: e.target.value })}
                          className="w-full bg-brand-bg px-2.5 py-1.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-secondary text-xs text-brand-title"
                        >
                          <option value="">اختر المدينة</option>
                          {Object.entries(CITY_MAP).map(([id, name]) => (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-brand-secondary" />
                          {location}
                        </span>
                      )}
                    </td>

                    {/* التصنيف */}
                    <td className="py-3.5 px-4 text-brand-body">
                      {isEditing ? (
                        <select
                          value={editFormData.categoryId}
                          onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                          className="w-full bg-brand-bg px-2.5 py-1.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-secondary text-xs text-brand-title"
                        >
                          <option value="">اختر التصنيف</option>
                          {Object.entries(CATEGORY_MAP).map(([id, name]) => (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        category
                      )}
                    </td>

                    {/* حالة الحساب */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        disabled={isCurrentlyUpdating}
                        onClick={() => handleOpenStatusConfirm(item)}
                        title="اضغط لتغيير الحالة"
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold transition duration-200 cursor-pointer disabled:opacity-50 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {isCurrentlyUpdating && <Loader2 size={12} className="animate-spin" />}
                        {isActive ? 'نشط' : 'غير نشط'}
                      </button>
                    </td>

                    {/* الإجراءات */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(itemId)}
                              disabled={isSubmitting}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="حفظ"
                            >
                              {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                              <span>حفظ</span>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2.5 py-1.5 bg-brand-bg text-brand-body rounded-lg hover:bg-brand-border/60 transition font-medium flex items-center gap-1 cursor-pointer"
                              title="إلغاء"
                            >
                              <X size={13} />
                              <span>إلغاء</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="px-3 py-1.5 bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary hover:text-white rounded-lg transition font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Edit size={14} />
                            <span>تعديل</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* مودال تأكيد تغيير حالة التاجر */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-brand-card rounded-2xl w-full max-w-sm p-6 shadow-xl border border-brand-border relative text-right space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-title">تأكيد تغيير الحالة</h3>
                <p className="text-xs text-brand-body/70 mt-0.5">متجر: {confirmModal.storeName}</p>
              </div>
            </div>

            <p className="text-xs text-brand-body">
              هل أنت متأكد من رغبتك في تحويل حالة هذا المتجر إلى{' '}
              <span className="font-bold text-brand-title">
                {confirmModal.currentStatus === 'active' ? 'غير نشط (معطل)' : 'نشط'}
              </span>
              ؟
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, merchantId: null, currentStatus: null, storeName: '' })}
                className="px-4 py-2 bg-brand-bg text-brand-body rounded-xl text-xs font-medium hover:bg-brand-border/60 transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmToggleStatus}
                className="px-5 py-2 bg-brand-secondary text-white rounded-xl text-xs font-medium hover:bg-brand-secondary/90 transition cursor-pointer shadow-xs"
              >
                تأكيد التغيير
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}