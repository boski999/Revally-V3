'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Calendar } from 'lucide-react';

interface Review {
  date: string;
  rating: number;
}

interface PeakActivityChartProps {
  reviews: Review[];
}

export function PeakActivityChart({ reviews }: PeakActivityChartProps) {
  const activityData = useMemo(() => {
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    reviews.forEach(review => {
      const date = new Date(review.date);
      const dayOfWeek = date.getDay();
      dayOfWeekCounts[dayOfWeek]++;
    });

    const maxCount = Math.max(...dayOfWeekCounts, 1);

    return dayNames.map((day, index) => ({
      day: day.substring(0, 3),
      fullDay: day,
      count: dayOfWeekCounts[index],
      percentage: (dayOfWeekCounts[index] / maxCount) * 100,
    }));
  }, [reviews]);

  const getColor = (percentage: number) => {
    if (percentage > 80) return '#10B981';
    if (percentage > 60) return '#3B82F6';
    if (percentage > 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-lg">
            <Calendar className="w-5 h-5 text-teal-500" />
          </div>
          Peak Activity by Day of Week
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          When customers are most likely to leave reviews
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="day"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} reviews`,
                props.payload.fullDay
              ]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {activityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <span className="font-medium">
            {activityData.reduce((max, curr) => curr.count > max.count ? curr : max).fullDay}
          </span>
          {' '}is your busiest day for reviews
        </div>
      </CardContent>
    </Card>
  );
}
