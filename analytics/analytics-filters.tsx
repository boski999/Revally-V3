'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Filter, X } from 'lucide-react';
import { format, subDays, subMonths, startOfYear } from 'date-fns';

export interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
    preset: string;
  };
  platforms: string[];
  sentiments: string[];
  ratingRange: {
    min: number;
    max: number;
  };
  statuses: string[];
}

interface AnalyticsFiltersProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  availablePlatforms: string[];
}

const DATE_PRESETS = [
  { label: 'Last 7 Days', value: '7d', getDates: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: 'Last 30 Days', value: '30d', getDates: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: 'Last 90 Days', value: '90d', getDates: () => ({ start: subDays(new Date(), 90), end: new Date() }) },
  { label: 'Last 6 Months', value: '6m', getDates: () => ({ start: subMonths(new Date(), 6), end: new Date() }) },
  { label: 'Year to Date', value: 'ytd', getDates: () => ({ start: startOfYear(new Date()), end: new Date() }) },
  { label: 'All Time', value: 'all', getDates: () => ({ start: subMonths(new Date(), 24), end: new Date() }) },
];

const SENTIMENTS = ['positive', 'neutral', 'negative'];
const STATUSES = ['pending', 'approved', 'published', 'rejected'];

export function AnalyticsFilters({ filters, onFiltersChange, availablePlatforms }: AnalyticsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDatePresetChange = (presetValue: string) => {
    const preset = DATE_PRESETS.find(p => p.value === presetValue);
    if (preset) {
      const dates = preset.getDates();
      onFiltersChange({
        ...filters,
        dateRange: {
          start: dates.start,
          end: dates.end,
          preset: presetValue,
        },
      });
    }
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const toggleSentiment = (sentiment: string) => {
    const newSentiments = filters.sentiments.includes(sentiment)
      ? filters.sentiments.filter(s => s !== sentiment)
      : [...filters.sentiments, sentiment];
    onFiltersChange({ ...filters, sentiments: newSentiments });
  };

  const toggleStatus = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleRatingRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value);
    onFiltersChange({
      ...filters,
      ratingRange: {
        ...filters.ratingRange,
        [type]: numValue,
      },
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateRange: {
        start: subDays(new Date(), 30),
        end: new Date(),
        preset: '30d',
      },
      platforms: [],
      sentiments: [],
      ratingRange: { min: 1, max: 5 },
      statuses: [],
    });
  };

  const activeFiltersCount =
    filters.platforms.length +
    filters.sentiments.length +
    filters.statuses.length +
    (filters.ratingRange.min !== 1 || filters.ratingRange.max !== 5 ? 1 : 0);

  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={filters.dateRange.preset} onValueChange={handleDatePresetChange}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.map((platform) => (
                  <Button
                    key={platform}
                    variant={filters.platforms.includes(platform) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sentiment</label>
              <div className="flex flex-wrap gap-2">
                {SENTIMENTS.map((sentiment) => (
                  <Button
                    key={sentiment}
                    variant={filters.sentiments.includes(sentiment) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleSentiment(sentiment)}
                    className="capitalize"
                  >
                    {sentiment}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <Button
                    key={status}
                    variant={filters.statuses.includes(status) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleStatus(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Rating Range</label>
              <div className="flex items-center gap-3">
                <Select
                  value={filters.ratingRange.min.toString()}
                  onValueChange={(v) => handleRatingRangeChange('min', v)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n}★</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">to</span>
                <Select
                  value={filters.ratingRange.max.toString()}
                  onValueChange={(v) => handleRatingRangeChange('max', v)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n}★</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
