import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Send, 
  RefreshCw, 
  Copy, 
  Check 
} from 'lucide-react';
import API from '../../api/axios';

export default function ResetPasswordModal({ userId, userName, userPhone, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // توليد كلمة مرور عشوائية ممتازة ومؤقتة
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$';
    let generated = '';
    for (let i = 0; i < 8; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(generated);
    setShowPassword(true);
  };

  // نسخ كلمة المرور للحافظة
  const handleCopy = () => {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // إغلاق المودال بزر Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setFeedback({ type: 'error', text: 'يرجى إدخال كلمة المرور المؤقتة' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      await API.put(`/admin/users/${userId}/reset-password`, {
        password: newPassword,
        mustChangePassword: true,
        sendNotification: true,
      });

      setFeedback({ 
        type: 'success', 
        text: 'تم تغيير كلمة المرور وإرسال الإشعار للزبون بنجاح!' 
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-brand-card rounded-2xl w-full max-w-md p-6 shadow-xl border border-brand-border relative text-right">
        {/* زر الإغلاق */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-400 hover:text-brand-primary transition cursor-pointer"
          title="إغلاق"
        >
          <X size={18} />
        </button>

        {/* عنوان المودال */}
        <h2 className="text-base font-bold text-brand-title mb-1 flex items-center gap-2">
          <KeyRound size={18} className="text-brand-secondary" />
          إعادة تعيين كلمة المرور
        </h2>
        
        {userName && (
          <p className="text-xs text-brand-body mb-4">
            تغيير كلمة المرور للزبون: <span className="font-semibold text-brand-secondary">{userName}</span>
            {userPhone && <span className="text-gray-400 font-mono text-[11px] dir-ltr mr-1">({userPhone})</span>}
          </p>
        )}

        {/* تنبيه للأدمن */}
        <div className="bg-brand-bg p-3 rounded-xl border border-brand-border mb-4 text-[11px] text-brand-body leading-relaxed">
          💡 سيتم حفظ كلمة المرور هذه ككلمة مؤقتة وإرسال إشعار مباشر لتطبيق الزبون بها.
        </div>

        {/* الرسائل التنبيهية */}
        {feedback.text && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-brand-title">
                كلمة المرور المؤقتة الجديدة
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[11px] text-brand-secondary hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw size={12} />
                توليد كلمة عشوائية
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="أدخلي كلمة المرور المؤقتة"
                autoFocus
                className="w-full text-right pr-3.5 pl-20 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-secondary text-xs font-sans transition bg-brand-card text-brand-title"
              />
              
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {newPassword && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-brand-secondary transition cursor-pointer"
                    title="نسخ كلمة المرور"
                  >
                    {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-brand-secondary transition cursor-pointer"
                  title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-brand-bg text-brand-title hover:bg-brand-border/50 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newPassword.trim()}
              className="px-5 py-2 bg-brand-primary text-white hover:bg-brand-primary-hover rounded-xl text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              حفظ وإرسال الإشعار
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}