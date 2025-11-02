import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface LibraryItem {
  id: string;
  store_id: string;
  asset_type: 'image' | 'caption' | 'hashtag_set' | 'template';
  name: string;
  content: string;
  tags: string[];
  metadata: any;
  usage_count: number;
  created_at: string;
}

export function useContentLibrary(storeId?: string) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('content_library')
        .select('*')
        .order('usage_count', { ascending: false });

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setItems((data as any) || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch library items');
      console.error('Error fetching library items:', err);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const addItem = async (itemData: Omit<LibraryItem, 'id' | 'created_at' | 'store_id' | 'usage_count'>) => {
    try {
      const supabaseAny = supabase as any;
      const { data, error: createError } = await supabaseAny
        .from('content_library')
        .insert([
          {
            store_id: storeId,
            asset_type: itemData.asset_type,
            name: itemData.name,
            content: itemData.content,
            tags: itemData.tags,
            metadata: itemData.metadata || {},
            usage_count: 0,
          }
        ])
        .select()
        .single();

      if (createError) throw createError;

      await fetchItems();
      return data;
    } catch (err) {
      console.error('Error adding library item:', err);
      throw err;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('content_library')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      await fetchItems();
    } catch (err) {
      console.error('Error deleting library item:', err);
      throw err;
    }
  };

  const incrementUsage = async (itemId: string) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      const supabaseAny = supabase as any;
      const { error: updateError } = await supabaseAny
        .from('content_library')
        .update({ usage_count: item.usage_count + 1 })
        .eq('id', itemId);

      if (updateError) throw updateError;

      await fetchItems();
    } catch (err) {
      console.error('Error incrementing usage:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    addItem,
    deleteItem,
    incrementUsage,
    refreshItems: fetchItems,
  };
}
