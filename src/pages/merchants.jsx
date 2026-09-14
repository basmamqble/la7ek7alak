import React, { useState, useEffect, useCallback } from 'react';
import MerchantForm from '../components/merchants/merchantForm';
import MerchantTable from '../components/merchants/merchantTable';
import API from '../api/axios';

export default function Merchants() {
  const [merchants, setMerchants] = useState(() => {
    // استرجاع البيانات المخبأة فوراً لمنع اختفاء العناصر أو الشاشة البيضاء عند Refresh
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

      // جلب التوكن بأي شكل كان مخزناً به
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token'); 
      const response = await API.get('/admin/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const data = response.data;
      
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.users)) { // مطابقة مع الباك إند الحالي: { count, users }
        list = data.users;
      } else if (Array.isArray(data?.merchants)) {
        list = data.merchants;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      }

      setMerchants(list);
      // تحديث التخزين المحلي فور نجاح الـ Request
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

  // إضافة التاجر الجديد تفاؤلياً وإعادة الجلب
  const handleMerchantAdded = (newMerchant) => {
    if (newMerchant) {
      setMerchants((prev) => {
        const updated = [newMerchant, ...prev];
        localStorage.setItem('admin_merchants_cache', JSON.stringify(updated));
        return updated;
      });
    }
    fetchMerchants();
  };

  return (
    <div className="space-y-6 bg-brand-bg min-h-screen p-2 font-sans" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">إدارة التجار والمتاجر</h1>
        <p className="text-xs text-brand-body/70 mt-1">
          إضافة حسابات التجار الجدد وإدارة بيانات المتاجر المعتمدة في منصة لحّق حالك
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

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
  );
}
