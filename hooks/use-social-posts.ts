import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface SocialPost {
  id: string;
  store_id: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_for?: string;
  published_at?: string;
  platforms: string[];
  hashtags: string[];
  engagement_metrics: any;
  ai_generated: boolean;
  source_review_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  images?: {
    id: string;
    image_url: string;
    alt_text: string;
    order_index: number;
  }[];
}

export function useSocialPosts(storeId?: string) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('social_posts')
        .select(`
          *,
          images:social_post_images(*)
        `)
        .order('created_at', { ascending: false });

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setPosts((data as any) || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const createPost = async (postData: Partial<SocialPost>) => {
    try {
      const supabaseAny = supabase as any;
      const { data, error: createError } = await supabaseAny
        .from('social_posts')
        .insert([
          {
            store_id: storeId,
            content: postData.content || '',
            status: postData.status || 'draft',
            platforms: postData.platforms || [],
            hashtags: postData.hashtags || [],
            ai_generated: postData.ai_generated || false,
            source_review_id: postData.source_review_id,
            created_by: 'current_user',
            scheduled_for: postData.scheduled_for,
          }
        ])
        .select()
        .single();

      if (createError) throw createError;

      await fetchPosts();
      return data;
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const updatePost = async (postId: string, updates: Partial<SocialPost>) => {
    try {
      const supabaseAny = supabase as any;
      const { data, error: updateError } = await supabaseAny
        .from('social_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchPosts();
      return data;
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', postId);

      if (deleteError) throw deleteError;

      await fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  const addPostImage = async (postId: string, imageUrl: string, altText?: string, orderIndex?: number) => {
    try {
      const supabaseAny = supabase as any;
      const { data, error: imageError } = await supabaseAny
        .from('social_post_images')
        .insert([
          {
            post_id: postId,
            image_url: imageUrl,
            alt_text: altText || '',
            order_index: orderIndex || 0,
          }
        ])
        .select()
        .single();

      if (imageError) throw imageError;

      await fetchPosts();
      return data;
    } catch (err) {
      console.error('Error adding post image:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('social_posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_posts',
          filter: storeId ? `store_id=eq.${storeId}` : undefined,
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts, storeId]);

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    addPostImage,
    refreshPosts: fetchPosts,
  };
}
