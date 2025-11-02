'use client';

import { useEffect, useRef } from 'react';

interface UseAutoRefreshOptions {
  onRefresh: () => Promise<void>;
  enabled: boolean;
  interval: number;
}

export function useAutoRefresh({
  onRefresh,
  enabled,
  interval,
}: UseAutoRefreshOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    if (!enabled || interval <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const performRefresh = async () => {
      if (isRefreshingRef.current) return;

      isRefreshingRef.current = true;
      try {
        await onRefresh();
      } finally {
        isRefreshingRef.current = false;
      }
    };

    intervalRef.current = setInterval(performRefresh, interval * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, onRefresh]);

  return {
    isEnabled: enabled,
  };
}
