import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function AlertSuccess({ message = "تمت العملية بنجاح!", className = "" }) {
  return (
    <div 
      className={`bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-3 px-5 rounded-xl mb-6 flex items-center gap-2.5 shadow-sm transition-all duration-200 w-full ${className}`}
    >
      <CheckSquare size={18} className="text-emerald-600 shrink-0" />
      <span className="font-semibold leading-relaxed">{message}</span>
    </div>
  );
}