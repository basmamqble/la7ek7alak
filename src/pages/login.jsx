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
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-[420px] bg-white rounded-[28px] shadow-sm border border-[#EFECE6] p-8 md:p-10">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <img 
            src="/logo.png" 
            alt="لحّق حالك" 
            className="w-16 h-16 object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#2D1B13]">لوحة تحكم الأدمن</h1>
          <p className="text-xs text-[#8E5439] mt-1 font-medium">لحّق حالك - إدارة المنصة</p>
        </div>

        {/* عرض رسالة الخطأ */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div>
            <label className="block text-xs font-bold text-[#2D1B13] mb-2 text-right">
              البريد الإلكتروني للأدمن
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              className="w-full text-right px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2D1B13] text-xs text-[#2D1B13] placeholder-gray-300 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D1B13] mb-2 text-right">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-right px-4 py-3 pl-10 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2D1B13] text-xs text-[#2D1B13] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2D1B13] focus:outline-none"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#2D1B13] hover:bg-[#1F120C] text-white py-3.5 rounded-2xl text-xs font-bold transition duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            تسجيل الدخول للوحة التحكم
          </button>
        </form>

      </div>
    </div>
  );
}