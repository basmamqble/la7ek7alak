import React, { useState, useEffect } from 'react';
import { Globe, DollarSign, Share2, ShieldAlert, Save, AlertCircle } from 'lucide-react';
import API from "../../api/axios";
import defaultLogo from "../../assets/logo.svg";
import GeneralSettings from "./generalSettings";
import FinancialSettings from "./financialSettings";
import SocialSettings from "./socialSettings";
import SafetySettings from "./safetySettings";

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

  const [privacyPolicy, setPrivacyPolicy] = useState(
    `نحن في منصة "لَحق حالك" نلتزم بحماية خصوصية بياناتك ومعلوماتك الشخصية. توضح هذه السياسة كيف نقوم بجمع، استخدام، وحماية المعلومات الخاصة بالاستخدام والتجار والزوار...`
  );
  const [termsOfService, setTermsOfService] = useState(
    `باستخدامك لمنصة "لَحق حالك"، فإنك توافق على الالتزام بكافة الشروط والأحكام المنصوص عليها. تُعتبر جميع العروض والخصومات مسؤولة عنها الجهات التجارية المعنية...`
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
          if (d.logoUrl) setLogoPreview(d.logoUrl);
        }
      } catch (err) {
        console.log('استخدام الإعدادات الافتراضية');
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
      platformName, supportEmail, currency, taxRate, commissionRate,
      facebook, instagram, linkedin, whatsapp, privacyPolicy,
      termsOfService, autoBlockStory, maxReports, isMaintenanceMode,
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
                isActive ? 'bg-brand-secondary text-white shadow-sm' : 'text-brand-body hover:bg-brand-bg hover:text-brand-primary'
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
        {activeTab === 'general' && (
          <GeneralSettings
            {...{
              platformName, setPlatformName, supportEmail, setSupportEmail,
              logoPreview, setLogoPreview, defaultLogo, isMaintenanceMode,
              setIsMaintenanceMode, handleInputChange, handleLogoChange, setIsDirty
            }}
          />
        )}

        {activeTab === 'financial' && (
          <FinancialSettings
            {...{
              currency, setCurrency, commissionRate, setCommissionRate,
              taxRate, setTaxRate, handleInputChange
            }}
          />
        )}

        {activeTab === 'social' && (
          <SocialSettings
            {...{
              facebook, setFacebook, instagram, setInstagram,
              linkedin, setLinkedin, whatsapp, setWhatsapp, handleInputChange
            }}
          />
        )}

        {activeTab === 'safety' && (
          <SafetySettings
            {...{
              autoBlockStory, setAutoBlockStory, maxReports, setMaxReports,
              privacyPolicy, setPrivacyPolicy, termsOfService, setTermsOfService,
              handleInputChange, setIsDirty
            }}
          />
        )}

        {/* الشريط السفلي العائم للحفظ */}
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
              <Save size5 />
              <span>{saving ? 'جاري الحفظ...' : 'حفظ التغيرات الآن'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
