'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { ReviewCard } from '@/components/review-card';
import { Review } from '@/types';

interface UrgentReviewsAlertProps {
  urgentReviews: Review[];
  onStatusUpdate: (reviewId: string, status: Review['status']) => void;
  onResponseUpdate: (reviewId: string, content: string) => void;
}

export function UrgentReviewsAlert({ 
  urgentReviews, 
  onStatusUpdate, 
  onResponseUpdate 
}: UrgentReviewsAlertProps) {
  if (urgentReviews.length === 0) return null;

  return (
    <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:border-red-800 dark:from-red-950/20 dark:to-orange-950/20 shadow-lg shadow-red-100/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-400">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          Urgent Reviews Requiring Attention
          <div className="ml-auto px-2 py-1 bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
            {urgentReviews.length} urgent
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          {urgentReviews.length} review{urgentReviews.length > 1 ? 's' : ''} with low ratings need immediate response.
        </p>
        <div className="grid gap-4">
          {urgentReviews.slice(0, 2).map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onStatusUpdate={onStatusUpdate}
              onResponseUpdate={onResponseUpdate}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}