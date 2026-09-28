import React, { useState, useEffect, useCallback } from 'react';
import CustomersTable from './customersTable';
import { AlertTriangle, X, UserPlus, Trash2, Loader2, Search, Key, Eye, EyeOff } from 'lucide-react';
import API from '../../api/axios';

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '' });
  const [updatingId, setUpdatingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCustomerForStatus, setSelectedCustomerForStatus] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomerForDelete, setSelectedCustomerForDelete] = useState(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

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

  const handleOpenDeleteConfirm = (customer) => {
    setSelectedCustomerForDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const custId = selectedCustomerForDelete?.id || selectedCustomerForDelete?._id;

    if (!custId) {
      alert("خطأ: المعرف غير موجود");
      return;
    }

    try {
      await API.delete(`/admin/customers/${custId}`);
      setIsDeleteModalOpen(false);
      setSelectedCustomerForDelete(null);
      await fetchCustomers();
    } catch (err) {
      console.error("خطأ أثناء حذف الزبون:", err);
      if (err.response?.status === 404) {
        setIsDeleteModalOpen(false);
        setSelectedCustomerForDelete(null);
        await fetchCustomers();
        return;
      }
      alert(err.response?.data?.message || err.response?.data?.error || "فشل حذف الزبون");
    }
  };

  const handleOpenStatusConfirm = (customer) => {
    setSelectedCustomerForStatus(customer);
    setIsStatusModalOpen(true);
  };

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

  const handleAddCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!newCustomerData.name.trim()) return;

    try {
      const payload = {
        name: newCustomerData.name,
        email: newCustomerData.email,
        phone: newCustomerData.phone,
        password: newCustomerData.password,
      };

      await API.post('/admin/customers', payload);

      setNewCustomerData({ name: '', email: '', phone: '', password: '' });
      setIsAddModalOpen(false);
      await fetchCustomers();
    } catch (err) {
      console.error('خطأ أثناء إضافة الزبون:', err);
      alert(err.response?.data?.message || 'حدث خطأ أثناء إضافة الزبون');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-brand-bg min-h-screen text-right max-w-full overflow-x-hidden" dir="rtl">
      {/* رأس الصفحة - متجاوب مع مختلف الشاشات */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-title">إدارة الزبائن</h1>
          <p className="text-xs text-brand-body mt-1">عرض وتعديل بيانات حسابات الزبائن المسجلين</p>
        </div>
        <button
          onClick={() => {
            setNewCustomerData({ name: '', email: '', phone: '', password: generateRandomPassword() });
            setIsAddModalOpen(true);
          }}
          className="w-full sm:w-auto bg-brand-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
        >
          <UserPlus size={16} />
          <span>+ إضافة زبون جديد</span>
        </button>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="ابحث باسم الزبون، البريد الإلكتروني، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 bg-white border border-brand-border rounded-xl text-brand-title placeholder-gray-400 focus:outline-none focus:border-brand-secondary text-xs shadow-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto bg-white border border-brand-border rounded-xl px-4 py-2.5 text-brand-body focus:outline-none focus:border-brand-secondary text-xs shadow-xs cursor-pointer"
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
        <div className="w-full overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-xs">
          <CustomersTable
            customers={filteredCustomers}
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
        </div>
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
                <label className="block text-xs font-bold text-gray-700 mb-1">اسم الزبون</label>
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
                <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  placeholder="059xxxxxxx"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* حقل كلمة المرور المطلوب مطابق للصورة تماماً */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-800">كلمة المرور المبدئية</label>
                  <button
                    type="button"
                    onClick={() => setNewCustomerData({ ...newCustomerData, password: generateRandomPassword() })}
                    className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Key size={13} className="rotate-90" />
                    <span>توليد تلقائي</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="انقر توليد أو اكتبها يدوياً"
                    value={newCustomerData.password || ''}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, password: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 text-xs border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-primary placeholder-gray-400 bg-gray-50/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-primary text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  حفظ وإضافة
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد تغيير الحالة */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-2">تغيير حالة الحساب</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              هل أنت تأكد من رغبتك في تغيير حالة الزبون{' '}
              <span className="font-bold text-gray-800">
                "{selectedCustomerForStatus?.name || selectedCustomerForStatus?.fullName}"
              </span>
              ؟
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleConfirmStatusChange}
                disabled={updatingId === (selectedCustomerForStatus?.id || selectedCustomerForStatus?._id)}
                className="flex-1 bg-brand-primary text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {updatingId === (selectedCustomerForStatus?.id || selectedCustomerForStatus?._id) ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'تأكيد'
                )}
              </button>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-2">حذف حساب الزبون</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              هل أنت متأكد من حذف حساب الزبون{' '}
              <span className="font-bold text-gray-800">
                "{selectedCustomerForDelete?.name || selectedCustomerForDelete?.fullName}"
              </span>
              ؟ لا يمكنك التراجع عن هذا الإجراء.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
              >
                حذف نهائياً
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
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
