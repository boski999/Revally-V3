'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface WeeklyData {
  day: string;
  reviews: number;
  responses: number;
}

interface WeeklyActivityChartProps {
  data: WeeklyData[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  return (
    <Card className="border-2 border-indigo-200/50 dark:border-indigo-800/50 shadow-lg shadow-indigo-100/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-lg">
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="reviews" 
              stackId="1"
              stroke="#3B82F6" 
              fill="url(#colorReviews)" 
              name="Reviews"
            />
            <Area 
              type="monotone" 
              dataKey="responses" 
              stackId="1"
              stroke="#10B981" 
              fill="url(#colorResponses)" 
              name="Responses"
            />
            <defs>
              <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}