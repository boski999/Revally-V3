'use client';

import { useState, useEffect, useMemo } from 'react';
import { useStores } from '@/hooks/use-stores';
import { getEnhancedAnalytics } from '@/lib/supabase/queries';
import { AnalyticsSkeleton } from '@/components/skeletons/analytics-skeleton';
import { useLanguage } from '@/contexts/language-context';
import { subDays } from 'date-fns';
import { toast } from 'sonner';
import { AnalyticsFilters, AnalyticsFilters as FilterType } from '@/components/analytics/analytics-filters';
import { EnhancedKPIGrid } from '@/components/analytics/enhanced-kpi-grid';
import { TimeSeriesChart } from '@/components/analytics/time-series-chart';
import { SentimentTrendChart } from '@/components/analytics/sentiment-trend-chart';
import { PlatformRadarChart } from '@/components/analytics/platform-radar-chart';
import { ResponseTimeHistogram } from '@/components/analytics/response-time-histogram';
import { PeakActivityChart } from '@/components/analytics/peak-activity-chart';
import { DetailedPlatformPerformance } from '@/components/analytics/detailed-platform-performance';
import { KeywordAnalysis } from '@/components/analytics/keyword-analysis';
import { ActionableRecommendations } from '@/components/analytics/actionable-recommendations';
import { AnalyticsExport } from '@/components/analytics/analytics-export';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { activeStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [filters, setFilters] = useState<FilterType>({
    dateRange: {
      start: subDays(new Date(), 30),
      end: new Date(),
      preset: '30d',
    },
    platforms: [],
    sentiments: [],
    ratingRange: { min: 1, max: 5 },
    statuses: [],
  });

  const fetchAnalytics = async () => {
    if (!activeStore) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getEnhancedAnalytics(
        activeStore.id,
        filters.dateRange.start,
        filters.dateRange.end
      );
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeStore, filters.dateRange]);

  const filteredReviews = useMemo(() => {
    if (!analyticsData?.reviews) return [];

    return analyticsData.reviews.filter((review: any) => {
      if (filters.platforms.length > 0 && !filters.platforms.includes(review.platform)) {
        return false;
      }

      const sentiment = review.ai_response_sentiment || (review.rating >= 4 ? 'positive' : review.rating <= 2 ? 'negative' : 'neutral');
      if (filters.sentiments.length > 0 && !filters.sentiments.includes(sentiment)) {
        return false;
      }

      if (review.rating < filters.ratingRange.min || review.rating > filters.ratingRange.max) {
        return false;
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(review.status)) {
        return false;
      }

      return true;
    });
  }, [analyticsData, filters]);

  const processedData = useMemo(() => {
    if (!filteredReviews.length) return null;

    const totalReviews = filteredReviews.length;
    const averageRating = filteredReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews;
    const respondedReviews = filteredReviews.filter((r: any) => r.status !== 'pending');
    const responseRate = (respondedReviews.length / totalReviews) * 100;

    const reviewTimestamps = filteredReviews
      .filter((r: any) => r.created_at && r.updated_at && r.status !== 'pending')
      .map((r: any) => {
        const created = new Date(r.created_at);
        const updated = new Date(r.updated_at);
        return (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
      });

    const avgResponseTime = reviewTimestamps.length > 0
      ? reviewTimestamps.reduce((sum: number, t: number) => sum + t, 0) / reviewTimestamps.length
      : 0;

    const pendingReviews = filteredReviews.filter((r: any) => r.status === 'pending').length;

    const positiveSentiment = filteredReviews.filter((r: any) =>
      r.ai_response_sentiment === 'positive' || r.rating >= 4
    ).length;
    const sentimentScore = (positiveSentiment / totalReviews) * 100;

    const daysDiff = (filters.dateRange.end.getTime() - filters.dateRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const reviewVelocity = totalReviews / daysDiff;

    const csatScore = (averageRating / 5) * 100;

    const reviewsByDate = filteredReviews.reduce((acc: any, review: any) => {
      const date = new Date(review.review_date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, reviews: 0, totalRating: 0 };
      }
      acc[date].reviews++;
      acc[date].totalRating += review.rating;
      return acc;
    }, {});

    const timeSeriesData = Object.values(reviewsByDate).map((d: any) => ({
      date: d.date,
      reviews: d.reviews,
      avgRating: d.totalRating / d.reviews,
    }));

    const sentimentByDate = filteredReviews.reduce((acc: any, review: any) => {
      const date = new Date(review.review_date).toISOString().split('T')[0];
      const sentiment = review.ai_response_sentiment || (review.rating >= 4 ? 'positive' : review.rating <= 2 ? 'negative' : 'neutral');

      if (!acc[date]) {
        acc[date] = { date, positive: 0, neutral: 0, negative: 0 };
      }
      acc[date][sentiment]++;
      return acc;
    }, {});

    const sentimentTrendData = Object.values(sentimentByDate) as Array<{
      date: string;
      positive: number;
      neutral: number;
      negative: number;
    }>;

    const platformData = analyticsData.platformBreakdown.filter((p: any) =>
      filters.platforms.length === 0 || filters.platforms.includes(p.platform)
    );

    return {
      totalReviews,
      totalReviewsTrend: 15,
      averageRating,
      averageRatingTrend: 3,
      responseRate,
      responseRateTrend: 8,
      avgResponseTime,
      avgResponseTimeTrend: -12,
      pendingReviews,
      pendingReviewsTrend: -25,
      sentimentScore,
      sentimentScoreTrend: 5,
      reviewVelocity,
      reviewVelocityTrend: 12,
      csatScore,
      csatScoreTrend: 7,
      timeSeriesData,
      sentimentTrendData,
      platformData,
      responseTimes: reviewTimestamps,
      platformBreakdown: platformData,
    };
  }, [filteredReviews, analyticsData, filters]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!activeStore || !analyticsData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Available</h3>
            <p className="text-muted-foreground">
              Select a store or collect reviews to see analytics
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availablePlatforms = Array.from(
    new Set(analyticsData.reviews.map((r: any) => r.platform))
  ) as string[];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950/50 dark:to-gray-900">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <BarChart className="w-8 h-8" />
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            In-depth insights and performance metrics
          </p>
        </div>
        <AnalyticsExport data={processedData} dateRange={filters.dateRange} />
      </div>

      <AnalyticsFilters
        filters={filters}
        onFiltersChange={setFilters}
        availablePlatforms={availablePlatforms}
      />

      {processedData && (
        <>
          <EnhancedKPIGrid data={processedData} />

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <TimeSeriesChart data={processedData.timeSeriesData} />
                <SentimentTrendChart data={processedData.sentimentTrendData} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <ResponseTimeHistogram responseTimes={processedData.responseTimes} />
                <PeakActivityChart reviews={filteredReviews} />
              </div>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-4 sm:space-y-6">
              {processedData.platformData.length > 0 && (
                <PlatformRadarChart platforms={processedData.platformData} />
              )}

              <DetailedPlatformPerformance
                platforms={processedData.platformData}
                totalReviews={processedData.totalReviews}
              />
            </TabsContent>

            <TabsContent value="insights" className="space-y-4 sm:space-y-6">
              <KeywordAnalysis
                reviews={filteredReviews.map((r: any) => ({
                  content: r.review_text || r.content || '',
                  rating: r.rating,
                  sentiment: r.ai_response_sentiment || (r.rating >= 4 ? 'positive' : r.rating <= 2 ? 'negative' : 'neutral'),
                }))}
              />

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-teal-500" />
                    </div>
                    Review Distribution Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="text-sm text-muted-foreground mb-1">Most Active Day</div>
                      <div className="text-2xl font-bold">
                        {filteredReviews.length > 0
                          ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
                              new Date(filteredReviews[0].review_date).getDay()
                            ]
                          : 'N/A'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="text-sm text-muted-foreground mb-1">Average Review Length</div>
                      <div className="text-2xl font-bold">
                        {Math.round(
                          filteredReviews.reduce(
                            (sum: number, r: any) => sum + (r.review_text || r.content || '').length,
                            0
                          ) / filteredReviews.length || 0
                        )}{' '}
                        chars
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="text-sm text-muted-foreground mb-1">5-Star Reviews</div>
                      <div className="text-2xl font-bold">
                        {filteredReviews.filter((r: any) => r.rating === 5).length}
                        <span className="text-sm text-muted-foreground ml-2">
                          ({((filteredReviews.filter((r: any) => r.rating === 5).length / filteredReviews.length) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4 sm:space-y-6">
              <ActionableRecommendations analytics={processedData} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
