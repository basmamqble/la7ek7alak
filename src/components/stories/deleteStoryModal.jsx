import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteStoryModal({ isOpen, onClose, onConfirm, story }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-brand-card border border-brand-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="p-2.5 bg-rose-50 rounded-2xl">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-base font-bold text-brand-primary">تأكيد حذف الـ Story</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-brand-body hover:text-brand-primary p-1 rounded-xl transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 text-xs text-brand-body">
          <p>هل أنت متأكد من رغبتك في حذف هذا العرض (Story) التابع لمتجر <strong className="text-brand-primary">{story?.merchantName}</strong>؟</p>
          <p className="text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-100 font-medium">
            ⚠️ لا يمكن التراجع عن هذا الإجراء بعد تنفيذه، سيتم إزالة العرض نهائياً من المنصة.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-bg hover:bg-brand-border/60 text-brand-primary text-xs font-bold rounded-2xl transition cursor-pointer"
          >
            إلغاء
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl transition cursor-pointer shadow-sm"
          >
            تأكيد الحذف
          </button>
        </div>

      </div>
    </div>
  );
}