import React, { useState } from 'react';
import { CreditCard, Search, Plus } from 'lucide-react';
import SubscriptionsTable from './SubscriptionsTable';
import ReceiptsTable from './ReceiptsTable';
import AddSubscriptionModal from './AddSubscriptionModal';

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState('subscriptions'); // receipts | subscriptions
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);

  // وصولات الدفع الافتراضية (قيد التدقيق)
  const [receipts, setReceipts] = useState([
    {
      id: 1,
      storeName: 'متجر القدس',
      ownerName: 'محمد أحمد',
      amount: '50 $',
      plan: 'سنوي',
      transactionId: 'TRX-985421',
      date: '2026-09-01',
      receiptImg: 'https://via.placeholder.com/400x600?text=Receipt+Sample',
      status: 'approved',
    },
    {
      id: 2,
      storeName: 'متجر الأناقة',
      ownerName: 'خالد محمود',
      amount: '15 $',
      plan: 'شهري',
      transactionId: 'TRX-332145',
      date: '2026-08-28',
      receiptImg: 'https://via.placeholder.com/400x600?text=Receipt+Sample',
      status: 'pending',
    },
  ]);

  // قائمة اشتراكات المتاجر
  const [subscriptions, setSubscriptions] = useState([
    { 
      id: 1, 
      storeName: 'متجر القدس', 
      plan: 'سنوي', 
      startDate: '2026-09-01', 
      endDate: '2027-09-01', 
      status: 'active' 
    },
    { 
      id: 2, 
      storeName: 'متجر الأناقة', 
      plan: 'شهري', 
      startDate: '2026-08-01', 
      endDate: '2026-09-01', 
      status: 'expiring_soon' 
    },
    { 
      id: 3, 
      storeName: 'مكتبة النجاح', 
      plan: 'شهري', 
      startDate: '2026-07-01', 
      endDate: '2026-08-01', 
      status: 'expired' 
    },
  ]);

  // دوال تعديل وحذف وإضافة الاشتراكات
  const handleUpdateSub = (id, updatedData) => {
    setSubscriptions(prev => prev.map(item => (item.id === id ? updatedData : item)));
  };

  const handleDeleteSub = (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الاشتراك؟')) {
      setSubscriptions(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddSub = (newSub) => {
    const newEntry = { id: Date.now(), ...newSub };
    setSubscriptions(prev => [newEntry, ...prev]);
    setIsAddSubOpen(false);
  };

  // دوال تعديل وحذف وقبول الوصولات
  const handleUpdateReceipt = (id, updatedData) => {
    setReceipts(prev => prev.map(item => (item.id === id ? updatedData : item)));
  };

  const handleDeleteReceipt = (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الوصل؟')) {
      setReceipts(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleApproveReceipt = (receipt) => {
    setReceipts(prev => prev.map(r => r.id === receipt.id ? { ...r, status: 'approved' } : r));
    
    const existingSub = subscriptions.find(s => s.storeName.trim() === receipt.storeName.trim());
    const startDate = new Date().toISOString().split('T')[0];
    
    const endDateObj = new Date();
    if (receipt.plan === 'سنوي') {
      endDateObj.setFullYear(endDateObj.getFullYear() + 1);
    } else if (receipt.plan === 'أسبوعي') {
      endDateObj.setDate(endDateObj.getDate() + 7);
    } else {
      endDateObj.setMonth(endDateObj.getMonth() + 1);
    }
    const endDate = endDateObj.toISOString().split('T')[0];

    if (existingSub) {
      setSubscriptions(prev => prev.map(s => s.id === existingSub.id ? {
        ...s,
        plan: receipt.plan,
        startDate,
        endDate,
        status: 'active'
      } : s));
    } else {
      setSubscriptions(prev => [
        {
          id: Date.now(),
          storeName: receipt.storeName,
          plan: receipt.plan,
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

  // تصفية البيانات بناءً على البحث
  const filterBySearch = (item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const store = (item.storeName || '').toLowerCase();
    const owner = (item.ownerName || '').toLowerCase();
    const trx = (item.transactionId || '').toLowerCase();
    return store.includes(query) || owner.includes(query) || trx.includes(query);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-right dir-rtl font-sans bg-[#A8E8F9]/10 min-h-screen">
      {/* الهيدر والتبويب */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#A8E8F9]/40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F5A201]/15 text-[#F5A201] rounded-xl">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#013C58]">إدارة الاشتراكات والوصولات</h1>
            <p className="text-xs text-gray-500 mt-0.5">متابعة وتعديل خطط الاشتراكات والوصولات المرفوعة</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'subscriptions' && (
            <button
              onClick={() => setIsAddSubOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#F5A201] text-white rounded-xl text-xs font-bold hover:bg-[#d98f00] transition cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              إضافة اشتراك جديد
            </button>
          )}

          <div className="flex items-center gap-2 bg-[#A8E8F9]/15 p-1.5 rounded-xl border border-[#A8E8F9]/30">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'subscriptions' ? 'bg-[#013C58] text-white shadow-sm' : 'text-[#00537A] hover:text-[#013C58]'
              }`}
            >
              سجل اشتراكات المتاجر
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'receipts' ? 'bg-[#013C58] text-white shadow-sm' : 'text-[#00537A] hover:text-[#013C58]'
              }`}
            >
              وصولات الدفع
            </button>
          </div>
        </div>
      </div>

      {/* حقل البحث */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-[#A8E8F9]/40 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00537A]" />
          <input
            type="text"
            placeholder="ابحث باسم المتجر، المالك أو رمز العملية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl text-xs focus:outline-none focus:border-[#F5A201] focus:bg-white text-[#013C58] placeholder:text-gray-400 transition"
          />
        </div>
      </div>

      {/* عرض الجداول بناءً على التبويب النشط */}
      {activeTab === 'subscriptions' ? (
        <SubscriptionsTable 
          subscriptions={subscriptions.filter(filterBySearch)} 
          onUpdate={handleUpdateSub} 
          onDelete={handleDeleteSub} 
        />
      ) : (
        <ReceiptsTable 
          receipts={receipts.filter(filterBySearch)} 
          onUpdate={handleUpdateReceipt} 
          onDelete={handleDeleteReceipt} 
          onApprove={handleApproveReceipt}
          onReject={handleRejectReceipt}
        />
      )}

      {/* مودال إضافة اشتراك جديد */}
      <AddSubscriptionModal 
        isOpen={isAddSubOpen} 
        onClose={() => setIsAddSubOpen(false)} 
        onAdd={handleAddSub} 
      />
    </div>
  );
}