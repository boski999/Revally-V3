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
import { Clock } from 'lucide-react';

interface ResponseTimeHistogramProps {
  responseTimes: number[];
}

export function ResponseTimeHistogram({ responseTimes }: ResponseTimeHistogramProps) {
  const histogramData = useMemo(() => {
    const buckets = [
      { range: '0-2h', min: 0, max: 2, count: 0, color: '#10B981' },
      { range: '2-6h', min: 2, max: 6, count: 0, color: '#3B82F6' },
      { range: '6-12h', min: 6, max: 12, count: 0, color: '#F59E0B' },
      { range: '12-24h', min: 12, max: 24, count: 0, color: '#EF4444' },
      { range: '24h+', min: 24, max: Infinity, count: 0, color: '#991B1B' },
    ];

    responseTimes.forEach(time => {
      const bucket = buckets.find(b => time >= b.min && time < b.max);
      if (bucket) bucket.count++;
    });

    return buckets;
  }, [responseTimes]);

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          Response Time Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          How quickly you respond to reviews
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="range"
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
              formatter={(value: number) => [`${value} reviews`, 'Count']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {histogramData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {histogramData.map((bucket) => (
            <div key={bucket.range} className="text-center">
              <div className="text-sm font-medium">{bucket.count}</div>
              <div className="text-xs text-muted-foreground">{bucket.range}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
