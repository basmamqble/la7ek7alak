import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function AddSubscriptionModal({ isOpen, onClose, onAdd }) {
  const [newSubData, setNewSubData] = useState({
    storeName: '',
    plan: 'شهري',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newSubData.storeName || !newSubData.endDate) return;
    onAdd(newSubData);
    setNewSubData({
      storeName: '',
      plan: 'شهري',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-[#013C58]/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-[#A8E8F9]/40 text-right dir-rtl font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-[#A8E8F9]/30 pb-3">
          <h3 className="font-bold text-sm text-[#013C58]">إضافة اشتراك جديد لمتاجر</h3>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-[#013C58] hover:bg-[#A8E8F9]/20 rounded-lg transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#013C58] font-bold mb-1">اسم المتجر</label>
            <input
              type="text"
              required
              placeholder="أدخل اسم المتجر..."
              value={newSubData.storeName}
              onChange={(e) => setNewSubData({ ...newSubData, storeName: e.target.value })}
              className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl focus:outline-none focus:border-[#F5A201] text-[#013C58]"
            />
          </div>

          <div>
            <label className="block text-[#013C58] font-bold mb-1">نوع الخطة</label>
            <select
              value={newSubData.plan}
              onChange={(e) => setNewSubData({ ...newSubData, plan: e.target.value })}
              className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl focus:outline-none focus:border-[#F5A201] text-[#013C58]"
            >
              <option value="أسبوعي">أسبوعي</option>
              <option value="شهري">شهري</option>
              <option value="سنوي">سنوي</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#013C58] font-bold mb-1">تاريخ البداية</label>
              <input
                type="date"
                value={newSubData.startDate}
                onChange={(e) => setNewSubData({ ...newSubData, startDate: e.target.value })}
                className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl focus:outline-none focus:border-[#F5A201] text-[#013C58]"
              />
            </div>
            <div>
              <label className="block text-[#013C58] font-bold mb-1">تاريخ الانتهاء</label>
              <input
                type="date"
                required
                value={newSubData.endDate}
                onChange={(e) => setNewSubData({ ...newSubData, endDate: e.target.value })}
                className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl focus:outline-none focus:border-[#F5A201] text-[#013C58]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#013C58] font-bold mb-1">حالة الاشتراك</label>
            <select
              value={newSubData.status}
              onChange={(e) => setNewSubData({ ...newSubData, status: e.target.value })}
              className="w-full p-2 bg-[#A8E8F9]/10 border border-[#A8E8F9]/50 rounded-xl focus:outline-none focus:border-[#F5A201] text-[#013C58]"
            >
              <option value="active">نشط</option>
              <option value="expiring_soon">ينتهي قريباً</option>
              <option value="expired">منتهي</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#A8E8F9]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#F5A201] text-white rounded-xl font-bold hover:bg-[#d98f00] transition cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              حفظ الاشتراك
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}