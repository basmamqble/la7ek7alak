import React from 'react';
import { Tag, Plus, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';

export default function CategoriesSection({
  categoriesList,
  isLoading,
  catNameInput,
  setCatNameInput,
  setCatIconInput,
  isSubmittingCat,
  handleAddCategory,
  editingCatId,
  editCatNameInput,
  setEditCatNameInput,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="اسم التصنيف"
            value={catNameInput}
            onChange={(e) => setCatNameInput(e.target.value)}
            className="w-full px-3 py-2 bg-brand-card border border-brand-border rounded-xl text-xs focus:outline-none focus:border-brand-primary transition"
            disabled={isSubmittingCat}
          />
          <input
            type="file"
            accept=".svg, image/svg+xml"
            onChange={(e) => setCatIconInput(e.target.files[0])}
            className="w-full px-3 py-1.5 bg-brand-card border border-brand-border rounded-xl text-xs text-brand-body file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-secondary/20 file:text-brand-secondary hover:file:bg-brand-secondary/30 cursor-pointer transition"
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
              <th className="p-3 text-center">الأيقونة (SVG)</th>
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
            ) : categoriesList.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-brand-body">
                  لا توجد تصنيفات مضافة حالياً
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
                        className="w-full px-2 py-1.5 bg-brand-card border border-brand-secondary rounded-lg text-xs"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="file"
                        accept=".svg, image/svg+xml"
                        onChange={(e) => setEditCatIconInput(e.target.files[0])}
                        className="w-full text-[10px] file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-brand-secondary/20 file:text-brand-secondary cursor-pointer"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleSaveCategoryEdit(cat.id)}
                          className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition cursor-pointer"
                          title="حفظ"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingCatId(null)}
                          className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition cursor-pointer"
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
                    <td className="p-3 text-center">
                      {cat.icon ? (
                        cat.icon.trim().startsWith('<svg') ? (
                          /* إذا كان المحتوى عبارة عن كود SVG خام، نقوم بحقنه مباشرة */
                          <div
                            className="w-6 h-6 mx-auto flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: cat.icon }}
                          />
                        ) : (
                          /* إذا كان مساراً عادياً أو نصاً قديماً */
                          <span className="text-base">{cat.icon}</span>
                        )
                      ) : (
                        <span className="text-gray-400 text-xs">لا توجد أيقونة</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => startEditCategory(cat)}
                          className="p-1.5 text-brand-primary hover:bg-brand-primary-soft/40 rounded-lg transition cursor-pointer"
                          title="تعديل"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
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
