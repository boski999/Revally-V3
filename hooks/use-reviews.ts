'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { getReviews, updateReviewStatus as updateStatus, updateReviewResponse as updateResponse, subscribeToReviews } from '@/lib/supabase/queries';
import { useStores } from './use-stores';
import { toast } from 'sonner';

export function useReviews() {
  const { activeStore } = useStores();
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    platform: 'all',
    status: 'all',
    rating: 'all',
    search: '',
    tag: 'all',
  });

  const mapDbReviewToReview = (dbReview: any): Review => ({
    id: dbReview.id,
    businessId: dbReview.business_id,
    platform: dbReview.platform,
    reviewer: {
      name: dbReview.reviewer_name,
      avatar: dbReview.reviewer_avatar
    },
    rating: dbReview.rating,
    title: dbReview.title,
    content: dbReview.content,
    date: dbReview.review_date,
    aiResponse: {
      content: dbReview.ai_response_content,
      confidence: dbReview.ai_response_confidence,
      sentiment: dbReview.ai_response_sentiment
    },
    status: dbReview.status,
    isUrgent: dbReview.is_urgent,
    tags: dbReview.tags || []
  });

  const fetchReviews = async () => {
    if (!activeStore) {
      setAllReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getReviews(activeStore.id);
      const mappedReviews = data.map(mapDbReviewToReview);
      setAllReviews(mappedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    if (!activeStore) return;

    const subscription = subscribeToReviews(activeStore.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        const newReview = mapDbReviewToReview(payload.new);
        setAllReviews(prev => [newReview, ...prev]);
        if (newReview.isUrgent) {
          toast.error('New urgent review received!', {
            description: `${newReview.reviewer.name} left a ${newReview.rating}-star review`
          });
        }
      } else if (payload.eventType === 'UPDATE') {
        const updatedReview = mapDbReviewToReview(payload.new);
        setAllReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
      } else if (payload.eventType === 'DELETE') {
        setAllReviews(prev => prev.filter(r => r.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [activeStore]);

  const filteredReviews = allReviews.filter((review) => {
    const matchesPlatform = filter.platform === 'all' || review.platform === filter.platform;
    const matchesStatus = filter.status === 'all' || review.status === filter.status;
    const matchesRating = filter.rating === 'all' || review.rating.toString() === filter.rating;
    const matchesTag = filter.tag === 'all' || review.tags.includes(filter.tag);
    const matchesSearch = filter.search === '' ||
      review.content.toLowerCase().includes(filter.search.toLowerCase()) ||
      review.reviewer.name.toLowerCase().includes(filter.search.toLowerCase());

    return matchesPlatform && matchesStatus && matchesRating && matchesTag && matchesSearch;
  });

  const updateReviewStatus = async (reviewId: string, status: Review['status']) => {
    try {
      const updated = await updateStatus(reviewId, status);
      const mappedReview = mapDbReviewToReview(updated);
      setAllReviews(prev => prev.map(review =>
        review.id === reviewId ? mappedReview : review
      ));
      toast.success(`Review ${status} successfully`);
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    }
  };

  const updateReviewResponse = async (reviewId: string, content: string) => {
    try {
      const updated = await updateResponse(reviewId, content);
      const mappedReview = mapDbReviewToReview(updated);
      setAllReviews(prev => prev.map(review =>
        review.id === reviewId ? mappedReview : review
      ));
      toast.success('Response updated successfully');
    } catch (error) {
      console.error('Error updating review response:', error);
      toast.error('Failed to update response');
    }
  };

  return {
    reviews: filteredReviews,
    allReviews,
    loading,
    filter,
    setFilter,
    updateReviewStatus,
    updateReviewResponse,
  };
}