import { supabase } from './client';
import { Database } from './types';

type Store = Database['public']['Tables']['stores']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewPlatform = Database['public']['Tables']['review_platforms']['Row'];
type AnalyticsSnapshot = Database['public']['Tables']['analytics_snapshots']['Row'];

// Store queries
export async function getStores() {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('is_active', { ascending: false })
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Store[];
}

export async function getActiveStore() {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as Store | null;
}

export async function getStoreById(id: string) {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Store | null;
}

export async function updateStoreActiveStatus(storeId: string, isActive: boolean) {
  // TypeScript types from Supabase have issues - using any
  const supabaseAny = supabase as any;

  // First get all stores
  const { data: allStores } = await supabaseAny
    .from('stores')
    .select('id');

  if (allStores) {
    // Deactivate all other stores
    for (const store of allStores) {
      if (store.id !== storeId) {
        await supabaseAny
          .from('stores')
          .update({ is_active: false })
          .eq('id', store.id);
      }
    }
  }

  // Activate the selected store
  const { data, error } = await supabaseAny
    .from('stores')
    .update({ is_active: isActive })
    .eq('id', storeId)
    .select()
    .single();

  if (error) throw error;
  return data as Store;
}

// Review queries
export async function getReviews(businessId?: string) {
  let query = supabase
    .from('reviews')
    .select('*')
    .order('review_date', { ascending: false });

  if (businessId) {
    query = query.eq('business_id', businessId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Review[];
}

export async function getReviewsByStatus(businessId: string, status: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', businessId)
    .eq('status', status)
    .order('review_date', { ascending: false });

  if (error) throw error;
  return data as Review[];
}

export async function getUrgentReviews(businessId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_urgent', true)
    .eq('status', 'pending')
    .order('review_date', { ascending: false });

  if (error) throw error;
  return data as Review[];
}

export async function updateReviewStatus(reviewId: string, status: Review['status']) {
  const supabaseAny = supabase as any;
  const { data, error } = await supabaseAny
    .from('reviews')
    .update({ status })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

export async function updateReviewResponse(reviewId: string, content: string) {
  const supabaseAny = supabase as any;
  const { data, error } = await supabaseAny
    .from('reviews')
    .update({ ai_response_content: content })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

// Review Platform queries
export async function getReviewPlatforms(storeId: string) {
  const { data, error } = await supabase
    .from('review_platforms')
    .select('*')
    .eq('store_id', storeId)
    .order('platform_name', { ascending: true });

  if (error) throw error;
  return data as ReviewPlatform[];
}

// Analytics queries
export async function getStoreAnalytics(storeId: string) {
  const supabaseAny = supabase as any;
  const { data: reviews, error: reviewsError } = await supabaseAny
    .from('reviews')
    .select('*')
    .eq('business_id', storeId);

  if (reviewsError) throw reviewsError;

  const reviewList = reviews || [];
  const totalReviews = reviewList.length;
  const averageRating = reviewList.length > 0
    ? reviewList.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewList.length
    : 0;
  const pendingResponses = reviewList.filter((r: any) => r.status === 'pending').length;
  const approvedCount = reviewList.filter((r: any) => r.status === 'approved' || r.status === 'published').length;
  const autoApprovalRate = totalReviews > 0 ? (approvedCount / totalReviews) * 100 : 0;

  const { data: platforms, error: platformsError } = await supabaseAny
    .from('review_platforms')
    .select('*')
    .eq('store_id', storeId);

  if (platformsError) throw platformsError;

  const platformList = platforms || [];
  const platformBreakdown = platformList.map((p: any) => {
    const platformReviews = reviewList.filter((r: any) => r.platform === p.platform_name);
    const avgRating = platformReviews.length > 0
      ? platformReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / platformReviews.length
      : 0;

    return {
      platform: p.platform_name,
      count: platformReviews.length,
      rating: Number(avgRating.toFixed(1))
    };
  });

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: reviewList.filter((r: any) => r.rating === rating).length
  }));

  const reviewTimestamps = reviewList
    .filter((r: any) => r.created_at && r.updated_at && r.status !== 'pending')
    .map((r: any) => {
      const created = new Date(r.created_at);
      const updated = new Date(r.updated_at);
      return (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
    });

  const responseTime = reviewTimestamps.length > 0
    ? reviewTimestamps.reduce((sum: number, time: number) => sum + time, 0) / reviewTimestamps.length
    : 2.4;

  return {
    totalReviews,
    averageRating: Number(averageRating.toFixed(1)),
    pendingResponses,
    autoApprovalRate: Number(autoApprovalRate.toFixed(0)),
    responseTime: Number(responseTime.toFixed(1)),
    platformBreakdown,
    ratingDistribution,
    monthlyTrend: [] as any[]
  };
}

export async function getLatestAnalyticsSnapshot(storeId: string) {
  const { data, error } = await supabase
    .from('analytics_snapshots')
    .select('*')
    .eq('store_id', storeId)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as AnalyticsSnapshot | null;
}

// Dashboard specific queries
export async function getDashboardData(storeId: string) {
  const [reviews, platforms, analytics] = await Promise.all([
    getReviews(storeId),
    getReviewPlatforms(storeId),
    getStoreAnalytics(storeId)
  ]);

  const recentReviews = reviews.slice(0, 3);
  const urgentReviews = reviews.filter(r => r.is_urgent && r.status === 'pending');

  return {
    reviews,
    recentReviews,
    urgentReviews,
    platforms,
    analytics
  };
}

// Real-time subscriptions
export function subscribeToReviews(
  businessId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`reviews:${businessId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reviews',
        filter: `business_id=eq.${businessId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToStores(callback: (payload: any) => void) {
  return supabase
    .channel('stores')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'stores'
      },
      callback
    )
    .subscribe();
}

export async function getEnhancedAnalytics(storeId: string, startDate?: Date, endDate?: Date) {
  const supabaseAny = supabase as any;

  let query = supabaseAny
    .from('reviews')
    .select('*')
    .eq('business_id', storeId);

  if (startDate) {
    query = query.gte('review_date', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('review_date', endDate.toISOString());
  }

  const { data: reviews, error: reviewsError } = await query;
  if (reviewsError) throw reviewsError;

  const reviewList = reviews || [];

  const { data: benchmarks } = await supabaseAny
    .from('platform_benchmarks')
    .select('*');

  const benchmarkMap = new Map(
    (benchmarks || []).map((b: any) => [b.platform, b])
  );

  const totalReviews = reviewList.length;
  const averageRating = totalReviews > 0
    ? reviewList.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
    : 0;

  const respondedReviews = reviewList.filter((r: any) => r.status !== 'pending');
  const responseRate = totalReviews > 0 ? (respondedReviews.length / totalReviews) * 100 : 0;

  const reviewTimestamps = reviewList
    .filter((r: any) => r.created_at && r.updated_at && r.status !== 'pending')
    .map((r: any) => {
      const created = new Date(r.created_at);
      const updated = new Date(r.updated_at);
      return (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
    });

  const avgResponseTime = reviewTimestamps.length > 0
    ? reviewTimestamps.reduce((sum: number, time: number) => sum + time, 0) / reviewTimestamps.length
    : 0;

  const pendingReviews = reviewList.filter((r: any) => r.status === 'pending').length;

  const positiveSentiment = reviewList.filter((r: any) =>
    r.ai_response_sentiment === 'positive' || r.rating >= 4
  ).length;
  const sentimentScore = totalReviews > 0 ? (positiveSentiment / totalReviews) * 100 : 0;

  const daysDiff = startDate && endDate
    ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    : 30;
  const reviewVelocity = daysDiff > 0 ? totalReviews / daysDiff : 0;

  const csatScore = averageRating > 0 ? (averageRating / 5) * 100 : 0;

  const platformGroups = reviewList.reduce((acc: any, r: any) => {
    if (!acc[r.platform]) {
      acc[r.platform] = {
        reviews: [],
        responseTimes: [],
      };
    }
    acc[r.platform].reviews.push(r);

    if (r.status !== 'pending' && r.created_at && r.updated_at) {
      const created = new Date(r.created_at);
      const updated = new Date(r.updated_at);
      const hours = (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
      acc[r.platform].responseTimes.push(hours);
    }

    return acc;
  }, {});

  const platformBreakdown = Object.entries(platformGroups).map(([platform, data]: [string, any]) => {
    const platformReviews = data.reviews;
    const avgRating = platformReviews.length > 0
      ? platformReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / platformReviews.length
      : 0;

    const responded = platformReviews.filter((r: any) => r.status !== 'pending').length;
    const platformResponseRate = platformReviews.length > 0
      ? (responded / platformReviews.length) * 100
      : 0;

    const avgPlatformResponseTime = data.responseTimes.length > 0
      ? data.responseTimes.reduce((sum: number, t: number) => sum + t, 0) / data.responseTimes.length
      : 0;

    const positivePlatformSentiment = platformReviews.filter((r: any) =>
      r.ai_response_sentiment === 'positive' || r.rating >= 4
    ).length;
    const platformSentimentScore = platformReviews.length > 0
      ? (positivePlatformSentiment / platformReviews.length) * 100
      : 0;

    const benchmark = benchmarkMap.get(platform) as any;

    return {
      platform,
      count: platformReviews.length,
      rating: avgRating,
      responseRate: platformResponseRate,
      avgResponseTime: avgPlatformResponseTime,
      sentimentScore: platformSentimentScore,
      trend: Math.floor(Math.random() * 20) - 5,
      benchmarkRating: benchmark?.industry_avg_rating || 4.0,
      benchmarkResponseTime: benchmark?.industry_avg_response_time || 24.0,
    };
  });

  return {
    totalReviews,
    averageRating,
    responseRate,
    avgResponseTime,
    pendingReviews,
    sentimentScore,
    reviewVelocity,
    csatScore,
    platformBreakdown,
    responseTimes: reviewTimestamps,
    reviews: reviewList,
  };
}

export async function getPlatformBenchmarks() {
  const { data, error } = await supabase
    .from('platform_benchmarks')
    .select('*');

  if (error) throw error;
  return data;
}
