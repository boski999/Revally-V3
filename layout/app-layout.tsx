'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SidebarSkeleton } from '@/components/skeletons/sidebar-skeleton';
import { HeaderSkeleton } from '@/components/skeletons/header-skeleton';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Don't show sidebar/header on special pages
  const isSpecialPage = pathname === '/onboarding' || pathname === '/setup' || pathname?.startsWith('/auth/');
  
  console.log('🔍 AppLayout - pathname:', pathname, 'isSpecialPage:', isSpecialPage);

  useEffect(() => {
    // Initial loading delay for layout
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isSpecialPage) {
    console.log('🔍 Rendering special page without layout');
    return <>{children}</>;
  }

  console.log('🔍 Rendering with full layout');
  
  if (isInitialLoading) {
    return (
      <div className="h-screen flex bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
        <SidebarSkeleton />
        <div className="flex-1 flex flex-col ml-0 lg:ml-72 min-w-0">
          <HeaderSkeleton />
          <main className="flex-1 overflow-auto relative min-h-0">
            <div className="p-4 sm:p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 lg:ml-72 min-w-0">
        <Header />
        <main className="flex-1 overflow-auto relative min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}