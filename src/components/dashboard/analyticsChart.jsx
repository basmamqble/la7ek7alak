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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#8E5439] flex items-center gap-2">
          <span>📈</span> إحصائيات تفاعل الزبائن مع الـ Stories (آخر 7 أيام)
        </h2>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C86238" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#C86238" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis hide domain={[0, 'dataMax + 10']} />
            <Tooltip 
              contentStyle={{ borderRadius: '10px', backgroundColor: '#fff', borderColor: '#eee', fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#C86238" 
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