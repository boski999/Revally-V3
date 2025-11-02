'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Star, TrendingUp, Users, MessageSquare, Sparkles, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Review {
  id: string;
  reviewer: { name: string };
  rating: number;
  content: string;
  date: string;
}

interface ContentSuggestion {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  platforms: string[];
  category: string;
  sourceReviews?: string[];
}

interface AIContentGeneratorProps {
  reviews: Review[];
  onUseContent: (suggestion: ContentSuggestion) => void;
}

export function AIContentGenerator({ reviews, onUseContent }: AIContentGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);

  const generateFromReviews = () => {
    setGenerating(true);

    setTimeout(() => {
      const positiveReviews = reviews.filter(r => r.rating >= 4);
      const recentReviews = reviews.slice(0, 10);

      const newSuggestions: ContentSuggestion[] = [
        {
          id: '1',
          title: 'Customer Appreciation Post',
          content: `🌟 Amazing feedback from our customers! "${positiveReviews[0]?.content.slice(0, 100) || 'Thank you for your wonderful support'}..." Thank you for making us better every day! `,
          hashtags: ['grateful', 'customerreview', 'thankyou', 'communitylove'],
          platforms: ['Instagram', 'Facebook'],
          category: 'appreciation',
          sourceReviews: positiveReviews.slice(0, 3).map(r => r.id)
        },
        {
          id: '2',
          title: 'Milestone Celebration',
          content: `🎉 We've reached ${reviews.length} reviews! Every piece of feedback helps us grow. Thank you to our amazing community for your continued support and trust in us!`,
          hashtags: ['milestone', 'thankyou', 'community', 'grateful'],
          platforms: ['Instagram', 'Facebook', 'Twitter'],
          category: 'milestone'
        },
        {
          id: '3',
          title: 'Team Appreciation',
          content: `👏 Our team works hard every day to deliver exceptional experiences. Recent reviews highlight our dedication to service excellence. Thank you for noticing the little things that make a big difference!`,
          hashtags: ['team', 'service', 'dedication', 'excellence'],
          platforms: ['Instagram', 'Facebook'],
          category: 'team'
        },
        {
          id: '4',
          title: 'Customer Success Story',
          content: `💫 Stories like these make our day! ${positiveReviews[1]?.reviewer.name || 'A customer'} shared their experience, and we're thrilled we could exceed expectations. This is what we're all about!`,
          hashtags: ['customerstory', 'success', 'experience', 'happy'],
          platforms: ['Instagram', 'Facebook', 'LinkedIn'],
          category: 'story'
        }
      ];

      setSuggestions(newSuggestions);
      setGenerating(false);
    }, 1500);
  };

  const generateThemed = (theme: string) => {
    setGenerating(true);

    setTimeout(() => {
      const themedSuggestions: Record<string, ContentSuggestion[]> = {
        seasonal: [
          {
            id: 's1',
            title: 'Seasonal Greeting',
            content: `🍂 As the season changes, our commitment to you remains constant. Thank you for being part of our journey. What's your favorite thing about this time of year?`,
            hashtags: ['seasonal', 'community', 'gratitude'],
            platforms: ['Instagram', 'Facebook'],
            category: 'seasonal'
          }
        ],
        promotional: [
          {
            id: 'p1',
            title: 'Value Highlight',
            content: `✨ Our customers consistently rate us ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}/5 stars! Experience the difference for yourself. We're committed to excellence in every interaction.`,
            hashtags: ['quality', 'excellence', 'service', 'trustedbymanyal'],
            platforms: ['Instagram', 'Facebook', 'Twitter'],
            category: 'promotional'
          }
        ],
        educational: [
          {
            id: 'e1',
            title: 'Behind the Scenes',
            content: `🔍 Ever wondered what goes into creating an exceptional experience? Our team focuses on attention to detail, personalized service, and continuous improvement based on your feedback.`,
            hashtags: ['behindthescenes', 'transparency', 'quality', 'teamwork'],
            platforms: ['Instagram', 'Facebook', 'LinkedIn'],
            category: 'educational'
          }
        ]
      };

      setSuggestions(themedSuggestions[theme] || []);
      setGenerating(false);
    }, 1200);
  };

  return (
    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">From Reviews</TabsTrigger>
            <TabsTrigger value="themed">Themed</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Generate content based on your recent customer reviews and feedback
              </p>

              <Button
                onClick={generateFromReviews}
                disabled={generating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate from Reviews
                  </>
                )}
              </Button>

              {suggestions.length > 0 && (
                <div className="space-y-3 mt-4">
                  {suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="border">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                              <p className="text-sm text-muted-foreground">{suggestion.content}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.category}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {suggestion.hashtags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            size="sm"
                            onClick={() => onUseContent(suggestion)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                          >
                            <Wand2 className="w-3 h-3 mr-1" />
                            Use This Content
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="themed" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => generateThemed('seasonal')}
                disabled={generating}
                className="h-auto py-3 flex-col"
              >
                <Star className="w-5 h-5 mb-1 text-orange-500" />
                <span className="text-xs">Seasonal</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => generateThemed('promotional')}
                disabled={generating}
                className="h-auto py-3 flex-col"
              >
                <TrendingUp className="w-5 h-5 mb-1 text-green-500" />
                <span className="text-xs">Promotional</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => generateThemed('educational')}
                disabled={generating}
                className="h-auto py-3 flex-col"
              >
                <Users className="w-5 h-5 mb-1 text-blue-500" />
                <span className="text-xs">Educational</span>
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                          <p className="text-sm text-muted-foreground">{suggestion.content}</p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {suggestion.hashtags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => onUseContent(suggestion)}
                          className="w-full"
                        >
                          Use This Content
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Content ideas based on trending topics and industry best practices
              </p>

              <div className="space-y-2 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Ask engaging questions</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Posts with questions get 60% more comments and engagement
                </p>
              </div>

              <div className="space-y-2 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Share success metrics</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Transparency builds trust. Share your achievements and improvements
                </p>
              </div>

              <div className="space-y-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Highlight team members</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Behind-the-scenes content humanizes your brand and builds connection
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
