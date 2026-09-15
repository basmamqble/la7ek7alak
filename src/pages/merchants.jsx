import React, { useState, useEffect, useCallback } from 'react';
import MerchantForm from '../components/merchants/merchantForm';
import MerchantTable from '../components/merchants/merchantTable';
import API from '../api/axios';

export default function Merchants() {
  const [merchants, setMerchants] = useState(() => {
    // 1. محاولة استرجاع البيانات من localStorage فوراً للبدء بها ومنع الشاشة البيضاء عند الـ Refresh
    const saved = localStorage.getItem('admin_merchants_cache');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // دالة جلب كافة التجار من قاعدة البيانات
  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // التأكد من وجود التوكن لتفادي ضياع الجلسة عند Refresh
      const token = localStorage.getItem('token'); 
      const response = await API.get('/admin/merchants', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const data = response.data;
      
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.merchants)) {
        list = data.merchants;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      } else if (Array.isArray(data?.result)) {
        list = data.result;
      }

      setMerchants(list);
      // حفظ النسخة الأخيرة في localStorage للاسترجاع السريع
      localStorage.setItem('admin_merchants_cache', JSON.stringify(list));
    } catch (err) {
      console.error('فشل جلب قائمة التجار من السيرفر:', err);
      setError('تعذر جلب البيانات من السيرفر. تحقق من الاتصال أو التوثيق.');
    } finally {
      setLoading(false);
    }
  }, []);

  // تنفيذ الجلب فور تحميل الصفحة
  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  // إضافة التاجر الجديد تفاؤلياً وإعادة الجلب لضمان التطابق مع الباك إند
  const handleMerchantAdded = (newMerchant) => {
    if (newMerchant) {
      setMerchants((prev) => {
        const updated = [newMerchant, ...prev];
        localStorage.setItem('admin_merchants_cache', JSON.stringify(updated));
        return updated;
      });
    }
    // إعادة الجلب من الباك لضمان استلام الـ ID الحقيقي والبيانات الكاملة من الداتابيز
    fetchMerchants();
  };

  return (
    <div className="space-y-6 bg-brand-bg min-h-screen p-2 font-sans" dir="rtl">
      {/* عنوان الصفحة الرئيسي */}
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">إدارة التجار والمتاجر</h1>
        <p className="text-xs text-brand-body/70 mt-1">
          إضافة حسابات التجار الجدد وإدارة بيانات المتاجر المعتمدة في منصة لحّق حالك
        </p>
      </div>

      {/* رسالة الخطأ إن وجدت */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* نموذج الإضافة وجدول العرض */}
      <MerchantForm 
        onMerchantAdded={handleMerchantAdded} 
        refreshMerchants={fetchMerchants} 
      />
      
      <MerchantTable 
        merchants={merchants} 
        loading={loading} 
        refreshMerchants={fetchMerchants} 
      />
    </div>
  );
}