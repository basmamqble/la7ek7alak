import React from 'react';
import { Eye, Check, X } from 'lucide-react';

export default function VerificationTable({ requests, onViewDetails, onAccept, onReject }) {
  return (
    <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100 text-right font-sans" dir="rtl">
        <thead className="bg-gray-50/70">
          <tr>
            <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">اسم المتجر</th>
            <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">صاحب المتجر</th>
            <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">تاريخ الطلب</th>
            <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">الحالة</th>
            <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {requests && requests.length > 0 ? (
            requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50/60 transition">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-800">{req.storeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">{req.ownerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{req.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-[11px] font-semibold rounded-full 
                    ${req.status === 'pending' ? 'bg-amber-50 text-amber-700' : 
                      req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {req.status === 'pending' ? 'قيد المراجعة' : req.status === 'accepted' ? 'موثق' : 'مرفوض'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* زر المعاينة */}
                    <button 
                      onClick={() => onViewDetails(req)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition cursor-pointer"
                      title="معاينة المستندات"
                    >
                      <Eye size={16} />
                    </button>

                    {/* أزرار القبول والرفض تظهر فقط لو الطلب قيد المراجعة */}
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
  );
}