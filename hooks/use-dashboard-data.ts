'use client';

import { useMemo, useCallback } from 'react';
import { useReviews } from '@/hooks/use-reviews';
import { useAnalytics } from '@/hooks/use-analytics';
import { useStores } from '@/hooks/use-stores';

export function useDashboardData() {
  const { reviews, allReviews, loading: reviewsLoading, updateReviewStatus, updateReviewResponse } = useReviews();
  const { analytics, loading: analyticsLoading } = useAnalytics();
  const { activeStore } = useStores();

  const loading = reviewsLoading || analyticsLoading;

  const dashboardData = useMemo(() => {
    const recentReviews = allReviews.slice(0, 3);
    const urgentReviews = allReviews.filter(r => r.isUrgent && r.status === 'pending');
    const pendingCount = allReviews.filter(r => r.status === 'pending').length;

    const positiveReviews = allReviews.filter(r => r.rating >= 4).length;
    const neutralReviews = allReviews.filter(r => r.rating === 3).length;
    const negativeReviews = allReviews.filter(r => r.rating <= 2).length;
    const total = allReviews.length || 1;

    const sentimentData = [
      { name: 'Positive', value: Math.round((positiveReviews / total) * 100), color: '#10B981' },
      { name: 'Neutral', value: Math.round((neutralReviews / total) * 100), color: '#F59E0B' },
      { name: 'Negative', value: Math.round((negativeReviews / total) * 100), color: '#EF4444' },
    ];

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentReviewsForTrend = allReviews.filter(r => new Date(r.date) >= last7Days);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayName = dayNames[date.getDay()];

      const dayReviews = recentReviewsForTrend.filter(r => {
        const reviewDate = new Date(r.date);
        return reviewDate.toDateString() === date.toDateString();
      });

      const responses = dayReviews.filter(r => r.status !== 'pending').length;

      return {
        day: dayName,
        reviews: dayReviews.length,
        responses
      };
    });

    const reviewsWithResponseTime = allReviews.filter(r => r.status !== 'pending');
    const responseTimeBuckets = {
      '0-1h': 0,
      '1-4h': 0,
      '4-12h': 0,
      '12-24h': 0,
      '24h+': 0
    };

    reviewsWithResponseTime.forEach(r => {
      const created = new Date(r.date);
      const now = new Date();
      const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 1) responseTimeBuckets['0-1h']++;
      else if (hoursDiff < 4) responseTimeBuckets['1-4h']++;
      else if (hoursDiff < 12) responseTimeBuckets['4-12h']++;
      else if (hoursDiff < 24) responseTimeBuckets['12-24h']++;
      else responseTimeBuckets['24h+']++;
    });

    const responseTimeData = Object.entries(responseTimeBuckets).map(([time, count]) => ({
      time,
      count
    }));

    return {
      recentReviews,
      urgentReviews,
      pendingCount,
      weeklyTrend,
      sentimentData,
      responseTimeData,
    };
  }, [allReviews]);

  const refreshDashboard = useCallback(async () => {
    window.location.reload();
  }, []);

  return {
    ...dashboardData,
    analytics,
    activeStore,
    loading,
    updateReviewStatus,
    updateReviewResponse,
    refreshDashboard,
  };
}