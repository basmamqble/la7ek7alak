import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios'; // تعديل الباث حسب مكان مجلد الـ api بالنسبة لمجلد common/categories
import LocationsSection from './locationsSection';
import CategoriesSection from './categoriesSection';

export default function Categories() {
  // حالات المناطق
  const [locations, setLocations] = useState([]);
  const [govInput, setGovInput] = useState('');
  const [areaInput, setAreaInput] = useState('');
  const [editingLocId, setEditingLocId] = useState(null);
  const [editGovInput, setEditGovInput] = useState('');
  const [editAreaInput, setEditAreaInput] = useState('');

  // حالات التصنيفات
  const [categoriesList, setCategoriesList] = useState([]);
  const [catNameInput, setCatNameInput] = useState('');
  const [catIconInput, setCatIconInput] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatNameInput, setEditCatNameInput] = useState('');
  const [editCatIconInput, setEditCatIconInput] = useState('');

  // حالات التحميل
  const [isLoading, setIsLoading] = useState(true);
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
        setLocations(Array.isArray(locRes.data) ? locRes.data : []);
        setCategoriesList(Array.isArray(catRes.data) ? catRes.data : []);
      } catch (err) {
        toast.error(err.response?.data?.error || 'تعذر جلب الأقسام والمدن من الخادم');
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
      setLocations((current) => [res.data, ...current]);
      toast.success('تمت إضافة المنطقة بنجاح');
      setGovInput('');
      setAreaInput('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'تعذرت إضافة المنطقة');
    } finally {
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
      const res = await API.put(`/admin/locations/${id}`, updatedData);
      setLocations((current) => current.map((loc) => (loc.id === id ? res.data : loc)));
      setEditingLocId(null);
      toast.success('تم تعديل المنطقة بنجاح');
    } catch (err) {
      toast.error(err.response?.data?.error || 'تعذر تعديل المنطقة');
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المنطقة؟')) return;

    try {
      await API.delete(`/admin/locations/${id}`);
      setLocations((current) => current.filter((loc) => loc.id !== id));
      toast.success('تم حذف المنطقة بنجاح');
    } catch (err) {
      toast.error(err.response?.data?.error || 'تعذر حذف المنطقة');
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
      setCategoriesList((current) => [res.data, ...current]);
      toast.success('تمت إضافة القسم بنجاح');
      setCatNameInput('');
      setCatIconInput('');
    } catch (err) {
      if (err.response?.status === 409) {
        try {
          const response = await API.get('/admin/categories');
          setCategoriesList(Array.isArray(response.data) ? response.data : []);
        } catch {
          // Keep the current list if it cannot be refreshed.
        }
      }
      toast.error(err.response?.data?.error || 'تعذرت إضافة القسم');
    } finally {
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
      const res = await API.put(`/admin/categories/${id}`, updatedData);
      setCategoriesList((current) => current.map((cat) => (cat.id === id ? res.data : cat)));
      setEditingCatId(null);
      toast.success('تم تعديل القسم بنجاح');
    } catch (err) {
      toast.error(err.response?.data?.error || 'تعذر تعديل القسم');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;

    try {
      await API.delete(`/admin/categories/${id}`);
      setCategoriesList((current) => current.filter((cat) => cat.id !== id));
      toast.success('تم حذف القسم بنجاح');
    } catch (err) {
      toast.error(err.response?.data?.error || 'تعذر حذف القسم');
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
