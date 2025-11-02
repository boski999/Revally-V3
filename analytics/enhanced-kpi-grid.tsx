'use client';

import { StatsCard } from '@/components/stats-card';
import {
  MessageSquare,
  Star,
  Target,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface KPIData {
  totalReviews: number;
  totalReviewsTrend: number;
  averageRating: number;
  averageRatingTrend: number;
  responseRate: number;
  responseRateTrend: number;
  avgResponseTime: number;
  avgResponseTimeTrend: number;
  pendingReviews: number;
  pendingReviewsTrend: number;
  sentimentScore: number;
  sentimentScoreTrend: number;
  reviewVelocity: number;
  reviewVelocityTrend: number;
  csatScore: number;
  csatScoreTrend: number;
}

interface EnhancedKPIGridProps {
  data: KPIData;
}

export function EnhancedKPIGrid({ data }: EnhancedKPIGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatsCard
        title="Total Reviews"
        value={data.totalReviews.toLocaleString()}
        description="All time reviews collected"
        icon={MessageSquare}
        trend={{ value: data.totalReviewsTrend, isPositive: data.totalReviewsTrend >= 0 }}
        color="blue"
        tooltip="The total number of customer reviews received across all connected platforms during the selected time period."
      />

      <StatsCard
        title="Average Rating"
        value={data.averageRating.toFixed(2)}
        description="Across all platforms"
        icon={Star}
        trend={{ value: data.averageRatingTrend, isPositive: data.averageRatingTrend >= 0 }}
        color="orange"
        tooltip="The mean rating score calculated from all reviews. A higher score indicates better customer satisfaction. Industry benchmark is 4.0 stars."
      />

      <StatsCard
        title="Response Rate"
        value={`${data.responseRate.toFixed(0)}%`}
        description="Reviews with responses"
        icon={Target}
        trend={{ value: data.responseRateTrend, isPositive: data.responseRateTrend >= 0 }}
        color="green"
        tooltip="Percentage of reviews that have received a response. Aim for 80%+ to show strong customer engagement and care."
      />

      <StatsCard
        title="Avg Response Time"
        value={`${data.avgResponseTime.toFixed(1)}h`}
        description="Time to respond"
        icon={Clock}
        trend={{ value: data.avgResponseTimeTrend, isPositive: data.avgResponseTimeTrend <= 0 }}
        color="blue"
        tooltip="Average time taken to respond to reviews after they're posted. Faster response times demonstrate attentiveness. Best practice is under 24 hours."
      />

      <StatsCard
        title="Pending Reviews"
        value={data.pendingReviews}
        description="Awaiting response"
        icon={AlertCircle}
        trend={{ value: data.pendingReviewsTrend, isPositive: data.pendingReviewsTrend <= 0 }}
        color="orange"
        tooltip="Number of reviews that haven't been responded to yet. Keeping this number low ensures timely customer engagement and prevents backlog."
      />

      <StatsCard
        title="Sentiment Score"
        value={`${data.sentimentScore.toFixed(0)}%`}
        description="Positive sentiment rate"
        icon={CheckCircle}
        trend={{ value: data.sentimentScoreTrend, isPositive: data.sentimentScoreTrend >= 0 }}
        color="green"
        tooltip="Percentage of reviews with positive sentiment based on ratings (4-5 stars) and AI analysis. Higher scores indicate happier customers."
      />

      <StatsCard
        title="Review Velocity"
        value={data.reviewVelocity.toFixed(1)}
        description="Reviews per day"
        icon={Zap}
        trend={{ value: data.reviewVelocityTrend, isPositive: data.reviewVelocityTrend >= 0 }}
        color="pink"
        tooltip="Average number of reviews received per day. This metric helps track business activity and customer engagement trends over time."
      />

      <StatsCard
        title="CSAT Score"
        value={`${data.csatScore.toFixed(0)}%`}
        description="Customer satisfaction"
        icon={TrendingUp}
        trend={{ value: data.csatScoreTrend, isPositive: data.csatScoreTrend >= 0 }}
        color="blue"
        tooltip="Customer Satisfaction Score normalized to percentage (rating/5 × 100). Industry standard for measuring overall customer happiness with your service."
      />
    </div>
  );
}
