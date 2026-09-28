import React from 'react';
import { Mail, Phone, Edit2, Ban, CheckCircle2, Save, X, Trash2, Loader2 } from 'lucide-react';

export default function CustomersTable({
  customers,
  editingId,
  editFormData,
  setEditFormData,
  updatingId,
  isSubmitting,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onOpenStatusConfirm,
  onDelete,
}) {
  if (!customers || customers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-xs">
        لا يوجد زبائن مطبقون لشروط البحث.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-right border-collapse text-xs min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
            <th className="py-3.5 px-4 font-semibold">الزبون</th>
            <th className="py-3.5 px-4 font-semibold">البريد الإلكتروني</th>
            <th className="py-3.5 px-4 font-semibold">رقم الهاتف</th>
            <th className="py-3.5 px-4 font-semibold text-center">الحالة</th>
            <th className="py-3.5 px-4 font-semibold text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.map((customer) => {
            const custId = customer.id || customer._id;
            const isEditing = editingId === custId;
            const isBanned = customer.status === 'banned' || customer.status === 'محظور' || customer.status === 'blocked';
            const isUpdating = updatingId === custId;

            return (
              <tr key={custId} className="hover:bg-gray-50/50 transition">
                {/* اسم الزبون */}
                <td className="py-3.5 px-4 font-medium text-gray-800 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-brand-primary"
                    />
                  ) : (
                    <span>{customer.name || customer.fullName || 'غير محدد'}</span>
                  )}
                </td>

                {/* البريد الإلكتروني */}
                <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-brand-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} className="text-gray-400 shrink-0" />
                      <span className="dir-ltr text-right">{customer.email || '—'}</span>
                    </div>
                  )}
                </td>

                {/* رقم الهاتف */}
                <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-brand-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <span className="dir-ltr text-right">{customer.phone || customer.phoneNumber || '—'}</span>
                    </div>
                  )}
                </td>

                {/* الحالة */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  {isBanned ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                      <Ban size={12} />
                      محظور
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle2 size={12} />
                      نشط
                    </span>
                  )}
                </td>

                {/* الإجراءات */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  {isEditing ? (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onSaveEdit(custId)}
                        disabled={isSubmitting}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        title="حفظ"
                      >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      </button>
                      <button
                        onClick={onCancelEdit}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                        title="إلغاء"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onStartEdit(customer)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                        title="تعديل"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => onOpenStatusConfirm(customer)}
                        disabled={isUpdating}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isBanned
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-amber-600 hover:bg-amber-50'
                        }`}
                        title={isBanned ? 'إلغاء الحظر' : 'حظر الحساب'}
                      >
                        {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Ban size={15} />}
                      </button>

                      <button
                        onClick={() => onDelete(customer)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
