'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function SidebarSkeleton() {
  return (
    <aside className="fixed top-0 left-0 z-50 h-full w-72 bg-card/95 backdrop-blur-sm border-r border-border/50 flex flex-col shadow-xl">
      {/* Logo Skeleton */}
      <div className="flex items-center gap-3 p-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-6 w-20" />
      </div>
      
      {/* Store Selector Skeleton */}
      <div className="px-4 mb-4">
        <div className="w-full p-2 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      {/* Navigation Skeleton */}
      <nav className="flex-1 px-4 space-y-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </nav>
      
      {/* Bottom Section Skeleton */}
      <div className="p-4">
        <div className="space-y-4">
          {/* GMB Connection Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          
          {/* Live Monitoring Skeleton */}
          <div className="p-4 rounded-xl border">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      </div>
      
      {/* User Section Skeleton */}
      <div className="p-4 border-t border-border/50">
        <div className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </aside>
  );
}