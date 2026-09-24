import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, AlertTriangle, XCircle, Save, X } from 'lucide-react';

export default function AdsTable({ ads, onUpdate, onDelete }) {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-[11px] font-bold"><CheckCircle size={13} /> نشط</span>;
      case 'expiring_soon':
        return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg text-[11px] font-bold"><AlertTriangle size={13} /> ينتهي قريباً</span>;
      case 'expired':
        return <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg text-[11px] font-bold"><XCircle size={13} /> منتهي</span>;
      default:
        return null;
    }
  };

  if (ads.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm text-gray-400 text-xs">
        لا توجد إعلانات مطابقة للبحث.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold border-b border-gray-100">
              <th className="p-4">اسم المتجر</th>
              <th className="p-4">الباقة الإعلانية</th>
              <th className="p-4">السعر</th>
              <th className="p-4">تاريخ البداية</th>
              <th className="p-4">تاريخ النهاية</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
            {ads.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-800">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.storeName}
                        onChange={(e) => setEditForm({ ...editForm, storeName: e.target.value })}
                        className="p-1.5 border rounded-lg text-xs w-full bg-white"
                      />
                    ) : (
                      item.storeName
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
                        className="p-1.5 border rounded-lg text-xs w-24 bg-white"
                      />
                    ) : (
                      item.amount
                    )}
                  </td>
                  <td className="p-4 text-gray-500">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                        className="p-1.5 border rounded-lg text-xs bg-white"
                      />
                    ) : (
                      item.startDate
                    )}
                  </td>
                  <td className="p-4 text-gray-500">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                        className="p-1.5 border rounded-lg text-xs bg-white"
                      />
                    ) : (
                      item.endDate
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="p-1.5 border rounded-lg text-xs bg-white"
                      >
                        <option value="active">نشط</option>
                        <option value="expiring_soon">ينتهي قريباً</option>
                        <option value="expired">منتهي</option>
                      </select>
                    ) : (
                      getStatusBadge(item.status)
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
                          <button onClick={() => handleEditClick(item)} className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 cursor-pointer" title="تعديل سطر بسطر">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => onDelete(item.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer" title="حذف">
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
    </div>
  );
}