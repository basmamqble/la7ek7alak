import React from 'react';
import { Share2, Camera, Briefcase, Phone } from 'lucide-react';

export default function SocialSettings({
  facebook,
  setFacebook,
  instagram,
  setInstagram,
  linkedin,
  setLinkedin,
  whatsapp,
  setWhatsapp,
  handleInputChange
}) {
  return (
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
  );
}