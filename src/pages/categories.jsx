import React, { useState, useEffect } from 'react';
import { MapPin, Tag, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import API from '../api/axios'; // عدلي المسار بحسب موقع الملف لديكِ

// بيانات وهمية ابتدائية
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

export default function categories() {
  // حالات المناطق
  const [locations, setLocations] = useState(defaultLocations);
  const [govInput, setGovInput] = useState('');
  const [areaInput, setAreaInput] = useState('');
  const [editingLocId, setEditingLocId] = useState(null);
  const [editGovInput, setEditGovInput] = useState('');
  const [editAreaInput, setEditAreaInput] = useState('');

  // حالات التصنيفات
  const [categories, setCategories] = useState(defaultCategories);
  const [catNameInput, setCatNameInput] = useState('');
  const [catIconInput, setCatIconInput] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatNameInput, setEditCatNameInput] = useState('');
  const [editCatIconInput, setEditCatIconInput] = useState('');

  // جلب البيانات من الباك إند إن وجدت
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, catRes] = await Promise.all([
          API.get('/admin/locations'),
          API.get('/admin/categories'),
        ]);
        if (locRes.data?.length > 0) setLocations(locRes.data);
        if (catRes.data?.length > 0) setCategories(catRes.data);
      } catch (err) {
        console.log('استخدام البيانات الافتراضية للمناطق والتصنيفات');
      }
    };
    fetchData();
  }, []);

  // --- عمليات المناطق ---
  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!govInput.trim() || !areaInput.trim()) return;

    const newLoc = { id: Date.now(), governorate: govInput, area: areaInput };
    try {
      await API.post('/admin/locations', { governorate: govInput, area: areaInput });
    } catch (err) {
      console.log('إضافة محلياً');
    }

    setLocations([newLoc, ...locations]);
    setGovInput('');
    setAreaInput('');
  };

  const startEditLocation = (loc) => {
    setEditingLocId(loc.id);
    setEditGovInput(loc.governorate);
    setEditAreaInput(loc.area);
  };

  const handleSaveLocationEdit = async (id) => {
    if (!editGovInput.trim() || !editAreaInput.trim()) return;

    try {
      await API.put(`/admin/locations/${id}`, { governorate: editGovInput, area: editAreaInput });
    } catch (err) {
      console.log('تعديل محلياً');
    }

    setLocations(
      locations.map((loc) =>
        loc.id === id ? { ...loc, governorate: editGovInput, area: editAreaInput } : loc
      )
    );
    setEditingLocId(null);
  };

  const handleDeleteLocation = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المنطقة؟')) {
      try {
        await API.delete(`/admin/locations/${id}`);
      } catch (err) {
        console.log('حذف محلي فقط');
      }
      setLocations(locations.filter((loc) => loc.id !== id));
    }
  };

  // --- عمليات التصنيفات ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;

    const newCat = { id: Date.now(), name: catNameInput, icon: catIconInput || '🏷️' };
    try {
      await API.post('/admin/categories', { name: catNameInput, icon: catIconInput });
    } catch (err) {
      console.log('إضافة محلياً');
    }

    setCategories([newCat, ...categories]);
    setCatNameInput('');
    setCatIconInput('');
  };

  const startEditCategory = (cat) => {
    setEditingCatId(cat.id);
    setEditCatNameInput(cat.name);
    setEditCatIconInput(cat.icon);
  };

  const handleSaveCategoryEdit = async (id) => {
    if (!editCatNameInput.trim()) return;

    try {
      await API.put(`/admin/categories/${id}`, { name: editCatNameInput, icon: editCatIconInput });
    } catch (err) {
      console.log('تعديل محلياً');
    }

    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, name: editCatNameInput, icon: editCatIconInput } : cat
      )
    );
    setEditingCatId(null);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      try {
        await API.delete(`/admin/categories/${id}`);
      } catch (err) {
        console.log('حذف محلي فقط');
      }
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-xl font-bold text-[#8E5439]">
          إدارة الأقسام والمدن (Categories & Locations CRUD)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          التحكم بالتصنيفات والمواقع الجغرافية وتعديلها وإدارتها
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* قسم إدارة المدن والمناطق */}
        <div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EFECE6]">
            <MapPin size={18} className="text-[#8E5439]" />
            <h2 className="font-bold text-sm text-[#2D1B13]">إدارة المدن والمناطق الجغرافية</h2>
          </div>

          <form onSubmit={handleAddLocation} className="bg-[#FAF8F5] p-4 rounded-xl space-y-3">
            <p className="text-[11px] font-bold text-[#8E5439]">+ إضافة مدينة / منطقة جديدة</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="اسم المحافظة / المدينة"
                value={govInput}
                onChange={(e) => setGovInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-xl text-xs focus:outline-none focus:border-[#8E5439]"
              />
              <input
                type="text"
                placeholder="المنطقة الفرعية"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-xl text-xs focus:outline-none focus:border-[#8E5439]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#2D1B13] hover:bg-[#1f130d] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>إضافة المنطقة</span>
            </button>
          </form>

          {/* جدول عرض وتعديل المناطق */}
          <div className="overflow-hidden border border-[#EFECE6] rounded-xl">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-gray-600 font-bold border-b border-[#EFECE6]">
                  <th className="p-3">المحافظة</th>
                  <th className="p-3">المنطقة</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {locations.map((loc) =>
                  editingLocId === loc.id ? (
                    <tr key={loc.id} className="bg-amber-50/40">
                      <td className="p-2">
                        <input
                          type="text"
                          value={editGovInput}
                          onChange={(e) => setEditGovInput(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#8E5439] rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editAreaInput}
                          onChange={(e) => setEditAreaInput(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#8E5439] rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveLocationEdit(loc.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                            title="حفظ"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => setEditingLocId(null)}
                            className="p-1 text-gray-500 hover:bg-gray-200 rounded-lg"
                            title="إلغاء"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={loc.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-[#2D1B13]">{loc.governorate}</td>
                      <td className="p-3 text-gray-600">{loc.area}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => startEditLocation(loc)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="تعديل"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteLocation(loc.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* قسم إدارة تصنيفات المتاجر */}
        <div className="bg-white rounded-2xl border border-[#EFECE6] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EFECE6]">
            <Tag size={18} className="text-[#8E5439]" />
            <h2 className="font-bold text-sm text-[#2D1B13]">إدارة تصنيفات المتاجر</h2>
          </div>

          <form onSubmit={handleAddCategory} className="bg-[#FAF8F5] p-4 rounded-xl space-y-3">
            <p className="text-[11px] font-bold text-[#8E5439]">+ إضافة تصنيف جديد</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="اسم التصنيف"
                value={catNameInput}
                onChange={(e) => setCatNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-xl text-xs focus:outline-none focus:border-[#8E5439]"
              />
              <input
                type="text"
                placeholder="الأيقونة / Emoji"
                value={catIconInput}
                onChange={(e) => setCatIconInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-xl text-xs focus:outline-none focus:border-[#8E5439]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#2D1B13] hover:bg-[#1f130d] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>حفظ التصنيف</span>
            </button>
          </form>

          {/* جدول عرض وتعديل التصنيفات */}
          <div className="overflow-hidden border border-[#EFECE6] rounded-xl">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-gray-600 font-bold border-b border-[#EFECE6]">
                  <th className="p-3">التصنيف</th>
                  <th className="p-3 text-center">الأيقونة</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {categories.map((cat) =>
                  editingCatId === cat.id ? (
                    <tr key={cat.id} className="bg-amber-50/40">
                      <td className="p-2">
                        <input
                          type="text"
                          value={editCatNameInput}
                          onChange={(e) => setEditCatNameInput(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#8E5439] rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="text"
                          value={editCatIconInput}
                          onChange={(e) => setEditCatIconInput(e.target.value)}
                          className="w-12 px-2 py-1 bg-white border border-[#8E5439] rounded-lg text-xs text-center"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveCategoryEdit(cat.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                            title="حفظ"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => setEditingCatId(null)}
                            className="p-1 text-gray-500 hover:bg-gray-200 rounded-lg"
                            title="إلغاء"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={cat.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-[#2D1B13]">{cat.name}</td>
                      <td className="p-3 text-center text-base">{cat.icon}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => startEditCategory(cat)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="تعديل"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
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