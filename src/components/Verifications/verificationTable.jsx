import React from 'react';
import { Eye, Check, X, Store, User, Calendar, Loader2, ShieldAlert } from 'lucide-react';

export default function VerificationTable({ 
  requests, 
  loading = false, 
  onViewDetails, 
  onAccept, 
  onReject,
  actionLoadingId = null 
}) {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 size={32} className="text-brand-secondary animate-spin" />
          <p className="text-xs text-gray-500 font-medium">جاري تحميل طلبات التوثيق من الخادم...</p>
        </div>
      </div>
    );
  }

  const handleQuickAccept = (req) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في قبول وتوثيق متجر "${req.storeName}"؟\nسيتم منح المتجر شارة التوثيق وإرسال إشعار للمالك.`)) {
      onAccept(req.id);
    }
  };

  const handleQuickReject = (req) => {
    // فتح نافذة المعاينة والتفاصيل لتمكين الأدمن من كتابة سبب الرفض قبل إرسال الإشعار
    onViewDetails(req);
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
      {/* ----------------- 1. عرض البطاقات للشاشات الصغيرة (Mobile Cards View) ----------------- */}
      <div className="block sm:hidden divide-y divide-gray-100">
        {requests && requests.length > 0 ? (
          requests.map((req) => {
            const isProcessing = actionLoadingId === req.id;
            const isPending = req.status === 'pending' || req.status === 'pending_review';
            const isAccepted = req.status === 'accepted' || req.status === 'approved';

            return (
              <div key={req.id} className="p-4 space-y-3 hover:bg-gray-50/50 transition">
                {/* هيدر البطاقة: اسم المتجر والحالة */}
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                    <span>{req.storeName}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                      isPending
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : isAccepted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}
                  >
                    {isPending ? 'قيد المراجعة' : isAccepted ? 'موثق' : 'مرفوض'}
                  </span>
                </div>

                {/* تفاصيل صاحب المتجر والتاريخ ونوع الوثيقة */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50/80 p-2.5 rounded-xl">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">صاحب المتجر</span>
                    <span className="font-semibold text-gray-700 truncate block">{req.ownerName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">تاريخ الطلب</span>
                    <span className="font-semibold text-gray-700">{req.date}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-gray-100">
                    <span className="block text-[10px] text-gray-400 font-medium">نوع الوثيقة</span>
                    <span className="font-semibold text-brand-primary">{req.documentType}</span>
                  </div>
                </div>

                {/* الأزرار والإجراءات */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onViewDetails(req)}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
                  >
                    <Eye size={15} />
                    <span>معاينة التفاصيل</span>
                  </button>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickAccept(req)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
                        title="قبول الطلب وتوثيق الحساب"
                      >
                        {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
                        <span>قبول</span>
                      </button>
                      <button
                        onClick={() => handleQuickReject(req)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
                        title="مراجعة ورفض الطلب مع كتابة السبب"
                      >
                        {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <X size={15} />}
                        <span>رفض</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-4 py-12 text-center text-xs text-gray-400 font-medium space-y-2">
            <ShieldAlert size={28} className="mx-auto text-gray-300" />
            <p>لا توجد طلبات توثيق مطابقة للشروط حالياً</p>
          </div>
        )}
      </div>

      {/* ----------------- 2. عرض الجدول التقليدي للشاشات المتوسطة والكبيرة (Desktop Table View) ----------------- */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[700px] divide-y divide-gray-100 text-right font-sans" dir="rtl">
          <thead className="bg-gray-50/70">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">اسم المتجر</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">صاحب المتجر</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">نوع الوثيقة</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">تاريخ الطلب</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">الحالة</th>
              <th className="px-5 py-3.5 text-center text-xs font-bold text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {requests && requests.length > 0 ? (
              requests.map((req) => {
                const isProcessing = actionLoadingId === req.id;
                const isPending = req.status === 'pending' || req.status === 'pending_review';
                const isAccepted = req.status === 'accepted' || req.status === 'approved';

                return (
                  <tr key={req.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-bold text-gray-800">
                      {req.storeName}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                      <div>{req.ownerName}</div>
                      {req.phone && req.phone !== 'غير متوفر' && (
                        <div className="text-[10px] text-gray-400 mt-0.5">{req.phone}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium">
                        {req.documentType}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                      {req.date}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-[11px] font-semibold rounded-full ${
                          isPending
                            ? 'bg-amber-50 text-amber-700'
                            : isAccepted
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isPending ? 'قيد المراجعة' : isAccepted ? 'موثق' : 'مرفوض'}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* زر المعاينة */}
                        <button
                          onClick={() => onViewDetails(req)}
                          disabled={isProcessing}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition cursor-pointer disabled:opacity-50"
                          title="معاينة المستندات والتفاصيل"
                        >
                          <Eye size={16} />
                        </button>

                        {/* أزرار القبول والرفض السريعة */}
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleQuickAccept(req)}
                              disabled={isProcessing}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition cursor-pointer disabled:opacity-50"
                              title="قبول الطلب وتوثيق الحساب"
                            >
                              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            </button>
                            <button
                              onClick={() => handleQuickReject(req)}
                              disabled={isProcessing}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer disabled:opacity-50"
                              title="رفض الطلب وكتابة السبب لإشعار التاجر"
                            >
                              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-14 text-center text-xs text-gray-400 font-medium">
                  <ShieldAlert size={32} className="mx-auto text-gray-300 mb-2" />
                  <span>لا توجد طلبات توثيق حالياً</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
