import React, { useState, useEffect, useCallback } from 'react';
import CustomersTable from './customersTable';
import { AlertTriangle, X, UserPlus, Trash2, Loader2, Search } from 'lucide-react';
import API from '../../api/axios';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالات البحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // حالات التعديل المباشر
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '' });
  const [updatingId, setUpdatingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حالات النوافذ المنبثقة (Modals)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCustomerForStatus, setSelectedCustomerForStatus] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ name: '', email: '', phone: '' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomerForDelete, setSelectedCustomerForDelete] = useState(null);

  // جلب قائمة الزبائن من الباك-إند
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      // إرجاع الـ Endpoint الصحيح الخاص بالباك إند
      const response = await API.get('/admin/customers', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setCustomers(data);
      } else if (Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else if (Array.isArray(data.users)) {
        setCustomers(data.users);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error('فشل جلب الزبائن:', err);
      setError('حدث خطأ أثناء تحميل بيانات الزبائن');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // تصفية الزبائن بداخل الفرونت إند بناءً على البحث والفلتر
  const filteredCustomers = customers.filter((customer) => {
    const name = customer.name || customer.fullName || '';
    const email = customer.email || '';
    const phone = customer.phone || customer.phoneNumber || '';
    const isBanned = customer.status === 'banned' || customer.status === 'محظور' || customer.status === 'blocked';

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !isBanned) ||
      (statusFilter === 'blocked' && isBanned);

    return matchesSearch && matchesStatus;
  });

  // بدء التعديل
  const handleStartEdit = (customer) => {
    const custId = customer.id || customer._id;
    setEditingId(custId);
    setEditFormData({
      name: customer.name || customer.fullName || '',
      email: customer.email || '',
      phone: customer.phone || customer.phoneNumber || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // حفظ التعديل عبر الـ API
  const handleSaveEdit = async (id) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
      };

      await API.put(`/admin/customers/${id}`, payload);
      setEditingId(null);
      await fetchCustomers();
    } catch (err) {
      console.error('خطأ أثناء تعديل بيانات الزبون:', err);
      alert(err.response?.data?.message || 'حدث خطأ أثناء التعديل');
    } finally {
      setIsSubmitting(false);
    }
  };

  // فتح نافذة تأكيد الحذف
  const handleOpenDeleteConfirm = (customer) => {
  console.log("Customer object received:", customer); // للتأكد من هيكل البيانات في الـ Console
  setSelectedCustomerForDelete(customer);
  setIsDeleteModalOpen(true);
};

// حذف زبون
const handleConfirmDelete = async () => {
  const custId = selectedCustomerForDelete?.id;

  if (!custId) {
    alert("خطأ: المعرف غير موجود");
    return;
  }

  try {
    // 1. إرسال طلب الحذف للباك-إند
    await API.delete(`/admin/customers/${custId}`);

    // 2. إغلاق النافذة وتفريغ المتغير
    setIsDeleteModalOpen(false);
    setSelectedCustomerForDelete(null);

    // 3. جلب القائمة المحدثة للزبائن
    await fetchCustomers();
    
  } catch (err) {
    console.error("خطأ أثناء حذف الزبون:", err);
    
    // تجاهل خطأ 404 إذا كان السجل قد حُذف مسبقاً لكي لا يزعج المستخدم
    if (err.response?.status === 404) {
      setIsDeleteModalOpen(false);
      setSelectedCustomerForDelete(null);
      await fetchCustomers();
      return;
    }

    alert(
      err.response?.data?.message || 
      err.response?.data?.error || 
      "فشل حذف الزبون"
    );
  }
};


  // فتح نافذة التأكيد عند الضغط على تغيير الحالة
  const handleOpenStatusConfirm = (customer) => {
    setSelectedCustomerForStatus(customer);
    setIsStatusModalOpen(true);
  };

  // تأكيد تغيير الحالة عبر الـ API
  const handleConfirmStatusChange = async () => {
    if (!selectedCustomerForStatus) return;

    const custId = selectedCustomerForStatus.id || selectedCustomerForStatus._id;
    setUpdatingId(custId);

    try {
      const currentStatus = selectedCustomerForStatus.status;
      const isBanned = currentStatus === 'banned' || currentStatus === 'blocked' || currentStatus === 'محظور';
      const nextStatus = isBanned ? 'active' : 'banned';

      await API.patch(`/admin/customers/${custId}/status`, { status: nextStatus });

      setIsStatusModalOpen(false);
      setSelectedCustomerForStatus(null);
      await fetchCustomers();
    } catch (err) {
      console.error('فشل تغيير حالة الزبون:', err);
      alert(err.response?.data?.error || 'فشل تغيير حالة الحساب');
    } finally {
      setUpdatingId(null);
    }
  };

  // إضافة زبون جديد عبر الـ API
  const handleAddCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!newCustomerData.name.trim()) return;

    try {
      const payload = {
        name: newCustomerData.name,
        email: newCustomerData.email,
        phone: newCustomerData.phone,
      };

      await API.post('/admin/customers', payload);

      setNewCustomerData({ name: '', email: '', phone: '' });
      setIsAddModalOpen(false);
      await fetchCustomers();
    } catch (err) {
      console.error('خطأ أثناء إضافة الزبون:', err);
      alert(err.response?.data?.message || 'حدث خطأ أثناء إضافة الزبون');
    }
  };

  return (
    <div className="p-6 bg-brand-bg min-h-screen text-right" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-brand-title">إدارة الزبائن</h1>
          <p className="text-xs text-brand-body mt-1">عرض وتعديل بيانات حسابات الزبائن المسجلين</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
        >
          <span>+ إضافة زبون جديد</span>
        </button>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="ابحث باسم الزبون، البريد الإلكتروني، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-4 py-2 bg-white border border-brand-border rounded-xl text-brand-title placeholder-gray-400 focus:outline-none focus:border-brand-secondary text-xs shadow-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-brand-border rounded-xl px-4 py-2 text-brand-body focus:outline-none focus:border-brand-secondary text-xs shadow-xs"
        >
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="blocked">محظور</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-brand-body">
          <Loader2 className="animate-spin text-brand-secondary" size={24} />
          <span>جاري تحميل بيانات الزبائن...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-center text-xs">
          {error}
        </div>
      ) : (
        <CustomersTable
          customers={filteredCustomers}
          onToggleStatus={(customer) => {
            setSelectedCustomerForStatus(customer);
            setIsStatusModalOpen(true);
          }}
          editingId={editingId}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          updatingId={updatingId}
          isSubmitting={isSubmitting}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
          onOpenStatusConfirm={handleOpenStatusConfirm}
          onDelete={handleOpenDeleteConfirm}
        />
      )}

      {/* نافذة إضافة زبون جديد */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <UserPlus size={18} />
                </div>
                <h3 className="text-base font-bold text-gray-800">إضافة زبون جديد</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">اسم الزبون </label>
                <input
                  type="text"
                  required
                  placeholder="أدخل اسم الزبون الثلاثي"
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  placeholder="059xxxxxxx"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-primary text-white py-2 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  حفظ وإضافة
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <Trash2 size={20} />
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-2">تأكيد حذف الزبون</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف الزبون <span className="font-bold text-gray-700">"{selectedCustomerForDelete?.name}"</span> نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
              >
                نعم، احذف
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد تغيير الحالة */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-2">تأكيد تغيير حالة الحساب</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              هل أنت متأكد من تغيير حالة الزبون <span className="font-bold text-gray-700">"{selectedCustomerForStatus?.name}"</span>؟
              {selectedCustomerForStatus?.status === 'active' || selectedCustomerForStatus?.status === 'نشط'
                ? ' سيتم حظر الحساب ومنعه من استخدام التطبيق.'
                : ' سيتم إعادة تفعيل الحساب.'}
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
