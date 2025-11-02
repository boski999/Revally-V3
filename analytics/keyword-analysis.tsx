'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, TrendingUp, TrendingDown } from 'lucide-react';

interface Review {
  content: string;
  rating: number;
  sentiment: string;
}

interface KeywordAnalysisProps {
  reviews: Review[];
}

interface KeywordData {
  keyword: string;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  avgRating: number;
}

export function KeywordAnalysis({ reviews }: KeywordAnalysisProps) {
  const keywordData = useMemo(() => {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
      'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do',
      'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her',
      'its', 'our', 'their', 'this', 'that', 'these', 'those', 'very', 'so',
    ]);

    const keywordMap = new Map<string, { count: number; ratings: number[]; sentiments: string[] }>();

    reviews.forEach(review => {
      const words = review.content
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));

      words.forEach(word => {
        const existing = keywordMap.get(word) || { count: 0, ratings: [], sentiments: [] };
        existing.count++;
        existing.ratings.push(review.rating);
        existing.sentiments.push(review.sentiment);
        keywordMap.set(word, existing);
      });
    });

    const keywords: KeywordData[] = [];
    keywordMap.forEach((data, keyword) => {
      if (data.count >= 3) {
        const avgRating = data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length;
        const sentimentCounts = {
          positive: data.sentiments.filter(s => s === 'positive').length,
          neutral: data.sentiments.filter(s => s === 'neutral').length,
          negative: data.sentiments.filter(s => s === 'negative').length,
        };
        const dominantSentiment = Object.entries(sentimentCounts).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0] as 'positive' | 'neutral' | 'negative';

        keywords.push({
          keyword,
          count: data.count,
          sentiment: dominantSentiment,
          avgRating,
        });
      }
    });

    return keywords.sort((a, b) => b.count - a.count).slice(0, 30);
  }, [reviews]);

  const positiveKeywords = keywordData.filter(k => k.sentiment === 'positive').slice(0, 15);
  const negativeKeywords = keywordData.filter(k => k.sentiment === 'negative').slice(0, 15);
  const topKeywords = keywordData.slice(0, 20);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'negative':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    return sentiment === 'positive' ? TrendingUp : TrendingDown;
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-lg">
            <Hash className="w-5 h-5 text-pink-500" />
          </div>
          Keyword & Topic Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Most mentioned topics in customer reviews
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Keywords</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {topKeywords.map((kw) => {
                const SentimentIcon = getSentimentIcon(kw.sentiment);
                return (
                  <div
                    key={kw.keyword}
                    className={`px-3 py-2 rounded-lg border-2 ${getSentimentColor(kw.sentiment)} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-center gap-2">
                      <SentimentIcon className="w-3 h-3" />
                      <span className="font-medium capitalize">{kw.keyword}</span>
                      <Badge variant="outline" className="text-xs">
                        {kw.count}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs">
                        <span>★</span>
                        <span>{kw.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {topKeywords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Not enough review data to generate keyword analysis
              </div>
            )}
          </TabsContent>

          <TabsContent value="positive" className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {positiveKeywords.map((kw) => (
                <div
                  key={kw.keyword}
                  className="px-3 py-2 rounded-lg border-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-medium capitalize">{kw.keyword}</span>
                    <Badge variant="outline" className="text-xs">
                      {kw.count}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs">
                      <span>★</span>
                      <span>{kw.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {positiveKeywords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No positive keywords found with sufficient frequency
              </div>
            )}
          </TabsContent>

          <TabsContent value="negative" className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {negativeKeywords.map((kw) => (
                <div
                  key={kw.keyword}
                  className="px-3 py-2 rounded-lg border-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-3 h-3" />
                    <span className="font-medium capitalize">{kw.keyword}</span>
                    <Badge variant="outline" className="text-xs">
                      {kw.count}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs">
                      <span>★</span>
                      <span>{kw.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {negativeKeywords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No negative keywords found with sufficient frequency
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
