'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  items: T[];
  itemsPerPage?: number;
  threshold?: number;
}

export function useInfiniteScroll<T>({
  items,
  itemsPerPage = 10,
  threshold = 0.8,
}: UseInfiniteScrollOptions<T>) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    const newItems = items.slice(startIndex, endIndex);

    setDisplayedItems(newItems);
    setHasMore(endIndex < items.length);
  }, [items, page, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (hasMore && !observerRef.current) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  const setObserverTarget = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold }
      );

      observerRef.current.observe(node);
      loadingRef.current = node;
    },
    [hasMore, loadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const reset = useCallback(() => {
    setPage(1);
    setDisplayedItems(items.slice(0, itemsPerPage));
    setHasMore(itemsPerPage < items.length);
  }, [items, itemsPerPage]);

  return {
    displayedItems,
    hasMore,
    loadMore,
    setObserverTarget,
    reset,
    isLoading: false,
  };
}
