import React, { useState } from 'react';
import CustomersTable from './customersTable';
import { AlertTriangle, X } from 'lucide-react'; // أيقونات للتحذير والمودال

export default function CustomersPage() {
  // 1. البيانات الوهمية المطابقة لصورتك
  const [customers, setCustomers] = useState([
    { id: 1, name: 'أحمد محمود', email: 'ahmed@example.com', phone: '0599123456', status: 'active' },
    { id: 2, name: 'سارة علي', email: 'sara@example.com', phone: '0598765432', status: 'active' },
    { id: 3, name: 'محمد خالد', email: 'mohamed@example.com', phone: '0597112233', status: 'banned' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '' });
  const [updatingId, setUpdatingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حالات مودال تأكيد تغيير الحالة
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCustomerForStatus, setSelectedCustomerForStatus] = useState(null);

  // بدء التعديل
  const handleStartEdit = (customer) => {
    setEditingId(customer.id);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // حفظ التعديل
  const handleSaveEdit = (id) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setCustomers(customers.map((c) => (c.id === id ? { ...c, ...editFormData } : c)));
      setEditingId(null);
      setIsSubmitting(false);
    }, 400);
  };

  // حذف زبون
  const handleDelete = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  // فتح مودال التأكيد عند الضغط على زر تغيير الحالة (الحظر/النشاط)
  const handleOpenStatusConfirm = (customer) => {
    setSelectedCustomerForStatus(customer);
    setIsStatusModalOpen(true);
  };

  // تأكيد تغيير الحالة فعلياً
  const handleConfirmStatusChange = () => {
    if (!selectedCustomerForStatus) return;
    
    const id = selectedCustomerForStatus.id;
    setUpdatingId(id);

    setTimeout(() => {
      setCustomers(
        customers.map((c) => {
          if (c.id === id) {
            const newStatus = c.status === 'active' || c.status === 'نشط' ? 'banned' : 'active';
            return { ...c, status: newStatus };
          }
          return c;
        })
      );
      setUpdatingId(null);
      setIsStatusModalOpen(false);
      setSelectedCustomerForStatus(null);
    }, 400);
  };

  return (
    <div className="p-6 bg-brand-bg min-h-screen text-right" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-brand-title">إدارة الزبائن</h1>
          <p className="text-xs text-brand-body mt-1">عرض وتعديل بيانات حسابات الزبائن المسجلين</p>
        </div>
        <button className="bg-brand-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition">
          + إضافة زبون جديد
        </button>
      </div>

      {/* الجدول */}
      <CustomersTable
        customers={customers}
        editingId={editingId}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        updatingId={updatingId}
        isSubmitting={isSubmitting}
        onStartEdit={handleStartEdit}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onOpenStatusConfirm={handleOpenStatusConfirm}
        onDelete={handleDelete}
      />

      {/* نافذة (Modal) تأكيد تغيير الحالة */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <button 
                onClick={() => setIsStatusModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-2">تأكيد تغيير حالة الحساب</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              هل أنت متأكد من تغيير حالة الزبون <span className="font-bold text-gray-700">"{selectedCustomerForStatus?.name}"</span>؟ 
              {selectedCustomerForStatus?.status === 'active' ? ' سيتم حظر الحساب ومنعه من استخدام التطبيق.' : ' سيتم إعادة تفعيل الحساب.'}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className="flex-1 bg-amber-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-amber-700 transition cursor-pointer"
              >
                تأكيد التغيير
              </button>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}