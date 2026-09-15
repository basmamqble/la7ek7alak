import React, { useState } from 'react';
import { Pencil, Trash2, Save, X } from 'lucide-react';

export default function SubscriptionsTable({ subscriptions, onUpdate, onDelete }) {
  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubFormData, setEditSubFormData] = useState({});

  const handleEditClick = (sub) => {
    setEditingSubId(sub.id);
    setEditSubFormData({ ...sub });
  };

  const handleCancelEdit = () => {
    setEditingSubId(null);
    setEditSubFormData({});
  };

  const handleSaveEdit = (id) => {
    onUpdate(id, editSubFormData);
    setEditingSubId(null);
  };

  return (
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
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                  لا توجد اشتراكات مضافة
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => {
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
                              onClick={() => handleSaveEdit(sub.id)}
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
                              onClick={() => handleEditClick(sub)}
                              className="p-1.5 text-[#00537A] hover:bg-[#00537A]/10 rounded-lg transition cursor-pointer"
                              title="تعديل"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => onDelete(sub.id)}
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
  );
}