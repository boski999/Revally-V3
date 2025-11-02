'use client';

import { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { PerformanceOverview } from '@/components/dashboard/performance-overview';
import { UrgentReviewsAlert } from '@/components/dashboard/urgent-reviews-alert';
import { RecentReviewsCard } from '@/components/dashboard/recent-reviews-card';
import { ChartsColumn } from '@/components/dashboard/charts-column';
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useLanguage } from '@/contexts/language-context';
import { TodoList } from '@/components/dashboard/todo-list';
import { ComparisonView } from '@/components/dashboard/comparison-view';
import { ReviewHeatmap } from '@/components/dashboard/charts/review-heatmap';
import { WorkflowFunnel } from '@/components/dashboard/charts/workflow-funnel';
import { AnalyticsExport } from '@/components/dashboard/analytics-export';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReviews } from '@/hooks/use-reviews';
import { subDays, subMonths } from 'date-fns';

export default function Dashboard() {
  const { t } = useLanguage();
  const {
    analytics,
    activeStore,
    loading,
    recentReviews,
    urgentReviews,
    pendingCount,
    weeklyTrend,
    sentimentData,
    responseTimeData,
    updateReviewStatus,
    updateReviewResponse,
    refreshDashboard,
  } = useDashboardData();

  const { allReviews } = useReviews();

  const mappedReviews = useMemo(() => allReviews.map(r => ({
    id: r.id,
    reviewer: r.reviewer.name,
    rating: r.rating,
    content: r.content,
    date: r.date,
    platform: r.platform,
    status: r.status,
    sentiment: r.aiResponse.sentiment,
  })), [allReviews]);

  const comparisonData = useMemo(() => {
    const now = new Date();
    const lastWeekStart = subDays(now, 7);
    const previousWeekStart = subDays(now, 14);
    const lastMonthStart = subMonths(now, 1);
    const previousMonthStart = subMonths(now, 2);

    const lastWeekReviews = allReviews.filter(r => new Date(r.date) >= lastWeekStart);
    const previousWeekReviews = allReviews.filter(
      r => new Date(r.date) >= previousWeekStart && new Date(r.date) < lastWeekStart
    );

    const lastMonthReviews = allReviews.filter(r => new Date(r.date) >= lastMonthStart);
    const previousMonthReviews = allReviews.filter(
      r => new Date(r.date) >= previousMonthStart && new Date(r.date) < lastMonthStart
    );

    const avgRating = (reviews: typeof allReviews) =>
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      weekOverWeek: [
        {
          label: 'Total Reviews',
          current: lastWeekReviews.length,
          previous: previousWeekReviews.length,
        },
        {
          label: 'Average Rating',
          current: avgRating(lastWeekReviews),
          previous: avgRating(previousWeekReviews),
          format: (v: number) => v.toFixed(1),
        },
        {
          label: 'Response Rate',
          current: lastWeekReviews.length > 0
            ? (lastWeekReviews.filter(r => r.status !== 'pending').length / lastWeekReviews.length) * 100
            : 0,
          previous: previousWeekReviews.length > 0
            ? (previousWeekReviews.filter(r => r.status !== 'pending').length / previousWeekReviews.length) * 100
            : 0,
          format: (v: number) => `${v.toFixed(0)}%`,
        },
      ],
      monthOverMonth: [
        {
          label: 'Total Reviews',
          current: lastMonthReviews.length,
          previous: previousMonthReviews.length,
        },
        {
          label: 'Average Rating',
          current: avgRating(lastMonthReviews),
          previous: avgRating(previousMonthReviews),
          format: (v: number) => v.toFixed(1),
        },
        {
          label: 'Response Rate',
          current: lastMonthReviews.length > 0
            ? (lastMonthReviews.filter(r => r.status !== 'pending').length / lastMonthReviews.length) * 100
            : 0,
          previous: previousMonthReviews.length > 0
            ? (previousMonthReviews.filter(r => r.status !== 'pending').length / previousMonthReviews.length) * 100
            : 0,
          format: (v: number) => `${v.toFixed(0)}%`,
        },
      ],
    };
  }, [allReviews]);

  if (loading) {
    return (
      <DashboardSkeleton />
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950/50 dark:to-gray-900">
      <div className="flex items-center justify-between">
        <DashboardHeader activeStore={activeStore} />
        <AnalyticsExport reviews={mappedReviews} analytics={analytics} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <StatsGrid
            analytics={analytics}
            pendingCount={pendingCount}
          />

          <PerformanceOverview analytics={analytics} />

          <UrgentReviewsAlert
            urgentReviews={urgentReviews}
            onStatusUpdate={updateReviewStatus}
            onResponseUpdate={updateReviewResponse}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <RecentReviewsCard
              recentReviews={recentReviews}
              loading={loading}
              onStatusUpdate={updateReviewStatus}
              onResponseUpdate={updateReviewResponse}
            />

            <ChartsColumn
              sentimentData={sentimentData}
              weeklyTrend={weeklyTrend}
              responseTimeData={responseTimeData}
              reviews={mappedReviews}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <ComparisonView
            weekOverWeek={comparisonData.weekOverWeek}
            monthOverMonth={comparisonData.monthOverMonth}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <ReviewHeatmap reviews={allReviews} />
            <WorkflowFunnel reviews={allReviews} />
          </div>
        </TabsContent>

        <TabsContent value="todo" className="space-y-4 sm:space-y-6">
          <TodoList reviews={mappedReviews} analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}