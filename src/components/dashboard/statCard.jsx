import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, trendType = 'up', description, bgGradient, iconBg, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-3xl border shadow-sm space-y-3 cursor-pointer hover:shadow-md transition group ${bgGradient || 'bg-brand-card border-brand-border'}`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 text-white rounded-2xl shadow-sm group-hover:scale-110 transition ${iconBg || 'bg-brand-primary'}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 px-2.5 py-1 rounded-xl text-xs font-bold ${trendType === 'down' ? 'text-rose-700 bg-rose-100' : 'text-emerald-700 bg-emerald-100'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-brand-body font-semibold">{title}</p>
        <h3 className="text-2xl font-black text-brand-primary mt-1">{value}</h3>
      </div>
      {description && <p className="text-[11px] text-brand-body/70">{description}</p>}
    </div>
  );
}