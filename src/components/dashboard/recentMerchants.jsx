import React from 'react';
import { Store, ChevronLeft } from 'lucide-react';

export default function RecentMerchants({ merchants = [], onViewAll }) {
  return (
    <div className="bg-brand-card p-6 rounded-3xl border border-brand-border shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-brand-secondary/10 text-brand-secondary rounded-2xl">
            <Store size={20} />
          </div>
          <h2 className="font-bold text-base text-brand-primary">أحدث التجار انضماماً</h2>
        </div>
        {onViewAll && (
          <span 
            onClick={onViewAll}
            className="text-xs text-brand-secondary font-bold cursor-pointer hover:underline flex items-center gap-1"
          >
            عرض الكل <ChevronLeft size={14} />
          </span>
        )}
      </div>

      <div className="space-y-3">
        {merchants.map((merchant, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-2xl border border-brand-border/60">
            <div>
              <h4 className="font-bold text-xs text-brand-primary">{merchant.storeName}</h4>
              <p className="text-[11px] text-brand-body/70 mt-0.5">محافظة {merchant.city}</p>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl font-bold">نشط</span>
          </div>
        ))}
      </div>
    </div>
  );
}