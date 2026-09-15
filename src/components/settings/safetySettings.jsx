import React from "react";
import { ShieldAlert, AlertCircle } from "lucide-react";

export default function SafetySettings({ privacyPolicy, setPrivacyPolicy, termsOfService, setTermsOfService }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">الحماية والسياسات</h2>
          <p className="text-sm text-gray-500">إدارة سياسة الخصوصية وشروط الاستخدام للمنصة</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* سياسة الخصوصية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            سياسة الخصوصية (Privacy Policy)
          </label>
          <textarea
            rows="5"
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            placeholder="اكتب أو قم بتحديث سياسة الخصوصية هنا..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm leading-relaxed"
          />
        </div>

        {/* الشروط والأحكام */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الشروط والأحكام (Terms of Service)
          </label>
          <textarea
            rows="5"
            value={termsOfService}
            onChange={(e) => setTermsOfService(e.target.value)}
            placeholder="اكتب أو قم بتحديث الشروط والأحكام هنا..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm leading-relaxed"
          />
        </div>

        <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-xs">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            تأكد من مراجعة التعديلات جيداً قبل حفظها، حيث ستظهر هذه النصوص مباشرة للمستخدمين في الواجهات الأمامية لمنصة "لَحق حالك".
          </span>
        </div>
      </div>
    </div>
  );
}