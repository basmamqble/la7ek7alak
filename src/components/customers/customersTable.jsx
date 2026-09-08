import React, { useState } from 'react';
import { Mail, Phone, Ban, Trash2, KeyRound, Edit, X, CheckCircle, Loader2, User } from 'lucide-react';
import API from '../../api/axios';
import ResetPasswordModal from '../common/ResetPasswordModal';

export default function CustomersTable({ customers = [], onToggleStatus, onDelete, refreshCustomers }) {
  // حالة التحكم بمودال تغيير كلمة المرور
  const [selectedCustomerForReset, setSelectedCustomerForReset] = useState(null);

  // حالات مودال التعديل
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // فتح نافذة تعديل بيانات الزبون
  const handleOpenEdit = (customer) => {
    setSelectedCustomerForEdit(customer);
    setEditFormData({
      name: customer.name || customer.fullName || '',
      phone: customer.phone || customer.phoneNumber || '',
      email: customer.email || '',
    });
    setIsEditModalOpen(true);
  };

  // حفظ تعديلات الزبون
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const targetId = selectedCustomerForEdit.id || selectedCustomerForEdit._id;
      const payload = {
        name: editFormData.name,
        phone: editFormData.phone,
        email: editFormData.email,
      };

      await API.put(`/admin/customers/${targetId}`, payload);

      setFeedback({ type: 'success', text: 'تم تحديث بيانات الزبون بنجاح!' });
      setTimeout(async () => {
        setIsEditModalOpen(false);
        setFeedback({ type: '', text: '' });
        if (typeof refreshCustomers === 'function') {
          await refreshCustomers();
        }
      }, 1200);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'حدث خطأ أثناء تعديل بيانات الزبون',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            customers.map((customer) => (
              <tr key={customer.id || customer._id} className="hover:bg-brand-bg/50 transition">
                <td className="p-4 font-bold text-brand-title truncate">
                  {customer.name || customer.fullName}
                </td>
                <td className="p-4 text-brand-body truncate">
                  <span className="inline-flex items-center gap-1.5">
                    {customer.email}
                    <Mail size={12} className="text-gray-400 shrink-0" />
                  </span>
                </td>
                <td className="p-4 text-brand-body font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <span dir="ltr">{customer.phone || customer.phoneNumber}</span>
                    <Phone size={12} className="text-gray-400 shrink-0" />
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                      customer.status === 'banned'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {customer.status === 'banned' ? 'محظور' : 'نشط'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* زر تعديل البيانات */}
                    <button
                      onClick={() => handleOpenEdit(customer)}
                      className="p-1.5 text-brand-secondary hover:bg-brand-secondary/10 rounded-lg transition cursor-pointer"
                      title="تعديل البيانات"
                    >
                      <Edit size={15} />
                    </button>

                    {/* زر تغيير كلمة المرور */}
                    <button
                      onClick={() => setSelectedCustomerForReset(customer)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                      title="تغيير كلمة المرور"
                    >
                      <KeyRound size={15} />
                    </button>

                    {onToggleStatus && (
                      <button
                        onClick={() => onToggleStatus(customer.id || customer._id)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                        title="تغيير الحالة"
                      >
                        <Ban size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(customer.id || customer._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* مودال تغيير كلمة المرور */}
      {selectedCustomerForReset && (
        <ResetPasswordModal
          userId={selectedCustomerForReset.id || selectedCustomerForReset._id}
          userPhone={selectedCustomerForReset.phone || selectedCustomerForReset.phoneNumber}
          userName={selectedCustomerForReset.name || selectedCustomerForReset.fullName}
          onClose={() => setSelectedCustomerForReset(null)}
        />
      )}

      {/* مودال تعديل بيانات الزبون */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-brand-card rounded-2xl w-full max-w-md p-6 shadow-xl border border-brand-border relative text-right">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-brand-title transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-base font-bold text-brand-title mb-4 flex items-center gap-2">
              <User size={18} className="text-brand-secondary" />
              تعديل بيانات الزبون
            </h2>

            {feedback.text && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle size={16} />}
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-title mb-1.5">اسم الزبون</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  className="w-full text-right px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-secondary text-xs bg-brand-card text-brand-title transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-title mb-1.5">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full text-right px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-secondary text-xs bg-brand-card text-brand-title transition"
                  />
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-title mb-1.5">رقم الهاتف</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full text-right px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-secondary text-xs bg-brand-card text-brand-title transition"
                  />
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-brand-bg text-brand-title rounded-xl text-xs font-medium hover:bg-brand-border/60 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-brand-primary text-white rounded-xl text-xs font-medium hover:bg-brand-primary-hover transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}