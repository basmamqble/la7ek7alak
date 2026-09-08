import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'السبت', value: 30 },
  { name: 'الأحد', value: 45 },
  { name: 'الإثنين', value: 38 },
  { name: 'الثلاثاء', value: 65 },
  { name: 'الأربعاء', value: 78 },
  { name: 'الخميس', value: 70 },
  { name: 'الجمعة', value: 92 },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-brand-card p-6 rounded-2xl shadow-xs border border-brand-border space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-brand-title flex items-center gap-2">
          <span>📈</span> إحصائيات تفاعل الزبائن مع الـ Stories (آخر 7 أيام)
        </h2>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-secondary, #E86B32)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-brand-secondary, #E86B32)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              interval={0} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 11, fill: '#888' }} 
            />
            <YAxis hide domain={[0, 'dataMax + 10']} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                backgroundColor: 'var(--color-brand-card, #ffffff)', 
                borderColor: 'var(--color-brand-border, #EFECE6)', 
                color: 'var(--color-brand-title, #013C58)',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-brand-secondary, #E86B32)" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}