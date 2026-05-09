'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
  data: Array<{
    date: string;
    calories: number;
    target: number;
  }>;
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div className="bg-white/88 backdrop-blur-md border border-[#005239]/10 shadow-lg rounded-[24px] p-6">
      <h3 className="text-[18px] font-bold text-[#005239] mb-6">Calo 7 ngày gần đây</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#caeadd" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6f7973', fontSize: 12 }}
            axisLine={{ stroke: '#caeadd' }}
          />
          <YAxis 
            tick={{ fill: '#6f7973', fontSize: 12 }}
            axisLine={{ stroke: '#caeadd' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #caeadd',
              borderRadius: '12px',
              padding: '8px 12px',
            }}
            formatter={(value) => `${Math.round(value as number)} kcal`}
          />
          <Bar dataKey="calories" fill="#005239" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
