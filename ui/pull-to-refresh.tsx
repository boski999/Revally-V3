'use client';

import { ReactNode } from 'react';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  maxPullDistance?: number;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  maxPullDistance = 150,
}: PullToRefreshProps) {
  const { isRefreshing, pullDistance, setContainerRef } = usePullToRefresh({
    onRefresh,
    threshold,
    maxPullDistance,
  });

  const rotation = (pullDistance / maxPullDistance) * 360;
  const opacity = Math.min(pullDistance / threshold, 1);
  const scale = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={setContainerRef} className="relative overflow-auto">
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50 transition-all duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
          opacity: opacity,
        }}
      >
        <div
          className="bg-background border rounded-full p-3 shadow-lg"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
          <RefreshCw
            className={`w-5 h-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </div>
      </div>

      <div
        style={{
          transform: isRefreshing
            ? 'translateY(60px)'
            : `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.2s ease-out' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
