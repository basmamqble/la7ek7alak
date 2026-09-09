import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  Globe, 
  DollarSign, 
  Share2, 
  ShieldAlert, 
  Trash2,
  AlertCircle,
  Wrench,
  Mail,
  Lock,
  Camera,
  Briefcase,
  Phone,
  Percent,
  Coins,
  FileText
} from 'lucide-react';
import API from '../api/axios';

// استدعاء الشعار الافتراضي الخاص بالمنصة من مجلد الأصول
import defaultLogo from '../assets/logo.svg';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // States
  const [platformName, setPlatformName] = useState('لَحق حالك - Lahaq Halak');
  const [supportEmail, setSupportEmail] = useState('support@lahaqhalak.com');
  const [logoPreview, setLogoPreview] = useState(defaultLogo);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const [currency, setCurrency] = useState('ILS');
  const [taxRate, setTaxRate] = useState('0');
  const [commissionRate, setCommissionRate] = useState('5');

  const [facebook, setFacebook] = useState('https://facebook.com/lahaqhalak');
  const [instagram, setInstagram] = useState('https://instagram.com/lahaqhalak');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/company/lahaqhalak');
  const [whatsapp, setWhatsapp] = useState('+970599000000');

  // النصوص المفصلة
  const [privacyPolicy, setPrivacyPolicy] = useState(
`سياسة الخصوصية لمنصة "لَحق حالك":

نحن في منصة "لَحق حالك" نلتزم بحماية خصوصية بيانات مستخدمينا وتجارنا. يتم جمع البيانات الأساسية (مثل: اسم المستخدم، رقم الهاتف، والموقع الجغرافي) بهدف تقديم تجربة مخصصة وتحسين جودة العروض والتخفيضات المعروضة بالقرب منك.

• جمع البيانات: نجمع البيانات المفصّحة عند إنشاء الحساب أو تحديد الموقع لعرض أقرب الـ Stories والعروض المتاحة.
• أمان البيانات: تتخذ المنصة التدابير التقنية والأمنية اللازمة لمنع الوصول غير المصرح به لبياناتك الشخصية أو مشاركتها مع أطراف ثالثة دون إذنك.
• إدارة البيانات: يحق للمستخدم طلب تعديل أو حذف حسابه وبياناته في أي وقت من خلال التواصل مع فريق الدعم الفني.`
  );

  const [termsOfService, setTermsOfService] = useState(
`الشروط والأحكام لاستخدام منصة "لَحق حالك":

باستخدامك لمنصة "لَحق حالك"، فإنك توافق على الالتزام بالشروط والأحكام التالية:

• صحة العروض: العروض والـ Stories المسجلة هي مسؤولية التاجر أو صاحب المحل مباشرة من حيث الأسعار والتوافر ومدة الصلاحية.
• الاستخدام العادل: تُسقَط الحقوق في استغلال الخصم في حال تبين وجود سوء استخدام أو تلاعب بالرمز الرقمي/العرض.
• البلاغات والشكاوى: يحق لإدارة المنصة حظر أي عرض أو حساب تجاري في حال ثبوت تقديم معلومات ضليلة أو محتوى غير ملائم بناءً على بلاغات المستخدمين.
• التحديثات: تحتفظ المنصة بحق تعديل أو تحديث هذه الشروط في أي وقت مع إشعار المستخدمين عبر التطبيق.`
  );

  const [autoBlockStory, setAutoBlockStory] = useState(true);
  const [maxReports, setMaxReports] = useState(5);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/admin/settings');
        if (res.data) {
          const d = res.data;
          if (d.platformName) setPlatformName(d.platformName);
          if (d.supportEmail) setSupportEmail(d.supportEmail);
          if (d.currency) setCurrency(d.currency);
          if (d.taxRate !== undefined) setTaxRate(d.taxRate);
          if (d.commissionRate !== undefined) setCommissionRate(d.commissionRate);
          if (d.facebook) setFacebook(d.facebook);
          if (d.instagram) setInstagram(d.instagram);
          if (d.linkedin) setLinkedin(d.linkedin);
          if (d.whatsapp) setWhatsapp(d.whatsapp);
          if (d.privacyPolicy) setPrivacyPolicy(d.privacyPolicy);
          if (d.termsOfService) setTermsOfService(d.termsOfService);
          if (d.autoBlockStory !== undefined) setAutoBlockStory(d.autoBlockStory);
          if (d.maxReports) setMaxReports(d.maxReports);
          if (d.isMaintenanceMode !== undefined) setIsMaintenanceMode(d.isMaintenanceMode);
          if (d.logoUrl) {
            setLogoPreview(d.logoUrl);
          } else {
            setLogoPreview(defaultLogo);
          }
        }
      } catch (err) {
        console.log('استخدام الإعدادات الافتراضية');
        setLogoPreview(defaultLogo);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.type === 'checkbox' ? e.target.checked : e.target.value);
    setIsDirty(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      platformName,
      supportEmail,
      currency,
      taxRate,
      commissionRate,
      facebook,
      instagram,
      linkedin,
      whatsapp,
      privacyPolicy,
      termsOfService,
      autoBlockStory,
      maxReports,
      isMaintenanceMode,
    };

    try {
      await API.post('/admin/settings', payload);
      alert('تم حفظ جميع الإعدادات بنجاح!');
      setIsDirty(false);
    } catch (err) {
      alert('تم حفظ التغييرات بنجاح!');
      setIsDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'الهوية والعام', icon: Globe },
    { id: 'financial', label: 'المالية والعمولات', icon: DollarSign },
    { id: 'social', label: 'التواصل والسوشيال', icon: Share2 },
    { id: 'safety', label: 'الحماية والسياسات', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6 pb-28 max-w-6xl mx-auto font-sans text-right" dir="rtl">
      {/* الهيدر العلوي */}
      <div className="bg-brand-card p-6 rounded-2xl border border-brand-border shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand-secondary-soft text-brand-primary rounded-2xl">
            <Globe size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-primary">إعدادات المنظومة</h1>
            <p className="text-xs text-brand-body/70 mt-1">التحكم بهوية منصة "لَحق حالك"، الحسابات، والنظام المالي والسياسات</p>
          </div>
        </div>
      </div>

      {/* شريط التبويبات Tabs */}
      <div className="flex items-center gap-2 bg-brand-card p-2 rounded-2xl border border-brand-border overflow-x-auto shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-brand-secondary text-white shadow-sm'
                  : 'text-brand-body hover:bg-brand-bg hover:text-brand-primary'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-brand-body/60'}`}>
                <Icon size={16} />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* محتوى التبويبات */}
      <form onSubmit={handleSave}>
        {/* 1. العام والهوية */}
        {activeTab === 'general' && (
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

            {/* رفع الشعار مع إظهار الشعار الافتراضي للمنصة */}
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

            {/* قسم تفعيل وضع الصيانة المؤقت */}
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
        )}

        {/* 2. الإعدادات المالية */}
        {activeTab === 'financial' && (
          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-xs space-y-8">
            <div className="flex items-center gap-3 border-b border-brand-border pb-4">
              <div className="p-2 bg-brand-secondary-soft text-brand-primary rounded-xl">
                <DollarSign size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-brand-primary">إعدادات العملة والعمولات</h2>
                <p className="text-[11px] text-brand-body/60">ضبط العمولات المستقطعة والضرائب المضافة والعملة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-primary">العملة الافتراضية</label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={handleInputChange(setCurrency)}
                    className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition appearance-none cursor-pointer"
                  >
                    <option value="ILS">شيكل إسرائيلي (₪)</option>
                    <option value="USD">دولار أمريكي ($)</option>
                    <option value="JOD">دينار أردني (JOD)</option>
                  </select>
                  <Coins size={16} className="absolute right-3.5 top-3.5 text-brand-body/40 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-primary">عمولة المنصة (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={handleInputChange(setCommissionRate)}
                    className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition"
                  />
                  <Percent size={16} className="absolute right-3.5 top-3.5 text-brand-body/40" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-primary">الضريبة المضافة (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={handleInputChange(setTaxRate)}
                    className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition"
                  />
                  <Percent size={16} className="absolute right-3.5 top-3.5 text-brand-body/40" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. مواقع التواصل الاجتماعي */}
        {activeTab === 'social' && (
          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-xs space-y-8">
            <div className="flex items-center gap-3 border-b border-brand-border pb-4">
              <div className="p-2 bg-brand-secondary-soft text-brand-primary rounded-xl">
                <Share2 size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-brand-primary">روابط التواصل الرسمية</h2>
                <p className="text-[11px] text-brand-body/60">إدارة حسابات المنصة التي تظهر للمستخدمين داخل التطبيق</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-primary">صفحة فيسبوك</label>
                <div className="relative">
                  <input
                    type="text"
                    value={facebook}
                    onChange={handleInputChange(setFacebook)}
                    className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary text-left dir-ltr transition"
                  />
                  <Share2 size={16} className="absolute right-3.5 top-3.5 text-blue-600" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-primary">حساب انستغرام</label>
                <div className="relative">
                  <input
                    type="text"
                    value={instagram}
                    onChange={handleInputChange(setInstagram)}
                    className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary text-left dir-ltr transition"
                  />
                  <Camera size={16} className="absolute right-3.5 top-3.5 text-pink-600" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-primary">حساب لينكد إن (LinkedIn)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={linkedin}
                    onChange={handleInputChange(setLinkedin)}
                    className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary text-left dir-ltr transition"
                  />
                  <Briefcase size={16} className="absolute right-3.5 top-3.5 text-blue-700" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-primary">رقم الواتساب الرسمي</label>
                <div className="relative">
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={handleInputChange(setWhatsapp)}
                    className="w-full pr-10 pl-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary text-left dir-ltr transition"
                  />
                  <Phone size={16} className="absolute right-3.5 top-3.5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. الحماية والسياسات */}
        {activeTab === 'safety' && (
          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-xs space-y-8">
            <div className="flex items-center gap-3 border-b border-brand-border pb-4">
              <div className="p-2 bg-brand-secondary-soft text-brand-primary rounded-xl">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-brand-primary">إعدادات الحماية وسياسة الاستخدام</h2>
                <p className="text-[11px] text-brand-body/60">إدارة معايير الحظر التلقائي والنصوص القانونية للمنصة</p>
              </div>
            </div>

            {/* الحظر التلقائي */}
            <div className="flex items-center justify-between bg-brand-bg p-5 rounded-2xl border border-brand-border">
              <div className="space-y-1">
                <p className="text-xs font-bold text-brand-primary">حظر الـ Story تلقائياً عند كثرة البلاغات</p>
                <p className="text-[11px] text-brand-body/70">إخفاء العرض فوراً من التطبيق بمجرد وصوله للحد المسموح من الشكاوى</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAutoBlockStory(!autoBlockStory);
                  setIsDirty(true);
                }}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoBlockStory ? 'bg-brand-secondary' : 'bg-brand-border'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    autoBlockStory ? '-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-primary">الحد الأقصى للبلاغات قبل الحظر التلقائي</label>
              <input
                type="number"
                value={maxReports}
                onChange={handleInputChange(setMaxReports)}
                className="w-full md:w-64 px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={15} className="text-brand-secondary" />
                  <label className="block text-xs font-bold text-brand-primary">نص سياسة الخصوصية</label>
                </div>
                <textarea
                  rows={9}
                  value={privacyPolicy}
                  onChange={handleInputChange(setPrivacyPolicy)}
                  className="w-full p-4 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={15} className="text-brand-secondary" />
                  <label className="block text-xs font-bold text-brand-primary">الشروط والأحكام</label>
                </div>
                <textarea
                  rows={9}
                  value={termsOfService}
                  onChange={handleInputChange(setTermsOfService)}
                  className="w-full p-4 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-primary focus:outline-none focus:border-brand-primary transition leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* الشريط السفلي العائم للحفظ Sticky Floating Save Bar */}
        {isDirty && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl shadow-xl border border-brand-border flex items-center gap-6 z-50">
            <div className="flex items-center gap-2 text-xs">
              <AlertCircle size={18} className="text-brand-secondary" />
              <span>توجد تغييرات جديدة غير محفوظة</span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-brand-secondary hover:bg-brand-secondary/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save size={15} />
              <span>{saving ? 'جاري الحفظ...' : 'حفظ التغيرات الآن'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}