'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Target } from 'lucide-react';

interface PlatformMetrics {
  platform: string;
  rating: number;
  responseRate: number;
  reviewCount: number;
  avgResponseTime: number;
  sentiment: number;
}

interface PlatformRadarChartProps {
  platforms: PlatformMetrics[];
}

export function PlatformRadarChart({ platforms }: PlatformRadarChartProps) {
  const normalizeData = (platforms: PlatformMetrics[]) => {
    const maxReviews = Math.max(...platforms.map(p => p.reviewCount), 1);
    const maxResponseTime = Math.max(...platforms.map(p => p.avgResponseTime), 1);

    return platforms.map(p => ({
      platform: p.platform,
      'Rating (0-5)': (p.rating / 5) * 100,
      'Response Rate': p.responseRate,
      'Volume': (p.reviewCount / maxReviews) * 100,
      'Response Speed': 100 - ((p.avgResponseTime / maxResponseTime) * 100),
      'Sentiment': p.sentiment,
    }));
  };

  const radarData = [
    { metric: 'Rating', ...Object.fromEntries(platforms.map(p => [p.platform, (p.rating / 5) * 100])) },
    { metric: 'Response Rate', ...Object.fromEntries(platforms.map(p => [p.platform, p.responseRate])) },
    { metric: 'Volume', ...Object.fromEntries(platforms.map(p => [p.platform, (p.reviewCount / Math.max(...platforms.map(x => x.reviewCount), 1)) * 100])) },
    { metric: 'Response Speed', ...Object.fromEntries(platforms.map(p => [p.platform, 100 - ((p.avgResponseTime / Math.max(...platforms.map(x => x.avgResponseTime), 1)) * 100)])) },
    { metric: 'Sentiment', ...Object.fromEntries(platforms.map(p => [p.platform, p.sentiment])) },
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-lg">
            <Target className="w-5 h-5 text-cyan-500" />
          </div>
          Platform Performance Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {platforms.map((platform, index) => (
              <Radar
                key={platform.platform}
                name={platform.platform}
                dataKey={platform.platform}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
