import { useState, useEffect } from 'react';
import { Search, Trash2, ShieldAlert } from 'lucide-react';
import API from '../api/axios';

const formatReportDate = (value) => new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date(value)).replace(/-/g, '/');

const formatReportTime = (value) => new Intl.DateTimeFormat('ar-EG', {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value));

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingReportId, setDeletingReportId] = useState(null);

  // جلب بلاغات قاعدة البيانات
  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        const response = await API.get('/admin/reports');
        if (!Array.isArray(response.data)) {
          throw new Error('استجابة البلاغات ليست قائمة صالحة');
        }
        if (isMounted) setReports(response.data);
      } catch (error) {
        console.error('فشل في جلب البلاغات:', error);
        if (isMounted) setLoadError('تعذر جلب البلاغات من الخادم. تحقق من اتصال الخادم ثم أعد تحميل الصفحة.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReports();
    return () => {
      isMounted = false;
    };
  }, []);

  // دالة حذف/تجاهل البلاغ من قِبَل الأدمن
  const handleDeleteReport = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البلاغ وإزالته من القائمة؟')) {
      setDeletingReportId(id);
      setDeleteError('');
      try {
        await API.delete(`/admin/reports/${id}`);
        setReports((currentReports) => currentReports.filter((report) => report.id !== id));
      } catch (error) {
        console.error('فشل في حذف البلاغ:', error);
        setDeleteError('تعذر حذف البلاغ من قاعدة البيانات. لم يتم حذفه من القائمة.');
      } finally {
        setDeletingReportId(null);
      }
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

      {(loadError || deleteError) && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError || deleteError}
        </div>
      )}

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
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-brand-body/50">
                    جارٍ تحميل البلاغات...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-brand-body/50">
                    {loadError ? 'تعذر تحميل البلاغات.' : 'لا توجد بلاغات مسجلة حالياً.'}
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
                      <div className="font-bold text-brand-primary">
                        {report.createdAt ? formatReportDate(report.createdAt) : ''}
                      </div>
                      <div className="text-[11px] text-brand-body/60">
                        {report.createdAt ? formatReportTime(report.createdAt) : ''}
                      </div>
                    </td>

                    {/* إجراءات الأدمن */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        disabled={deletingReportId === report.id}
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
