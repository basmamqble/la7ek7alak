import React, { useState } from 'react';
import { X, Megaphone } from 'lucide-react';

export default function AddAdModal({ isOpen, onClose, onAdd }) {
  const [storeName, setStoreName] = useState('');
  const [adPlan, setAdPlan] = useState('إعلان واحد فردي');
  const [amount, setAmount] = useState('5 $');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  const handlePlanChange = (plan) => {
    setAdPlan(plan);
    if (plan.includes('3')) setAmount('10 $');
    else if (plan.includes('5')) setAmount('15 $');
    else setAmount('5 $');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    let calculatedEndDate = endDate;
    if (!calculatedEndDate) {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      calculatedEndDate = d.toISOString().split('T')[0];
    }

    onAdd({
      storeName,
      adPlan,
      amount,
      startDate,
      endDate: calculatedEndDate,
      status: 'active',
    });

    setStoreName('');
    setAdPlan('إعلان واحد فردي');
    setAmount('5 $');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl text-right dir-rtl">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Megaphone size={18} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">إضافة إعلان جديد لمتجر</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-600 font-bold mb-1">اسم المتجر</label>
            <input
              type="text"
              required
              placeholder="مثال: متجر الإلكترونيات الحديثة"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">باقة الإعلان</label>
            <select
              value={adPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="إعلان واحد فردي">إعلان واحد فردي (5 $)</option>
              <option value="باقة 3 إعلانات (مميز)">باقة 3 إعلانات (10 $)</option>
              <option value="باقة 5 إعلانات (فائق)">باقة 5 إعلانات (15 $)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">المبلغ (تلقائي حسب الباقة)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 font-bold text-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 font-bold mb-1">تاريخ البداية</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-bold mb-1">تاريخ النهاية</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition cursor-pointer"
            >
              حفظ وتفعيل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}