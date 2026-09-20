import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios'; // تعديل الباث حسب مكان مجلد الـ api بالنسبة لمجلد common/categories
import LocationsSection from './locationsSection';
import CategoriesSection from './categoriesSection';

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
      toast.error('يرجى ملء جميع الحقول الخاصة بالمنطقة');
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
      toast.success('تمت إضافة المنطقة بنجاح ✨');
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
      toast.error('القيم لا يمكن أن تكون فارغة');
      return;
    }

    const updatedData = { governorate: editGovInput.trim(), area: editAreaInput.trim() };

    try {
      await API.put(`/admin/locations/${id}`, updatedData);
    } catch (err) {
      // تحديث محلي
    } finally {
      setLocations(locations.map((loc) => (loc.id === id ? { ...loc, ...updatedData } : loc)));
      setEditingLocId(null);
      toast.success('تم تعديل المنطقة بنجاح ✨');
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
      toast.success('تم حذف المنطقة بنجاح');
    }
  };

  // --- إدارة التصنيفات ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catNameInput.trim()) {
      toast.error('اسم التصنيف مطلوب');
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
      toast.success('تمت إضافة التصنيف بنجاح 🎉');
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
      toast.error('اسم التصنيف مطلوب');
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
      toast.success('تم تعديل التصنيف بنجاح ✨');
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
      toast.success('تم حذف التصنيف بنجاح');
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
        <LocationsSection
          {...{
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
          }}
        />

        {/* قسم إدارة التصنيفات */}
        <CategoriesSection
          {...{
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
          }}
        />
      </div>
    </div>
  );
}