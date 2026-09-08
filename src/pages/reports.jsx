import React, { useState, useEffect } from 'react';
import { Search, Trash2, ShieldAlert } from 'lucide-react';
import API from '../api/axios';

// بيانات بلاغات وهمية افتراضية مطابقة للصورة
const defaultReports = [
  {
    id: 1,
    reporterName: 'محمد الشريف',
    reporterPhone: '+970 599 123 456',
    storeName: 'بيتزا البرنس',
    storeLocation: 'الوسطى - النصيرات',
    storyTitle: 'خصم 30% على الوجبات العائلية',
    reason: 'السعر غير مطابق',
    date: '2026/08/27',
    time: '10:30 صباحاً',
  },
  {
    id: 2,
    reporterName: 'آية مصطفى',
    reporterPhone: '+970 598 654 321',
    storeName: 'مطعم الشلال',
    storeLocation: 'غزة - الرمال',
    storyTitle: 'وجبة سوبر كومبو + مشروب',
    reason: 'محتوى / صورة غير مريحة',
    date: '2026/08/26',
    time: '04:15 مساءً',
  },
  {
    id: 3,
    reporterName: 'خالد ناصر',
    reporterPhone: '+970 597 111 999',
    storeName: 'متجر الأناقة',
    storeLocation: 'خان يونس - البلد',
    storyTitle: 'تخفيضات 50% على تشكيلة الصيف',
    reason: 'عرض وهمي / منتهي',
    date: '2026/08/25',
    time: '09:00 مساءً',
  },
];

export default function Reports() {
  const [reports, setReports] = useState(defaultReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState('ALL');

  // جلب البلاغات من السيرفر عند التوفر
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await API.get('/admin/reports');
        if (response.data && response.data.length > 0) {
          setReports(response.data);
        }
      } catch (err) {
        console.log('استخدام بيانات البلاغات الافتراضية');
      }
    };
    fetchReports();
  }, []);

  // دالة حذف/تجاهل البلاغ من قِبَل الأدمن
  const handleDeleteReport = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البلاغ وإزالته من القائمة؟')) {
      try {
        await API.delete(`/admin/reports/${id}`);
      } catch (err) {
        console.log('حذف محلي للبلاغ');
      }
      setReports(reports.filter((report) => report.id !== id));
    }
  };

  // تجميع أسباب البلاغات المتاحة ديناميكياً للفلترة
  const reasonsList = Array.from(new Set(reports.map((r) => r.reason).filter(Boolean)));

  // الفلترة والبحث
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.storyTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesReason = selectedReason === 'ALL' || report.reason === selectedReason;

    return matchesSearch && matchesReason;
  });

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* الهيدر العلوي */}
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">
          عرض قائمة البلاغات (Reports List)
        </h1>
        <p className="text-xs text-brand-body/70 mt-1">
          مراجعة البلاغات والشكاوى الواردة من الزبائن حول العروض والـ Stories
        </p>
      </div>

      {/* شريط الفلترة وإجمالي البلاغات */}
      <div className="bg-brand-card p-4 rounded-2xl border border-brand-border flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* حقل البحث */}
          <div className="relative flex-1 min-w-[220px]">
            <input
              type="text"
              placeholder="ابحث باسم الزبون أو المتجر المبلغ عنه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary placeholder:text-brand-body/40 focus:outline-none focus:border-brand-primary transition"
            />
            <Search size={15} className="absolute right-3.5 top-2.5 text-brand-body/40" />
          </div>

          {/* فلتر سبب البلاغ */}
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-body focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="ALL">سبب البلاغ: الكل</option>
            {reasonsList.map((reason, idx) => (
              <option key={idx} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* إجمالي البلاغات الواردة */}
        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
          <ShieldAlert size={15} />
          <span>إجمالي البلاغات الواردة: {filteredReports.length}</span>
        </div>
      </div>

      {/* جدول عرض البلاغات */}
      <div className="bg-brand-card rounded-2xl border border-brand-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-brand-bg text-brand-primary font-bold border-b border-brand-border">
                <th className="p-4">الزبون (الـمُبَلِّغ)</th>
                <th className="p-4">المتجر (الـمُشْتَكَى عليه)</th>
                <th className="p-4">عنوان الـ Story</th>
                <th className="p-4">سبب البلاغ</th>
                <th className="p-4">تاريخ ووقت البلاغ</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-brand-body/50">
                    لا توجد بلاغات مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-brand-bg/50 transition">
                    {/* بيانات الزبون */}
                    <td className="p-4">
                      <div className="font-bold text-brand-primary">{report.reporterName}</div>
                      <div className="text-[11px] text-brand-body/60 dir-ltr text-right">
                        {report.reporterPhone}
                      </div>
                    </td>

                    {/* بيانات المتجر */}
                    <td className="p-4">
                      <div className="font-bold text-brand-secondary">{report.storeName}</div>
                      <div className="text-[11px] text-brand-body/60">{report.storeLocation}</div>
                    </td>

                    {/* عنوان العرض */}
                    <td className="p-4 font-semibold text-brand-body">{report.storyTitle}</td>

                    {/* سبب البلاغ */}
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[11px] font-bold">
                        {report.reason}
                      </span>
                    </td>

                    {/* التاريخ والوقت */}
                    <td className="p-4">
                      <div className="font-bold text-brand-primary">{report.date}</div>
                      <div className="text-[11px] text-brand-body/60">{report.time}</div>
                    </td>

                    {/* إجراءات الأدمن */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-100 cursor-pointer"
                        title="حذف البلاغ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}