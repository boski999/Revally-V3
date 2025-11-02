'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, MessageSquare, ChartBar as BarChart3, Settings, CircleHelp as HelpCircle, Building2, Sparkles, Menu, X, ChevronDown, MapPin, LogOut, User, Star, Users, Share2, Video, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useStores } from '@/hooks/use-stores';
import { useLanguage } from '@/contexts/language-context';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConnectGMB } from '@/components/ConnectGMB';
import { SidebarSkeleton } from '@/components/skeletons/sidebar-skeleton';

export function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const { stores, activeStore, loading, switchStore } = useStores();

  // Debug: Log pathname to console
  console.log('Current pathname:', pathname);

  // Show skeleton while loading
  if (loading) {
    return <SidebarSkeleton />;
  }

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: t('nav.reviews'), href: '/reviews', icon: MessageSquare, color: 'text-green-500' },
    { name: t('nav.analytics'), href: '/analytics', icon: BarChart3, color: 'text-purple-500' },
    { name: 'AI Insights', href: '/ai-insights', icon: Sparkles, color: 'text-cyan-500' },
    { name: 'Bookings', href: '/bookings', icon: CalendarCheck, color: 'text-teal-500' },
    { name: t('nav.social'), href: '/social', icon: Share2, color: 'text-pink-500' },
    { name: t('nav.video'), href: '/video', icon: Video, color: 'text-red-500' },
    { name: t('nav.affiliation'), href: '/affiliation', icon: Users, color: 'text-pink-500' },
    { name: t('nav.business'), href: '/business', icon: Building2, color: 'text-indigo-500' },
    { name: t('nav.help'), href: '/help', icon: HelpCircle, color: 'text-orange-500' },
    { name: t('nav.settings'), href: '/settings', icon: Settings, color: 'text-orange-500' },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 p-6">
        <img 
          src="/Revally (9).png" 
          alt="Revally" 
          className="h-8 w-auto"
        />
      </div>
      
      {/* Store Selector */}
      <div className="px-4 mb-4">
        <Collapsible open={isStoreOpen} onOpenChange={setIsStoreOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200/50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <div className="p-1.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                  <Building2 className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  ) : activeStore ? (
                    <>
                      <div className="font-medium text-xs truncate">{activeStore.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{activeStore.address}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">{t('store.noStoreSelected')}</div>
                  )}
                </div>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                isStoreOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 space-y-1">
            {stores.map((store) => (
              <Button
                key={store.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start p-2 h-auto text-left",
                  store.isActive 
                    ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg shadow-purple-400/25" 
                    : "hover:bg-muted/50"
                )}
                onClick={() => {
                  switchStore(store.id);
                  setIsStoreOpen(false);
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "p-1 rounded-lg",
                    store.isActive 
                      ? "bg-white/20" 
                      : "bg-gradient-to-br from-blue-500/10 to-blue-600/10"
                  )}>
                    <Building2 className={cn(
                      "w-3 h-3",
                      store.isActive ? "text-white" : "text-blue-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs truncate">{store.name}</div>
                    <div className={cn(
                      "text-xs flex items-center gap-2",
                      store.isActive ? "text-white/70" : "text-muted-foreground"
                    )}>
                      <span>{store.totalReviews} {t('store.reviews')}</span>
                      <span>•</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        <span>{store.averageRating}</span>
                      </div>
                    </div>
                  </div>
                  {store.isActive && (
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  )}
                </div>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {/* Reviews Section */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wide">
              Reviews
            </h3>
          </div>
          {navigation.slice(0, 3).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg shadow-purple-400/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-white' : item.color
                )} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className="px-3">
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Social Networks Section */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wide">
              Social Networks
            </h3>
          </div>
          {navigation.slice(5, 7).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg shadow-purple-400/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-white' : item.color
                )} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className="px-3">
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Business Management Section */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wide">
              Business Management
            </h3>
          </div>
          {[navigation[3], navigation[4], ...navigation.slice(7)].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg shadow-purple-400/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-white' : item.color
                )} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="p-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-8 h-8 ring-2 ring-white dark:ring-gray-800 shadow-sm">
              <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                John Doe
              </div>
              <div className="text-xs text-muted-foreground truncate">
                john@example.com
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2 h-9 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border-gray-300/50 dark:border-gray-600/50"
          >
            <LogOut className="w-4 h-4" />
            {t('header.signOut')}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-3 left-3 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-72 sm:w-80 lg:w-72 bg-card/95 backdrop-blur-sm border-r border-border/50 flex flex-col transition-transform lg:translate-x-0 shadow-xl',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 h-full w-72 bg-card/95 backdrop-blur-sm border-r border-border/50 flex-col shadow-xl">
        {sidebarContent}
      </aside>
    </>
  );
}