'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ComparisonMetric {
  label: string;
  current: number;
  previous: number;
  format?: (value: number) => string;
}

interface ComparisonViewProps {
  weekOverWeek: ComparisonMetric[];
  monthOverMonth: ComparisonMetric[];
}

function MetricComparison({ metric }: { metric: ComparisonMetric }) {
  const change = metric.current - metric.previous;
  const percentChange = metric.previous !== 0
    ? ((change / metric.previous) * 100).toFixed(1)
    : '0';
  const isPositive = change >= 0;

  const formatValue = (value: number) => {
    return metric.format ? metric.format(value) : value.toString();
  };

  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        {metric.label}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">{formatValue(metric.current)}</div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="text-lg text-muted-foreground">{formatValue(metric.previous)}</div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(Number(percentChange))}%
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {isPositive ? 'Increase' : 'Decrease'} from previous period
      </div>
    </div>
  );
}

function ComparisonChart({ data, title }: { data: ComparisonMetric[]; title: string }) {
  const chartData = data.map(metric => ({
    name: metric.label,
    Current: metric.current,
    Previous: metric.previous,
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="Current" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Previous" fill="#94A3B8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ComparisonView({ weekOverWeek, monthOverMonth }: ComparisonViewProps) {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          Trend Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week">Week over Week</TabsTrigger>
            <TabsTrigger value="month">Month over Month</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weekOverWeek.map((metric) => (
                <MetricComparison key={metric.label} metric={metric} />
              ))}
            </div>
            <ComparisonChart data={weekOverWeek} title="Weekly Trend Analysis" />
          </TabsContent>

          <TabsContent value="month" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monthOverMonth.map((metric) => (
                <MetricComparison key={metric.label} metric={metric} />
              ))}
            </div>
            <ComparisonChart data={monthOverMonth} title="Monthly Trend Analysis" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
