'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: typeof LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  tooltip?: string;
}

const colorVariants = {
  blue: {
    icon: 'text-blue-500',
    gradient: 'from-blue-500/10 to-blue-600/10',
    border: 'border-blue-200/50 dark:border-blue-800/50',
    trend: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    icon: 'text-green-500',
    gradient: 'from-green-500/10 to-green-600/10',
    border: 'border-green-200/50 dark:border-green-800/50',
    trend: 'text-green-600 dark:text-green-400'
  },
  purple: {
    icon: 'text-purple-500',
    gradient: 'from-purple-500/10 to-purple-600/10',
    border: 'border-purple-200/50 dark:border-purple-800/50',
    trend: 'text-purple-600 dark:text-purple-400'
  },
  orange: {
    icon: 'text-orange-500',
    gradient: 'from-orange-500/10 to-orange-600/10',
    border: 'border-orange-200/50 dark:border-orange-800/50',
    trend: 'text-orange-600 dark:text-orange-400'
  },
  pink: {
    icon: 'text-pink-500',
    gradient: 'from-pink-500/10 to-pink-600/10',
    border: 'border-pink-200/50 dark:border-pink-800/50',
    trend: 'text-pink-600 dark:text-pink-400'
  }
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  color = 'blue',
  tooltip
}: StatsCardProps) {
  const colors = colorVariants[color];

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-lg hover:shadow-black/5 border-2',
      colors.border,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            {title}
          </CardTitle>
          {tooltip && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-pointer flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full transition-colors"
                  aria-label="More information"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="max-w-xs" align="start">
                <p className="text-sm">{tooltip}</p>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className={cn(
          'p-1.5 sm:p-2 rounded-lg bg-gradient-to-br flex-shrink-0',
          colors.gradient
        )}>
          <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', colors.icon)} />
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="text-2xl sm:text-3xl font-bold truncate">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex flex-col sm:flex-row sm:items-center mt-3 gap-1 sm:gap-0">
            <div className={cn(
              'flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit',
              trend.isPositive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}>
              <span className="mr-1">
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
            <span className="text-xs text-muted-foreground sm:ml-2">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}