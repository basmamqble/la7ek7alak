import React from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const activityData = [
  { time: '10 AM', stories: 12, users: 45 },
  { time: '12 PM', stories: 28, users: 89 },
  { time: '2 PM', stories: 45, users: 130 },
  { time: '4 PM', stories: 35, users: 95 },
  { time: '6 PM', stories: 60, users: 180 },
  { time: '8 PM', stories: 50, users: 140 },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-brand-card p-6 rounded-3xl border border-brand-border shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-2xl">
            <TrendingUp size={20} />
          </div>
          <h2 className="font-bold text-base text-brand-primary">حركة تفاعل المستخدمين والقصص اليوم</h2>
        </div>
        <span className="text-xs text-brand-body bg-brand-bg px-3 py-1.5 rounded-xl border border-brand-border font-medium">
          اليوم الحالي
        </span>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorStories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderColor: '#e2e8f0', 
                borderRadius: '16px',
                fontSize: '12px',
                direction: 'rtl',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Area type="monotone" dataKey="users" name="العملاء المتفاعلون" stroke="#0f172a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
            <Area type="monotone" dataKey="stories" name="القصص المنشورة" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStories)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}