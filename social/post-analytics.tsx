'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Heart, MessageCircle, Share2, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PostAnalytics {
  postId: string;
  platforms: {
    name: string;
    impressions: number;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagementRate: number;
  }[];
  totalEngagement: number;
  bestPerformingPlatform: string;
  trend: 'up' | 'down' | 'stable';
  historicalData: { date: string; engagement: number }[];
}

interface PostAnalyticsProps {
  analytics: PostAnalytics;
}

export function PostAnalytics({ analytics }: PostAnalyticsProps) {
  const totalImpressions = analytics.platforms.reduce((sum, p) => sum + p.impressions, 0);
  const totalReach = analytics.platforms.reduce((sum, p) => sum + p.reach, 0);
  const totalLikes = analytics.platforms.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = analytics.platforms.reduce((sum, p) => sum + p.comments, 0);
  const totalShares = analytics.platforms.reduce((sum, p) => sum + p.shares, 0);
  const avgEngagementRate = analytics.platforms.reduce((sum, p) => sum + p.engagementRate, 0) / analytics.platforms.length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Impressions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200/50 dark:border-pink-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-lg">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Likes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalComments.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200/50 dark:border-green-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                <Share2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalShares.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Shares</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Engagement Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.historicalData}>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.platforms.map((platform) => (
            <div key={platform.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{platform.name}</span>
                  {platform.name === analytics.bestPerformingPlatform && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                      Best
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-bold">{platform.engagementRate.toFixed(1)}%</span>
                  {analytics.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : analytics.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : null}
                </div>
              </div>

              <Progress value={platform.engagementRate} className="h-2" />

              <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {platform.impressions.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {platform.likes.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {platform.comments.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  {platform.shares.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200/50 dark:border-purple-800/50">
        <CardHeader>
          <CardTitle className="text-purple-800 dark:text-purple-400">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
            <p>
              <span className="font-semibold">{analytics.bestPerformingPlatform}</span> generated the highest engagement rate at{' '}
              {analytics.platforms.find(p => p.name === analytics.bestPerformingPlatform)?.engagementRate.toFixed(1)}%
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
            <p>
              Average engagement rate of <span className="font-semibold">{avgEngagementRate.toFixed(1)}%</span> across all platforms
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
            <p>
              Total reach of <span className="font-semibold">{totalReach.toLocaleString()}</span> unique users
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
