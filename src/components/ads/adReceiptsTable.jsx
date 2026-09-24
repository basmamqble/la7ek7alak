import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trash2, Eye, Edit2, Save, X } from 'lucide-react';

export default function AdReceiptsTable({ receipts, onDelete, onUpdate, onApprove, onReject }) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = (id) => {
    onUpdate(id, editForm);
    setEditingId(null);
  };

  if (receipts.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm text-gray-400 text-xs">
        لا توجد وصولات دفع إعلانات مسجلة حالياً.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold border-b border-gray-100">
              <th className="p-4">المتجر / المالك</th>
              <th className="p-4">باقة الإعلان</th>
              <th className="p-4">المبلغ</th>
              <th className="p-4">رقم الحوالة (TRX)</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">صورة الوصل</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
            {receipts.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={editForm.storeName}
                          onChange={(e) => setEditForm({ ...editForm, storeName: e.target.value })}
                          className="p-1 border rounded text-xs w-full bg-white"
                          placeholder="اسم المتجر"
                        />
                        <input
                          type="text"
                          value={editForm.ownerName}
                          onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                          className="p-1 border rounded text-xs w-full bg-white"
                          placeholder="اسم المالك"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="font-bold text-gray-800">{item.storeName}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{item.ownerName}</div>
                      </>
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <select
                        value={editForm.adPlan}
                        onChange={(e) => {
                          const plan = e.target.value;
                          let price = '5 $';
                          if (plan.includes('3')) price = '10 $';
                          if (plan.includes('5')) price = '15 $';
                          setEditForm({ ...editForm, adPlan: plan, amount: price });
                        }}
                        className="p-1.5 border rounded-lg text-xs w-full bg-white"
                      >
                        <option value="إعلان واحد فردي">إعلان واحد فردي (5 $)</option>
                        <option value="باقة 3 إعلانات (مميز)">باقة 3 إعلانات (10 $)</option>
                        <option value="باقة 5 إعلانات (فائق)">باقة 5 إعلانات (15 $)</option>
                      </select>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                        {item.adPlan}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-emerald-600">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="p-1.5 border rounded-lg text-xs w-20 bg-white"
                      />
                    ) : (
                      item.amount
                    )}
                  </td>
                  <td className="p-4 font-mono text-gray-500">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.transactionId}
                        onChange={(e) => setEditForm({ ...editForm, transactionId: e.target.value })}
                        className="p-1.5 border rounded-lg text-xs w-full bg-white"
                      />
                    ) : (
                      item.transactionId
                    )}
                  </td>
                  <td className="p-4 text-gray-500">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="p-1.5 border rounded-lg text-xs bg-white"
                      />
                    ) : (
                      item.date
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedReceipt(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition cursor-pointer"
                    >
                      <Eye size={14} /> عرض الوصل
                    </button>
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="p-1.5 border rounded-lg text-xs bg-white"
                      >
                        <option value="approved">مقبول </option>
                        <option value="pending">قيد التدقيق</option>
                        <option value="rejected">مرفوض</option>
                      </select>
                    ) : (
                      <>
                        {item.status === 'approved' && <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-[11px] font-bold">مقبول </span>}
                        {item.status === 'pending' && <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg text-[11px] font-bold">قيد التدقيق</span>}
                        {item.status === 'rejected' && <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg text-[11px] font-bold">مرفوض</span>}
                      </>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {isEditing ? (
                        <>
                          <button onClick={() => handleSave(item.id)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 cursor-pointer" title="حفظ">
                            <Save size={15} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer" title="إلغاء">
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          {item.status === 'pending' && (
                            <>
                              <button onClick={() => onApprove(item)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 cursor-pointer" title="قبول وتفعيل">
                                <CheckCircle2 size={16} />
                              </button>
                              <button onClick={() => onReject(item.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer" title="رفض">
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleEditClick(item)} className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 cursor-pointer" title="تعديل سطر بسطر">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => onDelete(item.id)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer" title="حذف">
                            <Trash2 size={15} />
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

      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-800">معاينة وصل الدفع - {selectedReceipt.storeName}</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="flex justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <img src={selectedReceipt.receiptImg} alt="Receipt" className="max-h-80 object-contain rounded-lg shadow-sm" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500">
                <span>المبلغ: </span><strong className="text-emerald-600">{selectedReceipt.amount}</strong>
              </div>
              <div className="flex gap-2">
                {selectedReceipt.status === 'pending' && (
                  <button
                    onClick={() => {
                      onApprove(selectedReceipt);
                      setSelectedReceipt(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                  >
                    مقبول وتفعيل الإعلان
                  </button>
                )}
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}