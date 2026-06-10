'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminChart() {
  
  const data = [
    { name: 'T2', views: 40, likes: 24 },
    { name: 'T3', views: 30, likes: 13 },
    { name: 'T4', views: 20, likes: 58 },
    { name: 'T5', views: 27, likes: 39 },
    { name: 'T6', views: 18, likes: 48 },
    { name: 'T7', views: 23, likes: 38 },
    { name: 'CN', views: 34, likes: 43 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ fill: '#F3F4F6' }}
          />
          <Bar dataKey="views" name="Lượt xem" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
          <Bar dataKey="likes" name="Lượt thích" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}