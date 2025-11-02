'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { ReviewCard } from '@/components/review-card';
import { ReviewCardSkeleton } from '@/components/skeletons/review-card-skeleton';
import { Review } from '@/types';

interface RecentReviewsCardProps {
  recentReviews: Review[];
  loading?: boolean;
  onStatusUpdate: (reviewId: string, status: Review['status']) => void;
  onResponseUpdate: (reviewId: string, content: string) => void;
}

export function RecentReviewsCard({ 
  recentReviews, 
  loading = false,
  onStatusUpdate, 
  onResponseUpdate 
}: RecentReviewsCardProps) {
  return (
    <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-100/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          Recent Reviews
          <div className="ml-auto px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
            {recentReviews.length} new
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))
        ) : (
          recentReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onStatusUpdate={onStatusUpdate}
              onResponseUpdate={onResponseUpdate}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}