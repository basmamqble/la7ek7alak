import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function AlertSuccess({ message }) {
  return (
    <div className="bg-[#EAF7EF] border border-[#A2E0B8] text-[#1D743B] text-xs py-3 px-5 rounded-xl mb-6 flex items-center justify-center gap-2 shadow-sm transition">
      <CheckSquare size={16} className="text-[#2DB85C]" />
      <span className="font-semibold">{message}</span>
    </div>
  );
}