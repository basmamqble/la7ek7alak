import React, { useState, useEffect, useCallback, useMemo } from 'react';
import VerificationTable from './verificationTable';
import VerificationDetailsModal from './verificationDetailsModal';
import { ShieldCheck, Search, Filter, RotateCw, AlertCircle } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const DOCUMENT_TYPES_MAP = {
  national_id: 'بطاقة شخصية / هوية مالك المتجر',
  commercial_registration: 'سجل تجاري رسمي',
  store_license: 'رخصة تجارية وسجل مهني',
  tax_certificate: 'شهادة ضريبية',
  other: 'مستند إضافي'
};


const formatVerificationItem = (item) => {
  const storeName = item.merchant?.storeName || item.storeName || 'متجر غير معروف';
  const ownerName = item.merchant?.user?.name || item.ownerName || 'غير محدد';
  const phone = item.merchant?.user?.phone || item.phone || 'غير متوفر';
  const email = item.merchant?.user?.email || item.email || 'غير متوفر';
  const documentNumber = item.merchant?.commercialNo || item.documentNumber || 'غير متوفر';

  const rawStatus = item.status || 'pending_review';
  const normalizedStatus = (rawStatus === 'approved' || rawStatus === 'accepted')
    ? 'accepted'
    : (rawStatus === 'rejected')
    ? 'rejected'
    : 'pending';

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : item.date || '-';

  const documentTypeDisplay = DOCUMENT_TYPES_MAP[item.documentType] || item.documentType || 'وثيقة رسمية';

  let docUrl = item.documentUrl || '';
  if (docUrl && !docUrl.startsWith('http://') && !docUrl.startsWith('https://')) {
    const base = 'http://localhost:5000';
    docUrl = `${base}${docUrl.startsWith('/') ? '' : '/'}${docUrl}`;
  }

  return {
    ...item,
    storeName,
    ownerName,
    phone,
    email,
    documentNumber,
    status: normalizedStatus,
    rawStatus,
    date: formattedDate,
    documentType: documentTypeDisplay,
    rawDocumentType: item.documentType,
    documentUrl: docUrl,
    notes: item.reviewNote || item.notes || ''
  };
};

