'use client';

import { useState } from 'react';
import { useReviews } from '@/hooks/use-reviews';
import { ReviewCard } from '@/components/review-card';
import { ReviewsSkeleton } from '@/components/skeletons/reviews-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, X, ChevronDown, ChevronUp, Clock, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

export default function ReviewsPage() {
  const { t } = useLanguage();
  const {
    reviews,
    allReviews,
    loading,
    filter,
    setFilter,
    updateReviewStatus,
    updateReviewResponse
  } = useReviews();
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const handleFilterChange = (key: string, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: string) => {
    if (key === 'search') {
      setFilter(prev => ({ ...prev, search: '' }));
    } else {
      setFilter(prev => ({ ...prev, [key]: 'all' }));
    }
  };

  const getActiveFilters = () => {
    const active = [];
    if (filter.platform !== 'all') active.push({ key: 'platform', value: filter.platform, label: filter.platform });
    if (filter.status !== 'all') active.push({ key: 'status', value: filter.status, label: filter.status });
    if (filter.rating !== 'all') active.push({ key: 'rating', value: filter.rating, label: `${filter.rating} stars` });
    if (filter.tag && filter.tag !== 'all') active.push({ key: 'tag', value: filter.tag, label: filter.tag });
    if (filter.search) active.push({ key: 'search', value: filter.search, label: `"${filter.search}"` });
    return active;
  };

  const handleExport = () => {
    const data = reviews.map(review => ({
      platform: review.platform,
      reviewer: review.reviewer.name,
      rating: review.rating,
      content: review.content,
      response: review.aiResponse.content,
      status: review.status,
      date: review.date,
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reviews-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get all unique tags from reviews
  const allTags = Array.from(
    new Set(allReviews.flatMap(review => review.tags))
  ).sort();
  if (loading) {
    return (
      <ReviewsSkeleton />
    );
  }

  const statusCounts = allReviews.reduce((acc, review) => {
    acc[review.status] = (acc[review.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeFilters = getActiveFilters();
  const urgentCount = allReviews.filter(r => r.isUrgent && r.status === 'pending').length;

  const statusCards = [
    {
      label: 'Total Reviews',
      count: allReviews.length,
      icon: <CheckCircle2 className="w-5 h-5" />,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Pending',
      count: statusCounts.pending || 0,
      icon: <Clock className="w-5 h-5" />,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-500/10 to-amber-500/10',
      clickable: true,
      filterKey: 'pending',
    },
    {
      label: 'Approved',
      count: statusCounts.approved || 0,
      icon: <CheckCircle2 className="w-5 h-5" />,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      clickable: true,
      filterKey: 'approved',
    },
    {
      label: 'Urgent',
      count: urgentCount,
      icon: <AlertTriangle className="w-5 h-5" />,
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-500/10 to-rose-500/10',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            {t('reviews.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('reviews.description')}
          </p>
        </div>
        <Button
          onClick={handleExport}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('reviews.export')}
        </Button>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statusCards.map((card, index) => (
          <Card
            key={card.label}
            className={cn(
              'relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group',
              card.clickable && 'hover:scale-105'
            )}
            onClick={() => card.clickable && handleFilterChange('status', card.filterKey)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', card.bgGradient)} />
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold">{card.count}</p>
                  {card.trend && (
                    <div className={cn('flex items-center gap-1 text-xs font-medium', card.trendUp ? 'text-green-600' : 'text-red-600')}>
                      {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{card.trend}</span>
                    </div>
                  )}
                </div>
                <div className={cn('p-2 sm:p-3 rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110', card.gradient)}>
                  <div className="text-white">{card.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Smart Filter Bar */}
      <div className="space-y-3">
        {/* Search and Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('reviews.searchPlaceholder')}
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 h-11 border-2 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="h-11 gap-2 border-2 transition-all duration-300 hover:scale-105"
          >
            <Filter className="w-4 h-4" />
            {t('reviews.filters')}
            {isFilterExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center animate-in slide-in-from-top duration-300">
            <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
            {activeFilters.map((activeFilter) => (
              <Badge
                key={activeFilter.key}
                variant="secondary"
                className="px-3 py-1.5 gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400 border border-blue-300/50 dark:border-blue-700/50 shadow-sm transition-all duration-300 hover:scale-105"
              >
                <span className="capitalize">{activeFilter.label}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() => removeFilter(activeFilter.key)}
                />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter({ platform: 'all', status: 'all', rating: 'all', search: '', tag: 'all' })}
              className="h-auto py-1 px-2 text-xs hover:text-red-500 transition-colors"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Collapsible Filter Panel */}
        {isFilterExpanded && (
          <Card className="border-2 animate-in slide-in-from-top duration-300">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={filter.platform} onValueChange={(value) => handleFilterChange('platform', value)}>
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue placeholder={t('reviews.platform')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reviews.allPlatforms')}</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Yelp">Yelp</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filter.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue placeholder={t('reviews.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reviews.allStatus')}</SelectItem>
                    <SelectItem value="pending">{t('reviews.pending')}</SelectItem>
                    <SelectItem value="approved">{t('reviews.approved')}</SelectItem>
                    <SelectItem value="published">{t('reviews.published')}</SelectItem>
                    <SelectItem value="rejected">{t('reviews.rejected')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filter.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue placeholder={t('reviews.rating')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reviews.allRatings')}</SelectItem>
                    <SelectItem value="5">5 {t('reviews.stars')}</SelectItem>
                    <SelectItem value="4">4 {t('reviews.stars')}</SelectItem>
                    <SelectItem value="3">3 {t('reviews.stars')}</SelectItem>
                    <SelectItem value="2">2 {t('reviews.stars')}</SelectItem>
                    <SelectItem value="1">1 {t('reviews.star')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filter.tag || 'all'} onValueChange={(value) => handleFilterChange('tag', value)}>
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue placeholder={t('reviews.tags')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reviews.allTags')}</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
              <p className="text-muted-foreground max-w-md">
                {activeFilters.length > 0
                  ? "No reviews match your current filters. Try adjusting or clearing them."
                  : "There are no reviews to display yet. Check back later for new reviews."}
              </p>
              {activeFilters.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setFilter({ platform: 'all', status: 'all', rating: 'all', search: '', tag: 'all' })}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{reviews.length}</span> of <span className="font-semibold text-foreground">{allReviews.length}</span> reviews
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                >
                  <ReviewCard
                    review={review}
                    onStatusUpdate={updateReviewStatus}
                    onResponseUpdate={updateReviewResponse}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}