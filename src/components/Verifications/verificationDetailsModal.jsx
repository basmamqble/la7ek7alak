import React from 'react';
import { X, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function VerificationDetailsModal({ verification, onClose, onAccept, onReject }) {
  if (!verification) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans" dir="rtl">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        
        {/* هيدر المودال */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-secondary/10 text-brand-primary rounded-xl">
              <FileText size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">تفاصيل ومستندات طلب التوثيق</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* محتوى المودال */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <span className="text-gray-400 block mb-1">اسم المتجر:</span>
              <span className="font-bold text-gray-800 text-sm">{verification.storeName}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">صاحب المتجر:</span>
              <span className="font-bold text-gray-800 text-sm">{verification.ownerName}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">نوع المستند:</span>
              <span className="font-semibold text-gray-700">{verification.documentType}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">رقم المستند / الهوية:</span>
              <span className="font-semibold text-gray-700">{verification.documentNumber}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-500 font-bold block mb-2">المستند المرفق (معاينة):</span>
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 h-56 flex items-center justify-center">
              <img 
                src={verification.documentUrl} 
                alt="المستند المرفق" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {verification.notes && (
            <div>
              <span className="text-gray-500 font-bold block mb-1">ملاحظات التاجر:</span>
              <p className="p-3 bg-amber-50 text-amber-800 rounded-xl leading-relaxed">{verification.notes}</p>
            </div>
          )}
        </div>

        {/* أزرار الإجراءات داخل المودال */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
          {verification.status === 'pending' && (
            <>
              <button
                onClick={() => onReject(verification.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold transition cursor-pointer"
              >
                <XCircle size={16} />
                <span>رفض</span>
              </button>
              <button
                onClick={() => onAccept(verification.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition cursor-pointer shadow-sm"
              >
                <CheckCircle size={16} />
                <span>قبول وتوثيق</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}