'use client';

import { useState, useEffect } from 'react';
import { Analytics } from '@/types';
import { getStoreAnalytics } from '@/lib/supabase/queries';
import { useStores } from './use-stores';
import { toast } from 'sonner';

export function useAnalytics() {
  const { activeStore } = useStores();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!activeStore) {
      setAnalytics(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getStoreAnalytics(activeStore.id);
      setAnalytics(data as Analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeStore]);

  return { analytics, loading };
}