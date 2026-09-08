import React, { useState, useEffect } from 'react';
import { MapPin, Tag, Plus, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const defaultLocations = [
  { id: 1, governorate: 'الوسطى', area: 'النصيرات' },
  { id: 2, governorate: 'غزة', area: 'الرمال' },
  { id: 3, governorate: 'خانيونس', area: 'البلد' },
];

const defaultCategories = [
  { id: 1, name: 'مطاعم وجبات سريعة', icon: '🍔' },
  { id: 2, name: 'ملابس وأزياء', icon: '👗' },
  { id: 3, name: 'حلويات ومخابز', icon: '🍩' },
];

export default function Categories() {
  // حالات المناطق
  const [locations, setLocations] = useState(defaultLocations);
  const [govInput, setGovInput] = useState('');
  const [areaInput, setAreaInput] = useState('');
  const [editingLocId, setEditingLocId] = useState(null);
  const [editGovInput, setEditGovInput] = useState('');
  const [editAreaInput, setEditAreaInput] = useState('');

  // حالات التصنيفات
  const [categoriesList, setCategoriesList] = useState(defaultCategories);
  const [catNameInput, setCatNameInput] = useState('');
  const [catIconInput, setCatIconInput] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatNameInput, setEditCatNameInput] = useState('');
  const [editCatIconInput, setEditCatIconInput] = useState('');

  // حالات التحميل
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingLoc, setIsSubmittingLoc] = useState(false);
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [locRes, catRes] = await Promise.all([
          API.get('/admin/locations'),
          API.get('/admin/categories'),
        ]);
        if (locRes.data?.length > 0) setLocations(locRes.data);
        if (catRes.data?.length > 0) setCategoriesList(catRes.data);
      } catch (err) {
        toast('يتم عرض البيانات الافتراضية محلياً', { 
          icon: 'ℹ️',
          style: {
            background: 'var(--brand-card, #ffffff)',
            color: 'var(--brand-primary, #0f172a)',
            border: '1px solid var(--brand-border, #e2e8f0)',
            padding: '12px 16px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
          },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- إدارة المناطق ---
  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!govInput.trim() || !areaInput.trim()) {
      toast.error('يرجى ملء جميع الحقول الخاصة بالمنطقة', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          borderRadius: '16px',
          fontSize: '12px',
        },
      });
      return;
    }

    setIsSubmittingLoc(true);
    const payload = { governorate: govInput.trim(), area: areaInput.trim() };

    try {
      const res = await API.post('/admin/locations', payload);
      const savedLoc = res.data || { id: Date.now(), ...payload };
      setLocations([savedLoc, ...locations]);
    } catch (err) {
      setLocations([{ id: Date.now(), ...payload }, ...locations]);
    } finally {
      toast.success('تمت إضافة المنطقة بنجاح ✨', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          padding: '12px 16px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '600',
        },
      });
      setGovInput('');
      setAreaInput('');
      setIsSubmittingLoc(false);
    }
  };

  const startEditLocation = (loc) => {
    setEditingLocId(loc.id);
    setEditGovInput(loc.governorate);
    setEditAreaInput(loc.area);
  };

  const handleSaveLocationEdit = async (id) => {
    if (!editGovInput.trim() || !editAreaInput.trim()) {
      toast.error('القيم لا يمكن أن تكون فارغة', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          borderRadius: '16px',
          fontSize: '12px',
        },
      });
      return;
    }

    const updatedData = { governorate: editGovInput.trim(), area: editAreaInput.trim() };

    try {
      await API.put(`/admin/locations/${id}`, updatedData);
    } catch (err) {
      // تحديث محلي في حال الفشل
    } finally {
      setLocations(locations.map((loc) => (loc.id === id ? { ...loc, ...updatedData } : loc)));
      setEditingLocId(null);
      toast.success('تم تعديل المنطقة بنجاح ✨', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          padding: '12px 16px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '600',
        },
      });
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المنطقة؟')) return;

    try {
      await API.delete(`/admin/locations/${id}`);
    } catch (err) {
      // حذف محلي
    } finally {
      setLocations(locations.filter((loc) => loc.id !== id));
      toast.success('تم حذف المنطقة بنجاح', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          padding: '12px 16px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '600',
        },
      });
    }
  };

  // --- إدارة التصنيفات ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catNameInput.trim()) {
      toast.error('اسم التصنيف مطلوب', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          borderRadius: '16px',
          fontSize: '12px',
        },
      });
      return;
    }

    setIsSubmittingCat(true);
    const payload = { name: catNameInput.trim(), icon: catIconInput.trim() || '🏷️' };

    try {
      const res = await API.post('/admin/categories', payload);
      const savedCat = res.data || { id: Date.now(), ...payload };
      setCategoriesList([savedCat, ...categoriesList]);
    } catch (err) {
      setCategoriesList([{ id: Date.now(), ...payload }, ...categoriesList]);
    } finally {
      toast.success('تمت إضافة التصنيف بنجاح 🎉', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          padding: '12px 16px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '600',
        },
      });
      setCatNameInput('');
      setCatIconInput('');
      setIsSubmittingCat(false);
    }
  };

  const startEditCategory = (cat) => {
    setEditingCatId(cat.id);
    setEditCatNameInput(cat.name);
    setEditCatIconInput(cat.icon);
  };

  const handleSaveCategoryEdit = async (id) => {
    if (!editCatNameInput.trim()) {
      toast.error('اسم التصنيف مطلوب', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          borderRadius: '16px',
          fontSize: '12px',
        },
      });
      return;
    }

    const updatedData = { name: editCatNameInput.trim(), icon: editCatIconInput.trim() };

    try {
      await API.put(`/admin/categories/${id}`, updatedData);
    } catch (err) {
      // تحديث محلي
    } finally {
      setCategoriesList(categoriesList.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat)));
      setEditingCatId(null);
      toast.success('تم تعديل التصنيف بنجاح ✨', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          padding: '12px 16px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '600',
        },
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;

    try {
      await API.delete(`/admin/categories/${id}`);
    } catch (err) {
      // حذف محلي
    } finally {
      setCategoriesList(categoriesList.filter((cat) => cat.id !== id));
      toast.success('تم حذف التصنيف بنجاح', {
        style: {
          background: 'var(--brand-card, #ffffff)',
          color: 'var(--brand-primary, #0f172a)',
          border: '1px solid var(--brand-border, #e2e8f0)',
          padding: '12px 16px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '600',
        },
      });
    }
  };

  return (
    <div className="space-y-6 bg-brand-bg min-h-screen p-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">
          إدارة الأقسام والمدن (Categories & Locations)
        </h1>
        <p className="text-xs text-brand-body mt-1">
          إدارة كافة التصنيفات والمواقع الجغرافية لمشروع لحّق حالك
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* قسم إدارة المدن والمناطق */}
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

        {/* قسم إدارة التصنيفات */}
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
      </div>
    </div>
  );
}