import React from 'react';
import { Globe, Mail, Upload, Trash2, Wrench, Lock } from 'lucide-react';

export default function GeneralSettings({
  platformName,
  setPlatformName,
  supportEmail,
  setSupportEmail,
  logoPreview,
  setLogoPreview,
  defaultLogo,
  isMaintenanceMode,
  setIsMaintenanceMode,
  handleInputChange,
  handleLogoChange,
  setIsDirty
}) {
  return (
    <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-xs space-y-8">
      <div className="flex items-center gap-3 border-b border-brand-border pb-4">
        <div className="p-2 bg-brand-secondary-soft text-brand-primary rounded-xl">
          <Globe size={20} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-brand-primary">الهوية البصرية والبيانات الأساسية</h2>
          <p className="text-[11px] text-brand-body/60">تحديث المظهر الأساسي للمنصة ومعلومات الدعم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-brand-primary">اسم المنصة الرسمي</label>
          <div className="relative">
            <input
              type="text"
              value={platformName}
              onChange={handleInputChange(setPlatformName)}
              className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition"
            />
            <Globe size={16} className="absolute right-3.5 top-3.5 text-brand-body/40" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-brand-primary">بريد الدعم الفني</label>
          <div className="relative">
            <input
              type="email"
              value={supportEmail}
              onChange={handleInputChange(setSupportEmail)}
              className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary text-left dir-ltr transition"
            />
            <Mail size={16} className="absolute right-3.5 top-3.5 text-brand-body/40" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-brand-primary">شعار التطبيق والمنصة</label>
        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-brand-bg border border-dashed border-brand-border rounded-2xl">
          <div className="w-24 h-24 rounded-2xl border border-brand-border bg-brand-card flex items-center justify-center overflow-hidden shadow-xs relative group shrink-0">
            {logoPreview ? (
              <>
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                <button
                  type="button"
                  onClick={() => { setLogoPreview(defaultLogo); setIsDirty(true); }}
                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="إعادة الشعار الافتراضي"
                >
                  <Trash2 size={18} />
                </button>
              </>
            ) : (
              <span className="text-[11px] text-brand-body/50 font-medium">لا يوجد شعار</span>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-right">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-secondary hover:bg-brand-primary text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs">
              <Upload size={15} />
              <span>رفع شعار جديد</span>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
            <p className="text-[11px] text-brand-body/60">الصيغ المدعومة: PNG, SVG, JPG (الحد الأقصى 2MB)</p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="bg-brand-bg border border-brand-border rounded-2xl p-5 transition-all shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-secondary-soft text-brand-primary rounded-xl shrink-0">
                <Wrench size={22} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-brand-primary">تفعيل وضع الصيانة المؤقت</h4>
                  <Lock size={14} className="text-brand-secondary" />
                </div>
                <p className="text-xs text-brand-body/70 leading-relaxed">
                  إيقاف وصول الزبائن والتجار للتطبيق مؤقتاً لأغراض التحديث والصيانة.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMaintenanceMode(!isMaintenanceMode);
                setIsDirty(true);
              }}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isMaintenanceMode ? 'bg-brand-secondary' : 'bg-brand-border'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isMaintenanceMode ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}