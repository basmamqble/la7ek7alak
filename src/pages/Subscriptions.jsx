import React, { useState } from 'react';
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
  X 
} from 'lucide-react';

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState('subscriptions'); // receipts | subscriptions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // حالة التحكم بالتعديل المباشر في جدولي الاشتراكات والوصولات
  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubFormData, setEditSubFormData] = useState({});

  const [editingReceiptId, setEditingReceiptId] = useState(null);
  const [editReceiptFormData, setEditReceiptFormData] = useState({});

  // وصولات الدفع
  const [receipts, setReceipts] = useState([
    {
      id: 1,
      storeName: 'متجر القدس',
      ownerName: 'محمد أحمد',
      amount: '50 $',
      plan: 'سنوي',
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
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذا الاشتراك؟')) {
      setSubscriptions(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteReceipt = (id) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذا الوصل؟')) {
      setReceipts(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleApprove = (id) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    setSelectedReceipt(null);
  };

  const handleReject = (id) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setSelectedReceipt(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-right dir-rtl">
      {/* الهيدر والتبويب */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFECE6] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#8E5439]/10 text-[#8E5439] rounded-xl">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2D1B13]">إدارة الاشتراكات والوصولات</h1>
            <p className="text-xs text-gray-500 mt-0.5">متابعة وتعديل خطط الاشتراكات والوصولات المرفوعة</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#EFECE6]">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'subscriptions' ? 'bg-[#8E5439] text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            سجل اشتراكات المتاجر
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'receipts' ? 'bg-[#8E5439] text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            وصولات الدفع
          </button>
        </div>
      </div>

      {/* البحث */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-[#EFECE6]">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم المتجر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl text-xs focus:outline-none focus:border-[#8E5439]"
          />
        </div>
      </div>

      {/* جدول اشتراكات المتاجر */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-2xl border border-[#EFECE6] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF8F5] text-gray-600 font-bold border-b border-[#EFECE6]">
                <tr>
                  <th className="p-4">المتجر</th>
                  <th className="p-4">نوع الخطة</th>
                  <th className="p-4">تاريخ البداية</th>
                  <th className="p-4">تاريخ الانتهاء</th>
                  <th className="p-4">حالة الاشتراك</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {subscriptions
                  .filter(sub => sub.storeName.includes(searchQuery))
                  .map((sub) => {
                    const isEditing = editingSubId === sub.id;

                    return (
                      <tr key={sub.id} className="hover:bg-[#FAF8F5]/50 transition">
                        {/* اسم المتجر - قابل للتعديل */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editSubFormData.storeName}
                              onChange={(e) => setEditSubFormData({ ...editSubFormData, storeName: e.target.value })}
                              className="p-1.5 bg-white border border-[#EFECE6] rounded-lg text-xs font-bold w-full focus:outline-none focus:border-[#8E5439]"
                            />
                          ) : (
                            <span className="font-bold text-[#2D1B13]">{sub.storeName}</span>
                          )}
                        </td>

                        {/* نوع الخطة */}
                        <td className="p-4">
                          {isEditing ? (
                            <select
                              value={editSubFormData.plan}
                              onChange={(e) => setEditSubFormData({ ...editSubFormData, plan: e.target.value })}
                              className="p-1.5 bg-white border border-[#EFECE6] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#8E5439]"
                            >
                              <option value="أسبوعي">أسبوعي</option>
                              <option value="شهري">شهري</option>
                              <option value="سنوي">سنوي</option>
                            </select>
                          ) : (
                            <span className="font-medium text-gray-700">{sub.plan}</span>
                          )}
                        </td>

                        {/* تاريخ البداية */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="date"
                              value={editSubFormData.startDate}
                              onChange={(e) => setEditSubFormData({ ...editSubFormData, startDate: e.target.value })}
                              className="p-1 bg-white border border-[#EFECE6] rounded-lg text-xs focus:outline-none"
                            />
                          ) : (
                            <span className="text-gray-500">{sub.startDate}</span>
                          )}
                        </td>

                        {/* تاريخ الانتهاء */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="date"
                              value={editSubFormData.endDate}
                              onChange={(e) => setEditSubFormData({ ...editSubFormData, endDate: e.target.value })}
                              className="p-1 bg-white border border-[#EFECE6] rounded-lg text-xs focus:outline-none"
                            />
                          ) : (
                            <span className="text-gray-500">{sub.endDate}</span>
                          )}
                        </td>

                        {/* حالة الاشتراك */}
                        <td className="p-4">
                          {isEditing ? (
                            <select
                              value={editSubFormData.status}
                              onChange={(e) => setEditSubFormData({ ...editSubFormData, status: e.target.value })}
                              className="p-1.5 bg-white border border-[#EFECE6] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#8E5439]"
                            >
                              <option value="active">نشط</option>
                              <option value="expiring_soon">وينتهي قريباً</option>
                              <option value="expired">منتهي</option>
                            </select>
                          ) : (
                            <>
                              {sub.status === 'active' && (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-[10px]">نشط</span>
                              )}
                              {sub.status === 'expiring_soon' && (
                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[10px]">وينتهي قريباً</span>
                              )}
                              {sub.status === 'expired' && (
                                <span className="px-2.5 py-1 bg-red-50 text-red-700 font-bold rounded-lg text-[10px]">منتهي</span>
                              )}
                            </>
                          )}
                        </td>

                        {/* الإجراءات */}
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
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                  title="تعديل الاشتراك"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSub(sub.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
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
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* جدول وصولات الدفع */}
      {activeTab === 'receipts' && (
        <div className="bg-white rounded-2xl border border-[#EFECE6] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF8F5] text-gray-600 font-bold border-b border-[#EFECE6]">
                <tr>
                  <th className="p-4">اسم المتجر</th>
                  <th className="p-4">صاحب المتجر</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">نوع الخطة</th>
                  <th className="p-4">تاريخ الرفع</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {receipts
                  .filter(r => r.storeName.includes(searchQuery))
                  .map((item) => {
                    const isEditing = editingReceiptId === item.id;

                    return (
                      <tr key={item.id} className="hover:bg-[#FAF8F5]/50 transition">
                        {/* اسم المتجر - قابل للتعديل */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editReceiptFormData.storeName}
                              onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, storeName: e.target.value })}
                              className="p-1.5 bg-white border border-[#EFECE6] rounded-lg text-xs font-bold w-full focus:outline-none focus:border-[#8E5439]"
                            />
                          ) : (
                            <span className="font-bold text-[#2D1B13]">{item.storeName}</span>
                          )}
                        </td>

                        {/* صاحب المتجر - قابل للتعديل */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editReceiptFormData.ownerName}
                              onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, ownerName: e.target.value })}
                              className="p-1.5 bg-white border border-[#EFECE6] rounded-lg text-xs w-full focus:outline-none focus:border-[#8E5439]"
                            />
                          ) : (
                            <span className="text-gray-600">{item.ownerName}</span>
                          )}
                        </td>

                        {/* المبلغ - قابل للتعديل */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editReceiptFormData.amount}
                              onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, amount: e.target.value })}
                              className="p-1 bg-white border border-[#EFECE6] rounded-lg text-xs w-20 focus:outline-none"
                            />
                          ) : (
                            <span className="font-bold text-emerald-600">{item.amount}</span>
                          )}
                        </td>

                        {/* نوع الخطة */}
                        <td className="p-4">
                          {isEditing ? (
                            <select
                              value={editReceiptFormData.plan}
                              onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, plan: e.target.value })}
                              className="p-1.5 bg-white border border-[#EFECE6] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#8E5439]"
                            >
                              <option value="أسبوعي">أسبوعي</option>
                              <option value="شهري">شهري</option>
                              <option value="سنوي">سنوي</option>
                            </select>
                          ) : (
                            <span className="text-gray-600">{item.plan}</span>
                          )}
                        </td>

                        {/* تاريخ الرفع */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="date"
                              value={editReceiptFormData.date}
                              onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, date: e.target.value })}
                              className="p-1 bg-white border border-[#EFECE6] rounded-lg text-xs focus:outline-none"
                            />
                          ) : (
                            <span className="text-gray-500">{item.date}</span>
                          )}
                        </td>

                        {/* حالة الوصل */}
                        <td className="p-4">
                          {isEditing ? (
                            <select
                              value={editReceiptFormData.status}
                              onChange={(e) => setEditReceiptFormData({ ...editReceiptFormData, status: e.target.value })}
                              className="p-1.5 bg-white border border-[#EFECE6] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#8E5439]"
                            >
                              <option value="pending">قيد التدقيق</option>
                              <option value="approved">مقبول</option>
                              <option value="rejected">مرفوض</option>
                            </select>
                          ) : (
                            <>
                              {item.status === 'pending' && (
                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[10px] inline-flex items-center gap-1">
                                  <Clock size={12} /> قيد التدقيق
                                </span>
                              )}
                              {item.status === 'approved' && (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-[10px] inline-flex items-center gap-1">
                                  <CheckCircle2 size={12} /> مقبول
                                </span>
                              )}
                              {item.status === 'rejected' && (
                                <span className="px-2.5 py-1 bg-red-50 text-red-700 font-bold rounded-lg text-[10px] inline-flex items-center gap-1">
                                  <XCircle size={12} /> مرفوض
                                </span>
                              )}
                            </>
                          )}
                        </td>

                        {/* الإجراءات */}
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
                                  className="p-1.5 text-gray-600 hover:text-[#8E5439] hover:bg-[#FAF8F5] rounded-lg transition cursor-pointer"
                                  title="معاينة الوصل"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleEditReceiptClick(item)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                  title="تعديل الوصل"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteReceipt(item.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
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
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* مودال معاينة الوصل */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm text-[#2D1B13]">معاينة وصل الدفع - {selectedReceipt.storeName}</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>
            <div className="bg-gray-100 rounded-xl p-2 text-center">
              <img src={selectedReceipt.receiptImg} alt="وصل الدفع" className="max-h-80 mx-auto rounded-lg object-contain" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {selectedReceipt.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedReceipt.id)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700"
                  >
                    قبول وتفعيل
                  </button>
                  <button
                    onClick={() => handleReject(selectedReceipt.id)}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700"
                  >
                    رفض الوصل
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}