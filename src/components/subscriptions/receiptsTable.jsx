import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, Clock, Pencil, Trash2, Save, X } from 'lucide-react';

export default function ReceiptsTable({ receipts, onUpdate, onDelete, onApprove, onReject }) {
  const [editingReceiptId, setEditingReceiptId] = useState(null);
  const [editReceiptFormData, setEditReceiptFormData] = useState({});
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleEditClick = (receipt) => {
    setEditingReceiptId(receipt.id);
    setEditReceiptFormData({ ...receipt });
  };

  const handleCancelEdit = () => {
    setEditingReceiptId(null);
    setEditReceiptFormData({});
  };

  const handleSaveEdit = (id) => {
    onUpdate(id, editReceiptFormData);
    setEditingReceiptId(null);
  };

  return (
    <>
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
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 font-medium">
                    لا توجد وصولات دفع مضافة
                  </td>
                </tr>
              ) : (
                receipts.map((item) => {
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
                                onClick={() => handleSaveEdit(item.id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                title="حفظ"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
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
                                title="معاينة"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-1.5 text-[#00537A] hover:bg-[#00537A]/10 rounded-lg transition cursor-pointer"
                                title="تعديل"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => onDelete(item.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="حذف"
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

      {/* مودال معاينة الوصل */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 bg-[#013C58]/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedReceipt(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-[#A8E8F9]/40 text-right dir-rtl font-sans"
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

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#A8E8F9]/30">
              <button
                onClick={() => {
                  onReject(selectedReceipt.id);
                  setSelectedReceipt(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <XCircle size={16} />
                رفض
              </button>
              <button
                onClick={() => {
                  onApprove(selectedReceipt);
                  setSelectedReceipt(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                <CheckCircle2 size={16} />
                مقبول وتفعيل الاشتراك
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}