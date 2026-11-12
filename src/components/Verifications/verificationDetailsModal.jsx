import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Phone, 
  Mail, 
  Calendar, 
  Hash, 
  Store, 
  User, 
  Loader2,
  AlertTriangle,
  ZoomIn
} from 'lucide-react';

export default function VerificationDetailsModal({ 
  verification, 
  onClose, 
  onAccept, 
  onReject,
  actionLoading = false 
}) {
  const [reviewNote, setReviewNote] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    setReviewNote('');
  }, [verification?.id, verification?.documentUrl]);

  if (!verification) return null;

  const isPending = verification.status === 'pending' || verification.status === 'pending_review';
  const isAccepted = verification.status === 'accepted' || verification.status === 'approved';
  const isRejected = verification.status === 'rejected';

  const isPdf = typeof verification.documentUrl === 'string' && verification.documentUrl.toLowerCase().endsWith('.pdf');

  const handleRejectClick = () => {
    if (!reviewNote.trim()) {
      const confirmWithoutReason = window.confirm(
        'لم تقم بكتابة سبب للرفض!\n\nهل أنت متأكد من رفض الطلب بدون كتابة سبب؟\nيُفضّل كتابة سبب الرفض ليتم إرساله في إشعار فوري للتاجر ليعلم سبب الرفض ويتمكن من تصحيح أوراقه.'
      );
      if (!confirmWithoutReason) return;
    }
    onReject(verification.id, reviewNote.trim());
  };

  const handleAcceptClick = () => {
    onAccept(verification.id, reviewNote.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 font-sans animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white w-full max-w-2xl max-h-[94vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* هيدر المودال */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gray-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-brand-secondary/10 text-brand-primary rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800">تفاصيل ومستندات طلب التوثيق</h3>
              <p className="text-[11px] text-gray-500">معاينة أوراق المتجر واعتماد التوثيق أو رفضه مع إشعار التاجر</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={actionLoading}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-xl transition cursor-pointer"
            title="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* محتوى المودال - قابل للتمرير */}
        <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {/* شريط حالة الطلب */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border bg-gray-50/70 border-gray-200/70">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-semibold text-xs">حالة الطلب:</span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  isPending
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : isAccepted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {isPending ? 'قيد المراجعة' : isAccepted ? 'تم التوثيق والموافقة' : 'مرفوض'}
              </span>
            </div>
            {verification.date && (
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Calendar size={13} className="text-gray-400" />
                <span>تاريخ التقديم: {verification.date}</span>
              </div>
            )}
          </div>

          {/* شبكة البيانات الأساسية للتاجر والمتجر */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="text-gray-400 block mb-1 flex items-center gap-1 font-medium">
                <Store size={13} />
                <span>اسم المتجر:</span>
              </span>
              <span className="font-bold text-gray-800 text-sm">{verification.storeName}</span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1 flex items-center gap-1 font-medium">
                <User size={13} />
                <span>صاحب المتجر:</span>
              </span>
              <span className="font-bold text-gray-800 text-sm">{verification.ownerName}</span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1 flex items-center gap-1 font-medium">
                <Phone size={13} />
                <span>رقم الهاتف:</span>
              </span>
              <span className="font-semibold text-gray-700 dir-ltr text-right inline-block">
                {verification.phone || 'غير متوفر'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1 flex items-center gap-1 font-medium">
                <Mail size={13} />
                <span>البريد الإلكتروني:</span>
              </span>
              <span className="font-semibold text-gray-700 truncate block">
                {verification.email || 'غير متوفر'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1 font-medium">نوع المستند:</span>
              <span className="font-semibold text-brand-primary bg-brand-primary/5 px-2.5 py-1 rounded-md inline-block">
                {verification.documentType}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1 flex items-center gap-1 font-medium">
                <Hash size={13} />
                <span>رقم السجل التجاري / المستند:</span>
              </span>
              <span className="font-semibold text-gray-700">
                {verification.documentNumber || 'غير متوفر'}
              </span>
            </div>
          </div>

          {/* قسم معاينة المستند المرفق */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-bold block text-xs">المستند المرفق:</span>
              {verification.documentUrl && (
                <a
                  href={verification.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-secondary hover:text-brand-primary font-bold text-[11px] transition"
                  title="فتح الرابط في نافذة جديدة"
                >
                  <ExternalLink size={13} />
                  <span>فتح المستند بحجم كامل</span>
                </a>
              )}
            </div>

            {verification.documentUrl ? (
              isPdf ? (
                <div className="border border-gray-200 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
                    <FileText size={36} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">مستند بصيغة PDF</p>
                    <p className="text-gray-400 text-xs mt-0.5">انقر على الزر أدناه لمعاينة أو تحميل ملف الـ PDF كاملاً</p>
                  </div>
                  <a
                    href={verification.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-brand-primary-hover transition"
                  >
                    <ExternalLink size={14} />
                    <span>عرض ملف الـ PDF</span>
                  </a>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 min-h-48 max-h-80 flex items-center justify-center relative">
                  {/* مؤشر التحميل أثناء جلب الصورة */}
                  {!imgLoaded && !imgError && (
                    <div className="flex flex-col items-center justify-center p-8 text-gray-400 space-y-2">
                      <Loader2 size={24} className="animate-spin text-brand-primary" />
                      <span>جاري تحميل المستند...</span>
                    </div>
                  )}

                  {/* عنصر الصورة */}
                  <img 
                    src={verification.documentUrl} 
                    alt="المستند المرفق للتوثيق" 
                    className={`w-full max-h-80 object-contain rounded-xl transition duration-200 ${
                      imgLoaded && !imgError ? 'block' : 'hidden'
                    }`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => {
                      setImgError(true);
                      setImgLoaded(true);
                    }}
                  />

                  {/* واجهة البديل عند تعذر تحميل الصورة */}
                  {imgError && (
                    <div className="flex flex-col items-center justify-center p-6 text-gray-500 text-center space-y-2.5">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <AlertTriangle size={28} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-gray-700">تعذر عرض الصورة مباشرة</p>
                        <p className="text-[11px] text-gray-400 max-w-sm">
                          قد يكون رابط المستند تجريبياً أو غير متاح حالياً. يمكنك تجربة فتحه عبر الرابط المباشر أدناه:
                        </p>
                      </div>
                      <a
                        href={verification.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 text-brand-primary hover:bg-gray-50 rounded-xl font-bold text-xs shadow-2xs transition"
                      >
                        <ExternalLink size={13} />
                        <span>فتح الرابط المباشر للمستند</span>
                      </a>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl text-gray-400">
                لم يتم إرفاق مستند مع هذا الطلب
              </div>
            )}
          </div>

          {/* ملاحظات التاجر المرفقة بالطلب */}
          {verification.notes && (
            <div>
              <span className="text-gray-500 font-bold block mb-1">ملاحظات التاجر المرفقة بالطلب:</span>
              <p className="p-3 bg-amber-50/80 border border-amber-200/60 text-amber-900 rounded-xl leading-relaxed">
                {verification.notes}
              </p>
            </div>
          )}

          {/* حقل سبب الرفض / ملاحظات المراجعة */}
          {isPending && (
            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
              <label className="text-gray-700 font-bold block text-xs flex items-center justify-between">
                <span>سبب الرفض وملاحظات الإدارة:</span>
                <span className="text-[10px] text-brand-secondary font-bold">
                  🔔 سيتم إرسالها كإشعار فوري للتاجر
                </span>
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="اكتب سبب الرفض أو ملاحظاتك هنا ليتم إرسالها في إشعار للتاجر (مثال: صورة الهوية غير واضحة، السجل التجاري منتهي الصلاحية، يرجى إعادة الإرفاق...)"
                rows={3}
                disabled={actionLoading}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-primary transition resize-none leading-relaxed"
              />
              <p className="text-[10px] text-gray-500">
                💡 عند الضغط على "رفض الطلب"، سيتم إنشاء إشعار تنبيهي فوري للتاجر يحتوي على هذا السبب ليعرف المطلوب منه.
              </p>
            </div>
          )}
        </div>

        {/* أزرار الإجراءات داخل المودال */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50/70 shrink-0">
          <button
            onClick={onClose}
            disabled={actionLoading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition cursor-pointer disabled:opacity-50"
          >
            إغلاق
          </button>

          {isPending && (
            <>
              <button
                onClick={handleRejectClick}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold transition cursor-pointer disabled:opacity-50"
                title="رفض الطلب مع إرسال سبب الرفض كإشعار للتاجر"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                <span>رفض الطلب</span>
              </button>

              <button
                onClick={handleAcceptClick}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition cursor-pointer shadow-sm disabled:opacity-50"
                title="قبول وتوثيق الحساب وإشعار التاجر"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                <span>قبول وتوثيق</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
