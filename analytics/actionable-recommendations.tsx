'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  ArrowRight,
} from 'lucide-react';

interface AnalyticsData {
  averageRating: number;
  responseRate: number;
  avgResponseTime: number;
  pendingReviews: number;
  sentimentScore: number;
  reviewVelocity: number;
  platformBreakdown: Array<{
    platform: string;
    count: number;
    rating: number;
  }>;
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  action: string;
  icon: any;
}

interface ActionableRecommendationsProps {
  analytics: AnalyticsData;
}

export function ActionableRecommendations({ analytics }: ActionableRecommendationsProps) {
  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];

    if (analytics.averageRating < 4.0) {
      recs.push({
        priority: 'high',
        category: 'Rating',
        title: 'Improve Overall Rating',
        description: `Your current rating of ${analytics.averageRating.toFixed(1)} is below the 4.0 target. Focus on addressing negative feedback and improving service quality.`,
        impact: 'High - Directly affects customer perception',
        action: 'Review negative feedback patterns',
        icon: TrendingDown,
      });
    }

    if (analytics.responseRate < 80) {
      recs.push({
        priority: 'high',
        category: 'Engagement',
        title: 'Increase Response Rate',
        description: `Only ${analytics.responseRate.toFixed(0)}% of reviews have responses. Aim for at least 80% to show customer engagement.`,
        impact: 'High - Improves customer satisfaction',
        action: 'Respond to pending reviews',
        icon: Target,
      });
    }

    if (analytics.avgResponseTime > 24) {
      recs.push({
        priority: 'medium',
        category: 'Speed',
        title: 'Reduce Response Time',
        description: `Average response time of ${analytics.avgResponseTime.toFixed(1)}h is above the 24h benchmark. Quick responses show you care.`,
        impact: 'Medium - Enhances customer experience',
        action: 'Set up response notifications',
        icon: Clock,
      });
    }

    if (analytics.pendingReviews > 10) {
      recs.push({
        priority: 'high',
        category: 'Backlog',
        title: 'Clear Pending Reviews',
        description: `You have ${analytics.pendingReviews} pending reviews. Large backlogs can lead to missed opportunities and delayed responses.`,
        impact: 'High - Prevents customer frustration',
        action: 'Batch process pending reviews',
        icon: AlertTriangle,
      });
    }

    if (analytics.sentimentScore < 70) {
      recs.push({
        priority: 'high',
        category: 'Sentiment',
        title: 'Address Negative Sentiment',
        description: `Only ${analytics.sentimentScore.toFixed(0)}% of reviews have positive sentiment. Identify and address common pain points.`,
        impact: 'High - Critical for reputation',
        action: 'Analyze negative review themes',
        icon: TrendingDown,
      });
    }

    if (analytics.reviewVelocity < 1) {
      recs.push({
        priority: 'medium',
        category: 'Growth',
        title: 'Increase Review Collection',
        description: `Getting ${analytics.reviewVelocity.toFixed(1)} reviews per day. More reviews provide better insights and social proof.`,
        impact: 'Medium - Builds credibility',
        action: 'Encourage more customer reviews',
        icon: TrendingUp,
      });
    }

    const lowestPlatform = analytics.platformBreakdown.reduce((min, p) =>
      p.rating < min.rating ? p : min,
      analytics.platformBreakdown[0] || { platform: 'N/A', rating: 5, count: 0 }
    );

    if (lowestPlatform && lowestPlatform.rating < 4.0 && lowestPlatform.count > 0) {
      recs.push({
        priority: 'medium',
        category: 'Platform',
        title: `Improve ${lowestPlatform.platform} Performance`,
        description: `${lowestPlatform.platform} has the lowest rating at ${lowestPlatform.rating.toFixed(1)}. Focus attention on this platform.`,
        impact: 'Medium - Platform-specific improvement',
        action: `Review ${lowestPlatform.platform} feedback`,
        icon: Target,
      });
    }

    if (recs.length === 0) {
      recs.push({
        priority: 'low',
        category: 'Status',
        title: 'Great Job!',
        description: 'Your metrics are looking strong. Keep maintaining your current performance and continue engaging with customers.',
        impact: 'Positive - Maintain momentum',
        action: 'Continue current practices',
        icon: CheckCircle,
      });
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [analytics]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800';
      case 'low':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
          </div>
          AI-Powered Recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Prioritized action items based on your analytics
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${getPriorityBg(rec.priority)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <Badge variant={getPriorityColor(rec.priority)} className="capitalize">
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {rec.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Impact:</span> {rec.impact}
                      </div>
                      <Button size="sm" variant="outline" className="gap-2">
                        {rec.action}
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
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
