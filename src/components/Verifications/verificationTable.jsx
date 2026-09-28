import React from 'react';
import { Eye, Check, X, Store, User, Calendar } from 'lucide-react';
export default function VerificationTable({ requests, onViewDetails, onAccept, onReject }) {
  return (
    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
      {/* ----------------- 1. عرض البطاقات للشاشات الصغيرة (Mobile Cards View) ----------------- */}
      <div className="block sm:hidden divide-y divide-gray-100">
        {requests && requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} className="p-4 space-y-3 hover:bg-gray-50/50 transition">
              {/* هيدر البطاقة: اسم المتجر والحالة */}
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  <span>{req.storeName}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                    req.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : req.status === 'accepted'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}
                >
                  {req.status === 'pending' ? 'قيد المراجعة' : req.status === 'accepted' ? 'موثق' : 'مرفوض'}
                </span>
              </div>

              {/* تفاصيل صاحب المتجر والتاريخ */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50/80 p-2.5 rounded-xl">
                <div>
                  <span className="block text-[10px] text-gray-400 font-medium">صاحب المتجر</span>
                  <span className="font-semibold text-gray-700">{req.ownerName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-medium">تاريخ الطلب</span>
                  <span className="font-semibold text-gray-700">{req.date}</span>
                </div>
              </div>

              {/* الأزرار والإجراءات */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onViewDetails(req)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <Eye size={15} />
                  <span>معاينة التفاصيل</span>
                </button>

                {req.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAccept(req.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-xl transition cursor-pointer"
                      title="قبول الطلب"
                    >
                      <Check size={15} />
                      <span>قبول</span>
                    </button>
                    <button
                      onClick={() => onReject(req.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition cursor-pointer"
                      title="رفض الطلب"
                    >
                      <X size={15} />
                      <span>رفض</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-10 text-center text-xs text-gray-400 font-medium">
            لا توجد طلبات توثيق حالياً
          </div>
        )}
      </div>

      {/* ----------------- 2. عرض الجدول التقليدي للشاشات المتوسطة والكبيرة (Desktop Table View) ----------------- */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[600px] divide-y divide-gray-100 text-right font-sans" dir="rtl">
          <thead className="bg-gray-50/70">
            <tr>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">اسم المتجر</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">صاحب المتجر</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">تاريخ الطلب</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">الحالة</th>
              <th className="px-5 py-3.5 text-center text-xs font-bold text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {requests && requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/60 transition">
                  <td className="px-5 py-4 whitespace-nowrap text-xs font-bold text-gray-800">{req.storeName}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">{req.ownerName}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">{req.date}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-[11px] font-semibold rounded-full ${
                        req.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : req.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {req.status === 'pending' ? 'قيد المراجعة' : req.status === 'accepted' ? 'موثق' : 'مرفوض'}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* زر المعاينة */}
                      <button
                        onClick={() => onViewDetails(req)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition cursor-pointer"
                        title="معاينة المستندات"
                      >
                        <Eye size={16} />
                      </button>

                      {/* أزرار القبول والرفض */}
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onAccept(req.id)}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition cursor-pointer"
                            title="قبول الطلب"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => onReject(req.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                            title="رفض الطلب"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-xs text-gray-400 font-medium">
                  لا توجد طلبات توثيق حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
