import React, { useState } from 'react';
import VerificationTable from './verificationTable';
import VerificationDetailsModal from './verificationDetailsModal';
import { ShieldCheck, Search, Filter } from 'lucide-react';

export default function Verifications() {
  // داتا وهمية مطابقة للمتطلبات والخصائص (date و accepted)
  const [verifications, setVerifications] = useState([
    {
      id: 1,
      storeName: 'مطعم وفتة الشامي',
      ownerName: 'أحمد الشامي',
      phone: '0591234567',
      email: 'shami@store.com',
      status: 'pending',
      date: '2026-09-20',
      documentType: 'رخصة تجارية وسجل هُوية',
      documentNumber: '987654321',
      documentUrl: 'https://via.placeholder.com/600x400?text=Store+License+Document',
      notes: 'يرجى توثيق الحساب بسرعة لعرض عروض العيد.'
    },
    {
      id: 2,
      storeName: 'بووتيك ريم للأزياء',
      ownerName: 'ريم خالد',
      phone: '0569876543',
      email: 'reem@boutique.com',
      status: 'pending',
      date: '2026-09-21',
      documentType: 'بطاقة شخصية / هوية مالك المتجر',
      documentNumber: '402112233',
      documentUrl: 'https://via.placeholder.com/600x400?text=ID+Card+Document',
      notes: 'سجل تجاري رسمي مرفق مع الطلب.'
    },
    {
      id: 3,
      storeName: 'مكتبة العلم والمعرفة',
      ownerName: 'محمد رائد',
      phone: '0598112233',
      email: 'knowledge@lib.com',
      status: 'accepted',
      date: '2026-09-18',
      documentType: 'ترخيص مهن رسمي',
      documentNumber: '554433221',
      documentUrl: 'https://via.placeholder.com/600x400?text=Professional+License',
      notes: 'تم التحقق من الأوراق الثبوتية بنجاح.'
    }
  ]);

  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // فتح نافذة المعاينة والتفاصيل
  const handleViewDetails = (item) => {
    setSelectedVerification(item);
    setIsModalOpen(true);
  };

  // الموافقة على الطلب محلياً
  const handleAccept = (id) => {
    setVerifications(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'accepted' } : item))
    );
    setIsModalOpen(false);
  };

  // رفض الطلب محلياً
  const handleReject = (id) => {
    setVerifications(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    setIsModalOpen(false);
  };

  // تصفية الطلبات حسب البحث والحالة
  const filteredVerifications = verifications.filter(item => {
    const matchesSearch = item.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-right font-sans" dir="rtl">
      {/* هيدر الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-secondary/10 text-brand-primary rounded-xl">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">إدارة طلبات توثيق الحسابات</h1>
            <p className="text-xs text-gray-500 mt-0.5">مراجعة أوراق المتاجر وتوثيق الحسابات بالعلامة الزرقاء</p>
          </div>
        </div>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم المتجر أو المالك..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-primary transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all' ? 'bg-brand-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            الكل ({verifications.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'pending' ? 'bg-brand-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            قيد المراجعة
          </button>
          <button
            onClick={() => setStatusFilter('accepted')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'accepted' ? 'bg-brand-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            الموثقة
          </button>
        </div>
      </div>

      {/* جدول عرض الطلبات (المكون المنفصل) */}
      <VerificationTable
        requests={filteredVerifications}
        onViewDetails={handleViewDetails}
        onAccept={handleAccept}
        onReject={handleReject}
      />

      {/* نافذة التفاصيل والمودال */}
      {isModalOpen && selectedVerification && (
        <VerificationDetailsModal
          verification={selectedVerification}
          onClose={() => setIsModalOpen(false)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
}