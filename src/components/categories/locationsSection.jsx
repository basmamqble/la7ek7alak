import React from 'react';
import { MapPin, Plus, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';

export default function LocationsSection({
  locations,
  isLoading,
  govInput,
  setGovInput,
  areaInput,
  setAreaInput,
  isSubmittingLoc,
  handleAddLocation,
  editingLocId,
  editGovInput,
  setEditGovInput,
  editAreaInput,
  setEditAreaInput,
  startEditLocation,
  handleSaveLocationEdit,
  setEditingLocId,
  handleDeleteLocation,
}) {
  return (
    <div className="bg-brand-card rounded-2xl border border-brand-border p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
        <div className="p-2 bg-brand-primary-soft/30 rounded-xl text-brand-primary">
          <MapPin size={20} />
        </div>
        <h2 className="font-bold text-base text-brand-primary">المناطق الجغرافية</h2>
      </div>

      <form onSubmit={handleAddLocation} className="bg-brand-bg p-4 rounded-xl space-y-3 border border-brand-border">
        <p className="text-xs font-bold text-brand-primary">+ إضافة منطقة جديدة</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="المحافظة / المدينة"
            value={govInput}
            onChange={(e) => setGovInput(e.target.value)}
            className="w-full px-3 py-2 bg-brand-card border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-primary transition"
            disabled={isSubmittingLoc}
          />
          <input
            type="text"
            placeholder="المنطقة الفرعية"
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value)}
            className="w-full px-3 py-2 bg-brand-card border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-primary transition"
            disabled={isSubmittingLoc}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmittingLoc}
          className="w-full py-2.5 bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isSubmittingLoc ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          <span>إضافة المنطقة</span>
        </button>
      </form>

      {/* جدول عرض المناطق */}
      <div className="overflow-hidden border border-brand-border rounded-xl">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-brand-bg text-brand-primary font-bold border-b border-brand-border">
              <th className="p-3">المحافظة</th>
              <th className="p-3">المنطقة</th>
              <th className="p-3 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-brand-body">
                  جاري تحميل البيانات...
                </td>
              </tr>
            ) : (
              locations.map((loc) =>
                editingLocId === loc.id ? (
                  <tr key={loc.id} className="bg-brand-secondary-soft/20">
                    <td className="p-2">
                      <input
                        type="text"
                        value={editGovInput}
                        onChange={(e) => setEditGovInput(e.target.value)}
                        className="w-full px-2 py-1 bg-brand-card border border-brand-secondary rounded-lg text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editAreaInput}
                        onChange={(e) => setEditAreaInput(e.target.value)}
                        className="w-full px-2 py-1 bg-brand-card border border-brand-secondary rounded-lg text-xs"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleSaveLocationEdit(loc.id)}
                          className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition"
                          title="حفظ"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingLocId(null)}
                          className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                          title="إلغاء"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={loc.id} className="hover:bg-brand-bg/60 transition">
                    <td className="p-3 font-bold text-brand-primary">{loc.governorate}</td>
                    <td className="p-3 text-brand-body">{loc.area}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => startEditLocation(loc)}
                          className="p-1.5 text-brand-primary hover:bg-brand-primary-soft/40 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(loc.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}