import React, { useState, useEffect, useCallback } from 'react';
import MerchantForm from '../components/merchants/merchantForm';
import MerchantTable from '../components/merchants/merchantTable';
import API from '../api/axios';

export default function Merchants() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب كافة التجار من قاعدة البيانات
  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/merchants');
      const data = response.data;
      
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.merchants)) {
        list = data.merchants;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      }

      setMerchants(list);
    } catch (err) {
      console.error('فشل جلب قائمة التجار من السيرفر:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // تنفيذ الجلب فور تحميل الصفحة
  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  // إضافة التاجر الجديد تفاؤلياً لأعلى القائمة
  const handleMerchantAdded = (newMerchant) => {
    setMerchants((prev) => [newMerchant, ...prev]);
  };

  return (
    <div className="space-y-6">
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