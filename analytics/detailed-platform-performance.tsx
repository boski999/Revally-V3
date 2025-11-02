'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';

interface PlatformData {
  platform: string;
  count: number;
  rating: number;
  responseRate: number;
  avgResponseTime: number;
  sentimentScore: number;
  trend: number;
  benchmarkRating: number;
  benchmarkResponseTime: number;
}

interface DetailedPlatformPerformanceProps {
  platforms: PlatformData[];
  totalReviews: number;
}

export function DetailedPlatformPerformance({ platforms, totalReviews }: DetailedPlatformPerformanceProps) {
  const sortedPlatforms = [...platforms].sort((a, b) => b.count - a.count);

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          Detailed Platform Performance
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          In-depth metrics for each review platform
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedPlatforms.map((platform) => {
            const percentage = (platform.count / totalReviews) * 100;
            const ratingVsBenchmark = platform.rating - platform.benchmarkRating;
            const timeVsBenchmark = platform.avgResponseTime - platform.benchmarkResponseTime;

            return (
              <div
                key={platform.platform}
                className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{platform.platform}</h3>
                    <p className="text-sm text-muted-foreground">
                      {platform.count} reviews ({percentage.toFixed(1)}% of total)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {platform.trend > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${platform.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {platform.trend > 0 ? '+' : ''}{platform.trend}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Rating</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{platform.rating.toFixed(2)}</span>
                        <Badge variant={ratingVsBenchmark >= 0 ? 'default' : 'destructive'} className="text-xs">
                          {ratingVsBenchmark >= 0 ? '+' : ''}{ratingVsBenchmark.toFixed(2)} vs industry
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(platform.rating / 5) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{platform.responseRate.toFixed(0)}%</span>
                        <Badge variant={platform.responseRate >= 80 ? 'default' : 'secondary'}>
                          {platform.responseRate >= 80 ? 'Good' : 'Improve'}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={platform.responseRate} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Avg Response Time</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">{platform.avgResponseTime.toFixed(1)}h</span>
                      <Badge variant={timeVsBenchmark <= 0 ? 'default' : 'destructive'} className="text-xs">
                        {timeVsBenchmark <= 0 ? '' : '+'}{timeVsBenchmark.toFixed(1)}h vs industry
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Sentiment Score</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">{platform.sentimentScore.toFixed(0)}%</span>
                      <Badge variant={platform.sentimentScore >= 70 ? 'default' : 'secondary'}>
                        {platform.sentimentScore >= 70 ? 'Positive' : 'Mixed'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Review Volume</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">{platform.count}</span>
                      <span className="text-xs text-muted-foreground">
                        {percentage.toFixed(0)}% share
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
