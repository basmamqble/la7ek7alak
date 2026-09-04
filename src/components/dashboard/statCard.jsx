import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EFECE6] shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-[#2D1B13]">{value}</h3>
        {trend && (
          <span className="text-[11px] font-medium text-[#1E7242] bg-[#E5F7ED] px-2 py-0.5 rounded-full inline-block mt-1">
            {trend}
          </span>
        )}
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#8E5439]">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}