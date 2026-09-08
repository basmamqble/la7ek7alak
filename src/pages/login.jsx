import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import API from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/admin/login', { email, password });
      
      const token = response.data.token || response.data.accessToken;
      if (token) {
        localStorage.setItem('token', token);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في البريد أو كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="w-full max-w-[420px] bg-brand-card rounded-[28px] shadow-sm border border-brand-border p-8 md:p-10">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <img 
            src="/logo.jpg" 
            alt="لحّق حالك" 
            className="w-45 h-45 object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-brand-primary">لوحة تحكم الأدمن</h1>
          <p className="text-xs text-brand-secondary font-bold mt-1">لحّق حالك - إدارة المنصة</p>
        </div>

        {/* عرض رسالة الخطأ */}
        {error && (
          <div className="bg-rose-50 text-rose-600 border border-rose-200 text-xs p-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div>
            <label className="block text-xs font-bold text-brand-primary mb-2 text-right">
              البريد الإلكتروني للأدمن
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              className="w-full text-right px-4 py-3 rounded-2xl border border-brand-border focus:outline-none focus:border-brand-primary text-xs text-brand-primary placeholder-gray-400 transition bg-brand-bg/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-primary mb-2 text-right">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-right px-4 py-3 pl-10 rounded-2xl border border-brand-border focus:outline-none focus:border-brand-primary text-xs text-brand-primary transition bg-brand-bg/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary focus:outline-none transition"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-brand-primary hover:bg-brand-primary-hover text-white py-3.5 rounded-2xl text-xs font-bold transition duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            تسجيل الدخول للوحة التحكم
          </button>
        </form>

      </div>
    </div>
  );
}