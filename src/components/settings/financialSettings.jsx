import React from 'react';
import { DollarSign, Coins, Percent } from 'lucide-react';

export default function FinancialSettings({
  currency,
  setCurrency,
  commissionRate,
  setCommissionRate,
  taxRate,
  setTaxRate,
  handleInputChange
}) {
  return (
    <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-xs space-y-8">
      <div className="flex items-center gap-3 border-b border-brand-border pb-4">
        <div className="p-2 bg-brand-secondary-soft text-brand-primary rounded-xl">
          <DollarSign size={20} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-brand-primary">إعدادات العملة والعمولات</h2>
          <p className="text-[11px] text-brand-body/60">ضبط العمولات المستقطعة والضرائب المضافة والعملة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-brand-primary">العملة الافتراضية</label>
          <div className="relative">
            <select
              value={currency}
              onChange={handleInputChange(setCurrency)}
              className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition appearance-none cursor-pointer"
            >
              <option value="ILS">شيكل إسرائيلي (₪)</option>
              <option value="USD">دولار أمريكي ($)</option>
              <option value="JOD">دينار أردني (JOD)</option>
            </select>
            <Coins size={16} className="absolute right-3.5 top-3.5 text-brand-body/40 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-brand-primary">عمولة المنصة (%)</label>
          <div className="relative">
            <input
              type="number"
              value={commissionRate}
              onChange={handleInputChange(setCommissionRate)}
              className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition"
            />
            <Percent size={16} className="absolute right-3.5 top-3.5 text-brand-body/40" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-brand-primary">الضريبة المضافة (%)</label>
          <div className="relative">
            <input
              type="number"
              value={taxRate}
              onChange={handleInputChange(setTaxRate)}
              className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition"
            />
            <Percent size={16} className="absolute right-3.5 top-3.5 text-brand-body/40" />
          </div>
        </div>
      </div>
    </div>
  );
}