import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Clock, 
  Pencil, 
  Trash2, 
  Save, 
  X,
  Plus
} from 'lucide-react';

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState('subscriptions'); // receipts | subscriptions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // حالة التحكم بالتعديل المباشر
  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubFormData, setEditSubFormData] = useState({});

  const [editingReceiptId, setEditingReceiptId] = useState(null);
  const [editReceiptFormData, setEditReceiptFormData] = useState({});

  // نموذج إضافة اشتراك جديد
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [newSubData, setNewSubData] = useState({
    storeName: '',
    plan: 'شهري',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active'
  });

  // وصولات الدفع (تمت إضافة حقل transactionId رمز العملية)
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

  // إغلاق المودال بزر Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedReceipt(null);
        setIsAddSubOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- تعديل الاشتراكات ---
  const handleEditSubClick = (sub) => {
    setEditingSubId(sub.id);
    setEditSubFormData({ ...sub });
  };

  const handleCancelSubEdit = () => {
    setEditingSubId(null);
    setEditSubFormData({});
  };

  const handleSaveSubEdit = (id) => {
    setSubscriptions(prev => 
      prev.map(item => (item.id === id ? editSubFormData : item))
    );
    setEditingSubId(null);
  };

  // --- إضافة اشتراك جديد ---
  const handleAddSubSubmit = (e) => {
    e.preventDefault();
    if (!newSubData.storeName || !newSubData.endDate) return;

    const newEntry = {
      id: Date.now(),
      ...newSubData
    };

    setSubscriptions(prev => [newEntry, ...prev]);
    setIsAddSubOpen(false);
    setNewSubData({
      storeName: '',
      plan: 'شهري',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active'
    });
  };

  // --- تعديل وصولات الدفع ---
  const handleEditReceiptClick = (receipt) => {
    setEditingReceiptId(receipt.id);
    setEditReceiptFormData({ ...receipt });
  };

  const handleCancelReceiptEdit = () => {
    setEditingReceiptId(null);
    setEditReceiptFormData({});
  };

  const handleSaveReceiptEdit = (id) => {
    setReceipts(prev => 
      prev.map(item => (item.id === id ? editReceiptFormData : item))
    );
    setEditingReceiptId(null);
  };

  // --- الحذف ---
  const handleDeleteSub = (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الاشتراك؟')) {
      setSubscriptions(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteReceipt = (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الوصل؟')) {
      setReceipts(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- تفعيل الاشتراك تلقائياً عند قبول الوصل ---
  const handleApprove = (receipt) => {
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

    setSelectedReceipt(null);
  };

  const handleReject = (id) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setSelectedReceipt(null);
  };

  // تصفية العناصر بناءً على البحث (تشمل البحث برمز العملية أيضاً)
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

      {/* جدول اشتراكات المتاجر */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-2xl border border-[#A8E8F9]/40 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#A8E8F9]/20 text-[#013C58] font-bold border-b border-[#A8E8F9]/30">
                <tr>
                  <th className="p-4">المتجر</th>
                  <th className="p-4">نوع الخطة</th>
                  <th className="p-4">تاريخ البداية</th>
                  <th className="p-4">تاريخ الانتهاء</th>
                  <th className="p-4">حالة الاشتراك</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8E8F9]/20">
                {subscriptions.filter(filterBySearch).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  subscriptions
                    .filter(filterBySearch)
                    .map((sub) => {
                      const isEditing = editingSubId === sub.id;

                      return (
                        <tr key={sub.id} className="hover:bg-[#A8E8F9]/10 transition">
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editSubFormData.storeName}
                                onChange={(e) => setEditSubFormData({ ...editSubFormData, storeName: e.target.value })}
                                className="p-1.5 bg-white border border-[#F5A201] rounded-lg text-xs font-bold w-full focus:outline-none"
                              />
                            ) : (
                              <span className="font-bold text-[#013C58]">{sub.storeName}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <select
                                value={editSubFormData.plan}
                                onChange={(e) => setEditSubFormData({ ...editSubFormData, plan: e.target.value })}
                                className="p-1.5 bg-white border border-[#F5A201] rounded-lg text-xs font-semibold focus:outline-none"
                              >
                                <option value="أسبوعي">أسبوعي</option>
                                <option value="شهري">شهري</option>
                                <option value="سنوي">سنوي</option>
                              </select>
                            ) : (
                              <span className="font-semibold text-[#00537A] bg-[#A8E8F9]/30 px-2.5 py-1 rounded-md">{sub.plan}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="date"
                                value={editSubFormData.startDate}
                                onChange={(e) => setEditSubFormData({ ...editSubFormData, startDate: e.target.value })}
                                className="p-1 bg-white border border-[#F5A201] rounded-lg text-xs focus:outline-none"
                              />
                            ) : (
                              <span className="text-gray-500 font-medium">{sub.startDate}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="date"
                                value={editSubFormData.endDate}
                                onChange={(e) => setEditSubFormData({ ...editSubFormData, endDate: e.target.value })}
                                className="p-1 bg-white border border-[#F5A201] rounded-lg text-xs focus:outline-none"
                              />
                            ) : (
                              <span className="text-gray-500 font-medium">{sub.endDate}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <select
                                value={editSubFormData.status}
                                onChange={(e) => setEditSubFormData({ ...editSubFormData, status: e.target.value })}
                                className="p-1.5 bg-white border border-[#F5A201] rounded-lg text-xs font-semibold focus:outline-none"
                              >
                                <option value="active">نشط</option>
                                <option value="expiring_soon">ينتهي قريباً</option>
                                <option value="expired">منتهي</option>
                              </select>
                            ) : (
                              <>
                                {sub.status === 'active' && (
                                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-lg text-[10px]">نشط</span>
                                )}
                                {sub.status === 'expiring_soon' && (
                                  <span className="px-2.5 py-1 bg-[#FFBA42]/20 text-[#d98f00] border border-[#FFBA42]/40 font-bold rounded-lg text-[10px]">ينتهي قريباً</span>
                                )}
                                {sub.status === 'expired' && (
                                  <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-lg text-[10px]">منتهي</span>
                                )}
                              </>
                            )}
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveSubEdit(sub.id)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                    title="حفظ التعديلات"
                                  >
                                    <Save size={16} />
                                  </button>
                                  <button
                                    onClick={handleCancelSubEdit}
                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                                    title="إلغاء"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditSubClick(sub)}
                                    className="p-1.5 text-[#00537A] hover:bg-[#00537A]/10 rounded-lg transition cursor-pointer"
                                    title="تعديل الاشتراك"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSub(sub.id)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                    title="حذف الاشتراك"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
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
        </div>
      )}

      {/* جدول وصولات الدفع */}
      {activeTab === 'receipts' && (
        <div className="bg-white rounded-2xl border border-[#A8E8F9]/40 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#A8E8F9]/20 text-[#013C58] font-bold border-b border-[#A8E8F9]/30">
                <tr>
                  <th className="p-4">اسم المتجر</th>
                  <th className="p-4">صاحب المتجر</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">نوع الخطة</th>
                  <th className="p-4">رمز العملية</th>
                  <th className="p-4">تاريخ الرفع</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8E8F9]/20">
                {receipts.filter(filterBySearch).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400 font-medium">
                      لا توجد وصولات مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  receipts
                    .filter(filterBySearch)
                    .map((item) => {
                      const isEditing = editingReceiptId === item.id;

                      return (
                        <tr key={item.id} className="hover:bg-[#A8E8F9]/10 transition">
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editReceiptFormData.storeName}
                                onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, storeName: e.target.value })}
                                className="p-1.5 bg-white border border-[#F5A201] rounded-lg text-xs font-bold w-full focus:outline-none"
                              />
                            ) : (
                              <span className="font-bold text-[#013C58]">{item.storeName}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editReceiptFormData.ownerName}
                                onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, ownerName: e.target.value })}
                                className="p-1.5 bg-white border border-[#F5A201] rounded-lg text-xs w-full focus:outline-none"
                              />
                            ) : (
                              <span className="text-gray-600 font-medium">{item.ownerName}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editReceiptFormData.amount}
                                onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, amount: e.target.value })}
                                className="p-1 bg-white border border-[#F5A201] rounded-lg text-xs w-20 focus:outline-none"
                              />
                            ) : (
                              <span className="font-bold text-[#F5A201]">{item.amount}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <select
                                value={editReceiptFormData.plan}
                                onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, plan: e.target.value })}
                                className="p-1.5 bg-white border border-[#F5A201] rounded-lg text-xs font-semibold focus:outline-none"
                              >
                                <option value="أسبوعي">أسبوعي</option>
                                <option value="شهري">شهري</option>
                                <option value="سنوي">سنوي</option>
                              </select>
                            ) : (
                              <span className="text-gray-600 font-medium">{item.plan}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editReceiptFormData.transactionId}
                                onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, transactionId: e.target.value })}
                                className="p-1 bg-white border border-[#F5A201] rounded-lg text-xs font-mono w-28 focus:outline-none"
                              />
                            ) : (
                              <span className="text-[#013C58] font-mono font-bold bg-[#A8E8F9]/20 px-2 py-1 rounded">{item.transactionId}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <input
                                type="date"
                                value={editReceiptFormData.date}
                                onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, date: e.target.value })}
                                className="p-1 bg-white border border-[#F5A201] rounded-lg text-xs focus:outline-none"
                              />
                            ) : (
                              <span className="text-gray-500 font-medium">{item.date}</span>
                            )}
                          </td>

                          <td className="p-4">
                            {isEditing ? (
                              <select
                                value={editReceiptFormData.status}
                                onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, status: e.target.value })}
                                className="p-1.5 bg-white border border-[#F5A201] rounded-lg text-xs font-semibold focus:outline-none"
                              >
                                <option value="pending">قيد التدقيق</option>
                                <option value="approved">مقبول</option>
                                <option value="rejected">مرفوض</option>
                              </select>
                            ) : (
                              <>
                                {item.status === 'pending' && (
                                  <span className="px-2.5 py-1 bg-[#FFBA42]/20 text-[#d98f00] border border-[#FFBA42]/40 font-bold rounded-lg text-[10px] inline-flex items-center gap-1">
                                    <Clock size={12} /> قيد التدقيق
                                  </span>
                                )}
                                {item.status === 'approved' && (
                                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-lg text-[10px] inline-flex items-center gap-1">
                                    <CheckCircle2 size={12} /> مقبول
                                  </span>
                                )}
                                {item.status === 'rejected' && (
                                  <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-lg text-[10px] inline-flex items-center gap-1">
                                    <XCircle size={12} /> مرفوض
                                  </span>
                                )}
                              </>
                            )}
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveReceiptEdit(item.id)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                    title="حفظ التعديلات"
                                  >
                                    <Save size={16} />
                                  </button>
                                  <button
                                    onClick={handleCancelReceiptEdit}
                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                                    title="إلغاء"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setSelectedReceipt(item)}
                                    className="p-1.5 text-[#F5A201] hover:bg-[#F5A201]/10 rounded-lg transition cursor-pointer"
                                    title="معاينة الوصل"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleEditReceiptClick(item)}
                                    className="p-1.5 text-[#00537A] hover:bg-[#00537A]/10 rounded-lg transition cursor-pointer"
                                    title="تعديل الوصل"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReceipt(item.id)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                    title="حذف الوصل"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
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
        </div>
      )}

      {/* مودال معاينة الوصل */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 bg-[#013C58]/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedReceipt(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-[#A8E8F9]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#A8E8F9]/30 pb-3">
              <h3 className="font-bold text-sm text-[#013C58]">
                معاينة وصل الدفع - {selectedReceipt.storeName}
              </h3>
              <button 
                onClick={() => setSelectedReceipt(null)} 
                className="p-1 text-gray-400 hover:text-[#013C58] hover:bg-[#A8E8F9]/20 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* تفاصيل إضافية للوصل */}
            <div className="bg-[#A8E8F9]/10 border border-[#A8E8F9]/30 rounded-xl p-3 space-y-2 text-xs text-[#013C58]">
              <div className="flex justify-between">
                <span className="text-gray-500">رمز العملية:</span>
                <span className="font-mono font-bold">{selectedReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المبلغ المدفوع:</span>
                <span className="font-bold text-[#F5A201]">{selectedReceipt.amount}</span>
              </div>
            </div>

            <div className="bg-[#A8E8F9]/10 border border-[#A8E8F9]/30 rounded-xl p-3 text-center">
              <img 
                src={selectedReceipt.receiptImg} 
                alt="وصل الدفع" 
                className="max-h-64 mx-auto rounded-lg object-contain shadow-sm border border-[#A8E8F9]/30" 
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#A8E8F9]/30">
              {selectedReceipt.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleApprove(selectedReceipt)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition cursor-pointer shadow-sm"
                  >
                    قبول وتفعيل الاشتراك
                  </button>
                  <button
                    onClick={() => handleReject(selectedReceipt.id)}
                    className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition cursor-pointer shadow-sm"
                  >
                    رفض الوصل
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 bg-[#A8E8F9]/20 border border-[#A8E8F9]/40 text-[#013C58] font-bold rounded-xl text-xs hover:bg-[#A8E8F9]/40 transition cursor-pointer"
                >
                  إغلاق
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* مودال إضافة اشتراك جديد */}
      {isAddSubOpen && (
        <div 
          className="fixed inset-0 bg-[#013C58]/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsAddSubOpen(false)}
        >
          <form 
            onSubmit={handleAddSubSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-[#A8E8F9]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#A8E8F9]/30 pb-3">
              <h3 className="font-bold text-sm text-[#013C58]">إضافة اشتراك جديد</h3>
              <button 
                type="button" 
                onClick={() => setIsAddSubOpen(false)} 
                className="p-1 text-gray-400 hover:text-[#013C58] hover:bg-[#A8E8F9]/20 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#013C58] mb-1">اسم المتجر</label>
                <input
                  type="text"
                  required
                  value={newSubData.storeName}
                  onChange={(e) => setNewSubData({ ...newSubData, storeName: e.target.value })}
                  placeholder="مثال: متجر الزهور"
                  className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl text-xs focus:outline-none focus:border-[#F5A201] focus:bg-white text-[#013C58] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#013C58] mb-1">نوع الخطة</label>
                <select
                  value={newSubData.plan}
                  onChange={(e) => setNewSubData({ ...newSubData, plan: e.target.value })}
                  className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F5A201] focus:bg-white text-[#013C58] transition"
                >
                  <option value="أسبوعي">أسبوعي</option>
                  <option value="شهري">شهري</option>
                  <option value="سنوي">سنوي</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#013C58] mb-1">تاريخ البداية</label>
                  <input
                    type="date"
                    required
                    value={newSubData.startDate}
                    onChange={(e) => setNewSubData({ ...newSubData, startDate: e.target.value })}
                    className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl text-xs focus:outline-none focus:border-[#F5A201] focus:bg-white text-[#013C58] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#013C58] mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    required
                    value={newSubData.endDate}
                    onChange={(e) => setNewSubData({ ...newSubData, endDate: e.target.value })}
                    className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl text-xs focus:outline-none focus:border-[#F5A201] focus:bg-white text-[#013C58] transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#A8E8F9]/30">
              <button
                type="button"
                onClick={() => setIsAddSubOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-200 transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#F5A201] text-white font-bold rounded-xl text-xs hover:bg-[#d98f00] transition cursor-pointer shadow-sm"
              >
                حفظ الاشتراك
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}