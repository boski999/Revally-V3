'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/types';
import { getStores, updateStoreActiveStatus, subscribeToStores } from '@/lib/supabase/queries';
import { toast } from 'sonner';

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  const mapDbStoreToStore = (dbStore: any): Store => ({
    id: dbStore.id,
    name: dbStore.name,
    type: dbStore.type,
    address: dbStore.address,
    isActive: dbStore.is_active,
    totalReviews: dbStore.total_reviews,
    averageRating: dbStore.average_rating,
    lastActivity: dbStore.last_activity
  });

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await getStores();
      const mappedStores = data.map(mapDbStoreToStore);
      setStores(mappedStores);

      const active = mappedStores.find(s => s.isActive) || mappedStores[0] || null;
      setActiveStore(active);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();

    const subscription = subscribeToStores((payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        fetchStores();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const switchStore = async (storeId: string) => {
    try {
      await updateStoreActiveStatus(storeId, true);
      await fetchStores();
      toast.success('Store switched successfully');
    } catch (error) {
      console.error('Error switching store:', error);
      toast.error('Failed to switch store');
    }
  };

  return {
    stores,
    activeStore,
    loading,
    switchStore,
  };
}