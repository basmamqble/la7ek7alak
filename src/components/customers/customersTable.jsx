import React from 'react';
import { Mail, Phone, Ban, Trash2, Edit, Save, X, Loader2 } from 'lucide-react';

export default function CustomersTable({
  customers = [],
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
  return (
    <div className="bg-brand-card rounded-2xl border border-brand-border shadow-xs overflow-hidden">
      <table className="w-full text-right border-collapse text-xs table-fixed">
        <thead>
          <tr className="bg-brand-bg text-brand-body font-bold border-b border-brand-border">
            <th className="p-4 w-1/4 text-right">الزبون</th>
            <th className="p-4 w-1/3 text-right">البريد الإلكتروني</th>
            <th className="p-4 w-1/4 text-right">رقم الهاتف</th>
            <th className="p-4 w-1/6 text-center">الحالة</th>
            <th className="p-4 w-1/4 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-400">
                لا يوجد زبائن مطبقين لشروط البحث.
              </td>
            </tr>
          ) : (
            customers.map((customer) => {
              const custId = customer.id || customer._id;
              const isEditing = editingId === custId;
              const isUpdating = updatingId === custId;
              const isBanned = customer.status === 'banned' || customer.status === 'محظور';

              return (
                <tr key={custId} className="hover:bg-brand-bg/50 transition">
                  {/* اسم الزبون */}
                  <td className="p-4 font-bold text-brand-title truncate">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full bg-brand-bg px-2.5 py-1.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-secondary text-xs text-brand-title"
                      />
                    ) : (
                      customer.name || customer.fullName
                    )}
                  </td>

                  {/* البريد الإلكتروني */}
                  <td className="p-4 text-brand-body truncate">
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                          className="w-full bg-brand-bg pr-8 pl-3 py-1.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-secondary text-xs text-brand-title text-right"
                        />
                        <Mail size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Mail size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </span>
                    )}
                  </td>

                  {/* رقم الهاتف */}
                  <td className="p-4 text-brand-body font-mono">
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          className="w-full bg-brand-bg pr-8 pl-3 py-1.5 rounded-lg border border-brand-border focus:outline-none focus:border-brand-secondary text-xs text-brand-title text-right"
                        />
                        <Phone size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Phone size={13} className="text-gray-400 shrink-0" />
                        <span dir="ltr" className="text-right">{customer.phone || customer.phoneNumber}</span>
                      </span>
                    )}
                  </td>

                  {/* الحالة */}
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                        isBanned
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {isBanned ? 'محظور' : 'نشط'}
                    </span>
                  </td>

                  {/* الإجراءات */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onSaveEdit(custId)}
                            disabled={isSubmitting}
                            className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="حفظ"
                          >
                            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                            <span>حفظ</span>
                          </button>
                          <button
                            type="button"
                            onClick={onCancelEdit}
                            className="px-2.5 py-1.5 bg-brand-bg text-brand-body rounded-lg hover:bg-brand-border/60 transition font-medium flex items-center gap-1 cursor-pointer"
                            title="إلغاء"
                          >
                            <X size={13} />
                            <span>إلغاء</span>
                          </button>
                        </>
                      ) : (
                        <>
                          {/* زر الحذف */}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(custId)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}

                          {/* زر تغيير الحالة / الحظر */}
                          {onOpenStatusConfirm && (
                            <button
                              type="button"
                              onClick={() => onOpenStatusConfirm(customer)}
                              disabled={isUpdating}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                              title="تغيير حالة الحساب"
                            >
                              {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Ban size={15} />}
                            </button>
                          )}

                          {/* زر تعديل البيانات المباشر */}
                          <button
                            type="button"
                            onClick={() => onStartEdit(customer)}
                            className="p-1.5 text-brand-secondary hover:bg-brand-secondary/10 rounded-lg transition cursor-pointer"
                            title="تعديل البيانات"
                          >
                            <Edit size={15} />
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
  );
}