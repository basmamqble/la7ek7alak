import React from 'react';
import { Store, MapPin, ChevronLeft } from 'lucide-react';

export default function RecentMerchants({ merchants = [] }) {
  const recentList = Array.isArray(merchants) ? merchants.slice(0, 5) : [];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFECE6] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Store size={18} className="text-[#8E5439]" />
          <h2 className="text-sm font-bold text-[#2D1B13]">أحدث التجار المضافين</h2>
        </div>
      </div>

      {recentList.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">لا يوجد تجار مضافون مؤخراً.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {recentList.map((merchant, idx) => {
            const storeName = merchant.storeName || merchant.store_name || merchant.name || 'متجر جديد';
            const location = merchant.city?.name || merchant.city || merchant.address || 'غزة';

            return (
              <div key={merchant.id || idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#2D1B13]">{storeName}</h4>
                  <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-[#8E5439]" />
                    {location}
                  </p>
                </div>
                <span className="bg-[#E5F7ED] text-[#1E7242] px-2.5 py-1 rounded-full text-[10px] font-bold">
                  جديد
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}