export default function Verifications() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | accepted | rejected
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // جلب كافة طلبات التوثيق من الخادم
  const fetchVerifications = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get('/admin/merchant-verification-requests');
      const data = response.data;

      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.items)) {
        list = data.items;
      } else if (Array.isArray(data?.requests)) {
        list = data.requests;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      }

      const formattedList = list.map(formatVerificationItem);
      setVerifications(formattedList);

      if (showToast) {
        toast.success('تم تحديث قائمة طلبات التوثيق بنجاح');
      }
    } catch (err) {
      console.error('فشل جلب طلبات التوثيق من السيرفر:', err);
      const msg = err.response?.data?.error || 'تعذر الاتصال بالخادم لجلب طلبات التوثيق';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  // فتح نافذة المعاينة والتفاصيل
  const handleViewDetails = (item) => {
    setSelectedVerification(item);
    setIsModalOpen(true);
  };

  // قبول وتوثيق الطلب في الباك-إند
  const handleAccept = async (id, reviewNote = '') => {
    try {
      setActionLoadingId(id);
      await API.patch(`/admin/merchant-verification-requests/${id}/review`, {
        status: 'approved',
        reviewNote: reviewNote || 'تمت الموافقة على توثيق الحساب'
      });

      toast.success('تم قبول طلب التوثيق وتفعيل شارة التوثيق بنجاح');

      setVerifications(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: 'accepted', rawStatus: 'approved', reviewNote: reviewNote || item.notes }
            : item
        )
      );

      if (selectedVerification?.id === id) {
        setSelectedVerification(prev =>
          prev ? { ...prev, status: 'accepted', rawStatus: 'approved' } : null
        );
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('فشل قبول طلب التوثيق:', err);
      toast.error(err.response?.data?.error || 'تعذر اعتماد توثيق الحساب');
    } finally {
      setActionLoadingId(null);
    }
  };

  // رفض طلب التوثيق في الباك-إند
  const handleReject = async (id, reviewNote = '') => {
    try {
      setActionLoadingId(id);
      await API.patch(`/admin/merchant-verification-requests/${id}/review`, {
        status: 'rejected',
        reviewNote: reviewNote || 'تم رفض طلب التوثيق، يرجى مراجعة البيانات وإعادة التقديم'
      });

      toast.success('تم رفض طلب التوثيق بنجاح وإرسال إشعار للتاجر');

      setVerifications(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: 'rejected', rawStatus: 'rejected', reviewNote: reviewNote || item.notes }
            : item
        )
      );

      if (selectedVerification?.id === id) {
        setSelectedVerification(prev =>
          prev ? { ...prev, status: 'rejected', rawStatus: 'rejected' } : null
        );
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('فشل رفض طلب التوثيق:', err);
      toast.error(err.response?.data?.error || 'تعذر رفض طلب التوثيق');
    } finally {
      setActionLoadingId(null);
    }
  };

  // إحصائيات سريعة للطلبات
  const counts = useMemo(() => {
    const total = verifications.length;
    const pending = verifications.filter(v => v.status === 'pending').length;
    const accepted = verifications.filter(v => v.status === 'accepted').length;
    const rejected = verifications.filter(v => v.status === 'rejected').length;
    return { total, pending, accepted, rejected };
  }, [verifications]);

  // تصفية الطلبات حسب البحث والحالة
  const filteredVerifications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return verifications.filter(item => {
      const matchesSearch =
        !term ||
        item.storeName.toLowerCase().includes(term) ||
        item.ownerName.toLowerCase().includes(term) ||
        (item.phone && item.phone.toLowerCase().includes(term)) ||
        (item.email && item.email.toLowerCase().includes(term)) ||
        (item.documentNumber && item.documentNumber.toLowerCase().includes(term));

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [verifications, searchTerm, statusFilter]);

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 text-right font-sans" dir="rtl">
      {/* هيدر الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-brand-secondary/10 text-brand-primary rounded-xl shrink-0">
            <ShieldCheck size={24} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-gray-800 leading-tight">إدارة طلبات توثيق الحسابات</h1>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">مراجعة أوراق المتاجر وتوثيق الحسابات بالعلامة الزرقاء من قاعدة البيانات</p>
          </div>
        </div>

        <button
          onClick={() => fetchVerifications(true)}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
          title="تحديث البيانات من السيرفر"
        >
          <RotateCw size={15} className={loading ? 'animate-spin text-brand-primary' : ''} />
          <span>تحديث الطلبات</span>
        </button>
      </div>

      {/* رسالة الخطأ إن وجدت */}
      {error && (
        <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchVerifications(true)}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* أدوات البحث والفلترة */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* حقل البحث */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم المتجر، المالك، أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-primary transition"
          />
        </div>

        {/* أزرار التصفية والفلترة */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter size={16} className="text-gray-400 shrink-0 hidden sm:block" />
          
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
              statusFilter === 'all' ? 'bg-brand-secondary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            الكل ({counts.total})
          </button>
          
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
              statusFilter === 'pending' ? 'bg-brand-secondary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            قيد المراجعة ({counts.pending})
          </button>
          
          <button
            onClick={() => setStatusFilter('accepted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
              statusFilter === 'accepted' ? 'bg-brand-secondary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            الموثقة ({counts.accepted})
          </button>

          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
              statusFilter === 'rejected' ? 'bg-brand-secondary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            المرفوضة ({counts.rejected})
          </button>
        </div>
      </div>

      {/* جدول عرض الطلبات متجاوب مع الشاشات الصغيرة */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="min-w-[650px] sm:min-w-full">
          <VerificationTable
            requests={filteredVerifications}
            loading={loading}
            onViewDetails={handleViewDetails}
            onAccept={handleAccept}
            onReject={handleReject}
            actionLoadingId={actionLoadingId}
          />
        </div>
      </div>

      {/* نافذة التفاصيل والمودال */}
      {isModalOpen && selectedVerification && (
        <VerificationDetailsModal
          key={selectedVerification.id}
          verification={selectedVerification}
          onClose={() => setIsModalOpen(false)}
          onAccept={handleAccept}
          onReject={handleReject}
          actionLoading={actionLoadingId === selectedVerification.id}
        />
      )}
    </div>
  );
}
