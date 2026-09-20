import React from 'react';
import { Tag, Plus, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';

export default function CategoriesSection({
  categoriesList,
  isLoading,
  catNameInput,
  setCatNameInput,
  catIconInput,
  setCatIconInput,
  isSubmittingCat,
  handleAddCategory,
  editingCatId,
  editCatNameInput,
  setEditCatNameInput,
  editCatIconInput,
  setEditCatIconInput,
  startEditCategory,
  handleSaveCategoryEdit,
  setEditingCatId,
  handleDeleteCategory,
}) {
  return (
    <div className="bg-brand-card rounded-2xl border border-brand-border p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
        <div className="p-2 bg-brand-secondary-soft/30 rounded-xl text-brand-secondary">
          <Tag size={20} />
        </div>
        <h2 className="font-bold text-base text-brand-primary">تصنيفات المتاجر</h2>
      </div>

      <form onSubmit={handleAddCategory} className="bg-brand-bg p-4 rounded-xl space-y-3 border border-brand-border">
        <p className="text-xs font-bold text-brand-primary">+ إضافة تصنيف جديد</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="اسم التصنيف"
            value={catNameInput}
            onChange={(e) => setCatNameInput(e.target.value)}
            className="w-full px-3 py-2 bg-brand-card border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-primary transition"
            disabled={isSubmittingCat}
          />
          <input
            type="text"
            placeholder="الأيقونة (Emoji)"
            value={catIconInput}
            onChange={(e) => setCatIconInput(e.target.value)}
            className="w-full px-3 py-2 bg-brand-card border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-primary transition"
            disabled={isSubmittingCat}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmittingCat}
          className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isSubmittingCat ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          <span>حفظ التصنيف</span>
        </button>
      </form>

      {/* جدول عرض التصنيفات */}
      <div className="overflow-hidden border border-brand-border rounded-xl">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-brand-bg text-brand-primary font-bold border-b border-brand-border">
              <th className="p-3">التصنيف</th>
              <th className="p-3 text-center">الأيقونة</th>
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
              categoriesList.map((cat) =>
                editingCatId === cat.id ? (
                  <tr key={cat.id} className="bg-brand-secondary-soft/20">
                    <td className="p-2">
                      <input
                        type="text"
                        value={editCatNameInput}
                        onChange={(e) => setEditCatNameInput(e.target.value)}
                        className="w-full px-2 py-1 bg-brand-card border border-brand-secondary rounded-lg text-xs"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="text"
                        value={editCatIconInput}
                        onChange={(e) => setEditCatIconInput(e.target.value)}
                        className="w-12 px-2 py-1 bg-brand-card border border-brand-secondary rounded-lg text-xs text-center"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleSaveCategoryEdit(cat.id)}
                          className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition"
                          title="حفظ"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingCatId(null)}
                          className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                          title="إلغاء"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={cat.id} className="hover:bg-brand-bg/60 transition">
                    <td className="p-3 font-bold text-brand-primary">{cat.name}</td>
                    <td className="p-3 text-center text-base">{cat.icon}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => startEditCategory(cat)}
                          className="p-1.5 text-brand-primary hover:bg-brand-primary-soft/40 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
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