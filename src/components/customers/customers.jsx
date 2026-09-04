import React, { useState, useEffect } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import CustomersTable from './customersTable';
import API from '../../api/axios'; // عدلي المسار بحسب موقع مجلد api لديك

// بيانات وهمية افتراضية لعرضها في الجدول
const defaultCustomers = [
  { id: 1, name: 'أحمد محمود', email: 'ahmed@example.com', phone: '0599123456', status: 'active' },
  { id: 2, name: 'سارة علي', email: 'sara@example.com', phone: '0598765432', status: 'active' },
  { id: 3, name: 'محمد خالد', email: 'mohamed@example.com', phone: '0597112233', status: 'banned' },
];

export default function Customers() {
  const [customers, setCustomers] = useState(defaultCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // جلب البيانات من الباك إند
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get('/admin/customers');
        if (response.data && response.data.length > 0) {
          setCustomers(response.data);
        }
      } catch (err) {
        console.log('استخدام البيانات الافتراضية للزبائن');
      }
    };
    fetchCustomers();
  }, []);

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    const newCustomer = {
      id: Date.now(),
      ...formData,
      status: 'active',
    };

    setCustomers([newCustomer, ...customers]);
    setFormData({ name: '', email: '', phone: '' });
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    setCustomers(
      customers.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'banned' : 'active' } : c
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الزبون؟')) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const name = c.name || c.fullName || '';
    const email = c.email || '';
    const phone = c.phone || c.phoneNumber || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* العنوان وزر الإضافة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#8E5439]">إدارة الزبائن</h1>
          <p className="text-xs text-gray-500 mt-1">عرض وتعديل بيانات حسابات الزبائن المسجلين</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8E5439] hover:bg-[#72412B] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <UserPlus size={16} />
          <span>إضافة زبون جديد</span>
        </button>
      </div>

      {/* البحث */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="بحث بالاسم، البريد، أو الرقم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 bg-white border border-[#EFECE6] rounded-xl text-xs text-gray-700 focus:outline-none focus:border-[#8E5439] transition"
        />
        <Search size={16} className="absolute right-3.5 top-3 text-gray-400" />
      </div>

      {/* مكون الجدول */}
      <CustomersTable 
        customers={filteredCustomers} 
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Modal إضافة زبون */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-[#2D1B13]">إضافة زبون جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اسم الزبون</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خالد محمد"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#8E5439]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#8E5439]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  required
                  placeholder="059XXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#8E5439]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#8E5439] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#72412B] transition"
                >
                  حفظ الزبون
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 bg-gray-100 text-gray-600 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}