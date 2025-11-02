'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface ReviewInsight {
  id: string;
  rating: number;
  date: string;
  platform: string;
  status: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface AIInsightsProps {
  reviews: ReviewInsight[];
}

interface Insight {
  type: 'positive' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  metric?: string;
  icon: any;
}

export function AIInsights({ reviews }: AIInsightsProps) {
  const insights = useMemo(() => {
    const insights: Insight[] = [];

    if (reviews.length === 0) {
      return [{
        type: 'info' as const,
        title: 'No Data Available',
        description: 'Start collecting reviews to see AI-powered insights.',
        icon: Sparkles,
      }];
    }

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const previous7Days = new Date();
    previous7Days.setDate(previous7Days.getDate() - 14);

    const recentReviews = reviews.filter(r => new Date(r.date) >= last7Days);
    const previousReviews = reviews.filter(
      r => new Date(r.date) >= previous7Days && new Date(r.date) < last7Days
    );

    const recentAvg = recentReviews.length > 0
      ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length
      : 0;
    const previousAvg = previousReviews.length > 0
      ? previousReviews.reduce((sum, r) => sum + r.rating, 0) / previousReviews.length
      : 0;

    if (recentAvg > previousAvg && recentReviews.length > 0) {
      insights.push({
        type: 'success',
        title: 'Rating Improvement Detected',
        description: `Your average rating increased from ${previousAvg.toFixed(1)} to ${recentAvg.toFixed(1)} this week. Keep up the great work!`,
        metric: `+${(recentAvg - previousAvg).toFixed(1)}`,
        icon: TrendingUp,
      });
    } else if (recentAvg < previousAvg && recentReviews.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Rating Decline Noticed',
        description: `Your average rating dropped from ${previousAvg.toFixed(1)} to ${recentAvg.toFixed(1)}. Consider reviewing recent feedback.`,
        metric: `${(recentAvg - previousAvg).toFixed(1)}`,
        icon: TrendingDown,
      });
    }

    const negativeReviews = recentReviews.filter(r => r.rating <= 2);
    if (negativeReviews.length > 3) {
      insights.push({
        type: 'warning',
        title: 'Multiple Negative Reviews',
        description: `You received ${negativeReviews.length} reviews with 2 stars or less this week. Prompt responses may help improve sentiment.`,
        metric: `${negativeReviews.length} reviews`,
        icon: AlertCircle,
      });
    }

    const pendingReviews = reviews.filter(r => r.status === 'pending');
    if (pendingReviews.length > 5) {
      insights.push({
        type: 'info',
        title: 'Pending Responses',
        description: `You have ${pendingReviews.length} reviews awaiting response. Quick responses improve customer satisfaction.`,
        metric: `${pendingReviews.length} pending`,
        icon: AlertCircle,
      });
    }

    const responseRate = reviews.length > 0
      ? ((reviews.filter(r => r.status !== 'pending').length / reviews.length) * 100)
      : 0;
    if (responseRate >= 90) {
      insights.push({
        type: 'success',
        title: 'Excellent Response Rate',
        description: `You're responding to ${responseRate.toFixed(0)}% of reviews. This shows strong customer engagement!`,
        metric: `${responseRate.toFixed(0)}%`,
        icon: CheckCircle,
      });
    }

    const platformCounts = reviews.reduce((acc, r) => {
      acc[r.platform] = (acc[r.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];
    if (topPlatform && topPlatform[1] > reviews.length * 0.5) {
      insights.push({
        type: 'info',
        title: 'Platform Concentration',
        description: `${topPlatform[1]} reviews (${((topPlatform[1] / reviews.length) * 100).toFixed(0)}%) come from ${topPlatform[0]}. Consider diversifying review sources.`,
        metric: topPlatform[0],
        icon: Sparkles,
      });
    }

    const sentimentCounts = reviews.reduce((acc, r) => {
      acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const positiveRate = reviews.length > 0
      ? ((sentimentCounts.positive || 0) / reviews.length) * 100
      : 0;

    if (positiveRate >= 80) {
      insights.push({
        type: 'success',
        title: 'Strong Positive Sentiment',
        description: `${positiveRate.toFixed(0)}% of your reviews have positive sentiment. Your customers are very satisfied!`,
        metric: `${positiveRate.toFixed(0)}%`,
        icon: Sparkles,
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Looking Good',
        description: 'No significant patterns detected. Keep maintaining your current service quality.',
        icon: CheckCircle,
      });
    }

    return insights;
  }, [reviews]);

  const getInsightStyle = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950';
      case 'warning':
        return 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950';
      case 'info':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950';
      case 'positive':
        return 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950';
      default:
        return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getBadgeVariant = (type: Insight['type']) => {
    switch (type) {
      case 'success':
      case 'positive':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'info':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          AI-Powered Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Automatically generated insights based on your review data
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${getInsightStyle(insight.type)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      {insight.metric && (
                        <Badge variant={getBadgeVariant(insight.type)} className="shrink-0">
                          {insight.metric}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
