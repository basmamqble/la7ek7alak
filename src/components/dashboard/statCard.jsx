import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-brand-card rounded-2xl p-5 border border-brand-border shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-brand-body">{title}</p>
        <h3 className="text-2xl font-bold text-brand-title">{value}</h3>
        {trend && (
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
            {trend}
          </span>
        )}
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}