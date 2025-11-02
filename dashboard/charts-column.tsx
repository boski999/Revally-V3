'use client';

import { SentimentAnalysisChart } from './charts/sentiment-analysis-chart';
import { WeeklyActivityChart } from './charts/weekly-activity-chart';
import { ResponseTimesChart } from './charts/response-times-chart';

interface ChartsColumnProps {
  sentimentData: Array<{ name: string; value: number; color: string }>;
  weeklyTrend: Array<{ day: string; reviews: number; responses: number }>;
  responseTimeData: Array<{ time: string; count: number }>;
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

export function ChartsColumn({ sentimentData, weeklyTrend, responseTimeData, reviews }: ChartsColumnProps) {
  return (
    <div className="space-y-6">
      <SentimentAnalysisChart data={sentimentData} reviews={reviews} />
      <WeeklyActivityChart data={weeklyTrend} />
      <ResponseTimesChart data={responseTimeData} />
    </div>
  );
}