'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Download, Info } from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChartDrillDownDialog } from '@/components/ui/chart-drill-down-dialog';
import { exportChartAsCSV, exportChartAsJSON } from '@/lib/chart-export';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SentimentData {
  name: string;
  value: number;
  color: string;
}

interface SentimentAnalysisChartProps {
  data: SentimentData[];
  reviews?: Array<{
    id: string;
    reviewer: string;
    rating: number;
    content: string;
    date: string;
    platform: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
}

export function SentimentAnalysisChart({ data, reviews = [] }: SentimentAnalysisChartProps) {
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [drillDownOpen, setDrillDownOpen] = useState(false);

  const handleSegmentClick = (sentiment: string) => {
    const sentimentReviews = reviews.filter(
      (r) => r.sentiment === sentiment.toLowerCase()
    );

    const sentimentItem = data.find(d => d.name === sentiment);

    setDrillDownData({
      title: `${sentiment} Reviews`,
      description: `Detailed breakdown of ${sentiment.toLowerCase()} sentiment reviews`,
      stats: {
        'Total': sentimentReviews.length,
        'Percentage': `${sentimentItem?.value || 0}%`,
        'Avg Rating': sentimentReviews.length > 0
          ? (sentimentReviews.reduce((sum, r) => sum + r.rating, 0) / sentimentReviews.length).toFixed(1)
          : '0',
      },
      reviews: sentimentReviews.slice(0, 10),
    });
    setDrillDownOpen(true);
  };

  const handleExport = (format: 'csv' | 'json') => {
    const exportData = {
      labels: data.map((d) => d.name),
      datasets: [{ label: 'Sentiment', data: data.map((d) => d.value) }],
    };

    if (format === 'csv') {
      exportChartAsCSV(exportData, 'sentiment-analysis');
    } else {
      exportChartAsJSON(exportData, 'sentiment-analysis');
    }
  };

  return (
    <>
      <Card className="border-2 border-emerald-200/50 dark:border-emerald-800/50 shadow-lg shadow-emerald-100/50" id="sentiment-chart">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-lg">
                <PieChart className="w-5 h-5 text-emerald-500" />
              </div>
              Sentiment Analysis
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                onClick={(data) => handleSegmentClick(data.name)}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {data.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSegmentClick(item.name)}
                className="w-full flex items-center justify-between text-sm hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="font-medium">{item.value}%</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <ChartDrillDownDialog
        open={drillDownOpen}
        onOpenChange={setDrillDownOpen}
        data={drillDownData}
      />
    </>
  );
}