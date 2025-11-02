'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Zap, CircleCheck as CheckCircle2, Star } from 'lucide-react';
import { Analytics } from '@/types';

interface PerformanceOverviewProps {
  analytics: Analytics | null;
}

export function PerformanceOverview({ analytics }: PerformanceOverviewProps) {
  if (!analytics) return null;

  return (
    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 shadow-lg shadow-purple-100/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {analytics.platformBreakdown.map((platform, index) => {
            const colors = ['text-blue-500', 'text-red-500', 'text-blue-600', 'text-green-500'];
            const bgColors = ['bg-blue-500', 'bg-red-500', 'bg-blue-600', 'bg-green-500'];
            return (
              <div key={platform.platform} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-sm font-medium">{platform.platform}</span>
                    <div className="text-xs text-muted-foreground">
                      {platform.count} reviews
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{platform.rating.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <div>
                <span className="text-sm font-medium">Response Time</span>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
            </div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {analytics.responseTime.toFixed(1)}h
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <div>
                <span className="text-sm font-medium">AI Accuracy</span>
                <div className="text-xs text-muted-foreground">Approval rate</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">94%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}