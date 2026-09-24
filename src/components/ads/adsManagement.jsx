import React, { useState } from 'react';
import { Megaphone, Search, Plus } from 'lucide-react';
import AdsTable from './adsTable';
import AdReceiptsTable from './adReceiptsTable';
import AddAdModal from './addAdModal';

export default function AdsManagement() {
  const [activeTab, setActiveTab] = useState('ads'); // 'ads' | 'receipts'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddAdOpen, setIsAddAdOpen] = useState(false);

  // وصولات الدفع الخاصة بالإعلانات والباقات الرمزية
  const [receipts, setReceipts] = useState([
    {
      id: 1,
      storeName: 'متجر القدس',
      ownerName: 'محمد أحمد',
      amount: '10 $',
      adPlan: 'باقة 3 إعلانات (مميز)',
      transactionId: 'TRX-985421',
      date: '2026-09-01',
      receiptImg: 'https://via.placeholder.com/400x600?text=Ad+Receipt',
      status: 'approved',
    },
    {
      id: 2,
      storeName: 'متجر الأناقة',
      ownerName: 'خالد محمود',
      amount: '5 $',
      adPlan: 'إعلان واحد فردي',
      transactionId: 'TRX-332145',
      date: '2026-08-28',
      receiptImg: 'https://via.placeholder.com/400x600?text=Ad+Receipt',
      status: 'pending',
    },
  ]);

  // قائمة الإعلانات النشطة للمتاجر
  const [ads, setAds] = useState([
    { 
      id: 1, 
      storeName: 'متجر القدس', 
      adPlan: 'باقة 3 إعلانات (مميز)', 
      amount: '10 $',
      startDate: '2026-09-01', 
      endDate: '2027-09-01', 
      status: 'active' 
    },
    { 
      id: 2, 
      storeName: 'متجر الأناقة', 
      adPlan: 'إعلان واحد فردي', 
      amount: '5 $',
      startDate: '2026-08-01', 
      endDate: '2026-09-01', 
      status: 'expiring_soon' 
    },
  ]);

  const handleUpdateAd = (id, updatedData) => {
    setAds(prev => prev.map(item => (item.id === id ? updatedData : item)));
  };

  const handleDeleteAd = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان من المتجر؟')) {
      setAds(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddAd = (newAd) => {
    const newEntry = { id: Date.now(), ...newAd };
    setAds(prev => [newEntry, ...prev]);
    setIsAddAdOpen(false);
  };

  const handleUpdateReceipt = (id, updatedData) => {
    setReceipts(prev => prev.map(item => (item.id === id ? updatedData : item)));
  };

  const handleDeleteReceipt = (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف وصل الدفع هذا؟')) {
      setReceipts(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleApproveReceipt = (receipt) => {
    setReceipts(prev => prev.map(r => r.id === receipt.id ? { ...r, status: 'approved' } : r));
    
    const existingAd = ads.find(a => a.storeName.trim() === receipt.storeName.trim());
    const startDate = new Date().toISOString().split('T')[0];
    
    const endDateObj = new Date();
    endDateObj.setMonth(endDateObj.getMonth() + 1); // افتراضياً الباقات لشهر
    const endDate = endDateObj.toISOString().split('T')[0];

    if (existingAd) {
      setAds(prev => prev.map(a => a.id === existingAd.id ? {
        ...a,
        adPlan: receipt.adPlan,
        amount: receipt.amount,
        startDate,
        endDate,
        status: 'active'
      } : a));
    } else {
      setAds(prev => [
        {
          id: Date.now(),
          storeName: receipt.storeName,
          adPlan: receipt.adPlan,
          amount: receipt.amount,
          startDate,
          endDate,
          status: 'active'
        },
        ...prev
      ]);
    }
  };

  const handleRejectReceipt = (id) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const filterBySearch = (item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const store = (item.storeName || '').toLowerCase();
    const owner = (item.ownerName || '').toLowerCase();
    const trx = (item.transactionId || '').toLowerCase();
    return store.includes(query) || owner.includes(query) || trx.includes(query);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-right dir-rtl font-sans bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">إدارة الإعلانات والباقات الرمزية</h1>
            <p className="text-xs text-gray-500 mt-0.5">متابعة إعلانات المتاجر النشطة، باقات الإعلانات (1، 3، 5 إعلانات) ووصولات الدفع</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'ads' && (
            <button
              onClick={() => setIsAddAdOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition cursor-pointer shadow-sm"
            >
              <Plus size5={16} />
              إضافة إعلان لمتجر
            </button>
          )}

          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'ads' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              إعلانات المتاجر النشطة
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'receipts' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              وصولات دفع الإعلانات
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم المتجر، المالك أو رقم الحوالة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white text-gray-800 placeholder:text-gray-400 transition"
          />
        </div>
      </div>

      {activeTab === 'ads' ? (
        <AdsTable 
          ads={ads.filter(filterBySearch)} 
          onUpdate={handleUpdateAd} 
          onDelete={handleDeleteAd} 
        />
      ) : (
        <AdReceiptsTable 
          receipts={receipts.filter(filterBySearch)} 
          onUpdate={handleUpdateReceipt} 
          onDelete={handleDeleteReceipt} 
          onApprove={handleApproveReceipt}
          onReject={handleRejectReceipt}
        />
      )}

      <AddAdModal 
        isOpen={isAddAdOpen} 
        onClose={() => setIsAddAdOpen(false)} 
        onAdd={handleAddAd} 
      />
    </div>
  );
}