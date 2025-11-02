'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  Video,
  Share2,
  ArrowRight,
  Clock,
  Star,
  Award,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { useStores } from '@/hooks/use-stores';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  category: 'content' | 'analytics' | 'competitive' | 'engagement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  actionItems: string[];
  priority: number;
}

export default function AIInsightsPage() {
  const { activeStore } = useStores();
  const [activeTab, setActiveTab] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const insights: Insight[] = [
    {
      id: '1',
      category: 'content',
      title: 'Leverage User-Generated Content',
      description: 'Your customers are sharing photos of their dining experience. Feature these authentic moments in your social media to build trust and increase engagement by 45%.',
      impact: 'high',
      effort: 'low',
      actionItems: [
        'Create a branded hashtag for customers to use',
        'Repost customer photos with permission (3-4 times per week)',
        'Feature a "Customer Spotlight" in your stories',
        'Offer a small incentive for tagged posts'
      ],
      priority: 1
    },
    {
      id: '2',
      category: 'content',
      title: 'Behind-the-Scenes Content Strategy',
      description: 'Show your kitchen prep, staff interactions, and daily operations. This transparency can increase follower trust by 60% and boost booking rates.',
      impact: 'high',
      effort: 'medium',
      actionItems: [
        'Film 2-3 short videos per week during prep time',
        'Introduce your chef and key team members',
        'Share the story behind signature dishes',
        'Post "day in the life" stories once a week'
      ],
      priority: 2
    },
    {
      id: '3',
      category: 'analytics',
      title: 'Peak Hour Optimization',
      description: 'Analysis shows 35% of your negative reviews mention wait times during 7-9 PM. Adjusting staffing during these hours could improve ratings by 0.5 stars.',
      impact: 'high',
      effort: 'medium',
      actionItems: [
        'Add 2 additional servers during peak hours',
        'Implement a table management system',
        'Offer pre-booking incentives for off-peak times',
        'Create a waitlist notification system'
      ],
      priority: 1
    },
    {
      id: '4',
      category: 'competitive',
      title: 'Untapped Menu Differentiation',
      description: 'Competitors are not offering plant-based options, but 23% of local searches include "vegan" or "vegetarian". This is a major opportunity.',
      impact: 'high',
      effort: 'high',
      actionItems: [
        'Add 3-4 plant-based signature dishes',
        'Highlight dietary options on Google Business',
        'Create dedicated marketing for plant-based menu',
        'Partner with local vegan influencers'
      ],
      priority: 3
    },
    {
      id: '5',
      category: 'engagement',
      title: 'Response Time Improvement',
      description: 'You respond to reviews in 48 hours on average. Top competitors respond in 12 hours. Faster responses can improve customer perception by 40%.',
      impact: 'medium',
      effort: 'low',
      actionItems: [
        'Set up review notification alerts',
        'Create response templates for common feedback',
        'Assign a team member to monitor reviews twice daily',
        'Aim for 24-hour response time initially'
      ],
      priority: 2
    },
    {
      id: '6',
      category: 'content',
      title: 'Video Content Gap',
      description: 'Your competitors post 3x more video content. Video posts get 120% more engagement than static images in your industry.',
      impact: 'high',
      effort: 'medium',
      actionItems: [
        'Create 15-30 second cooking process videos',
        'Film customer reactions and testimonials',
        'Share time-lapse of dinner service',
        'Post recipe tips and cooking tutorials'
      ],
      priority: 2
    },
    {
      id: '7',
      category: 'analytics',
      title: 'Local SEO Keyword Opportunities',
      description: 'You\'re ranking for only 15 of 50 relevant local keywords. Optimizing for "best [cuisine] in [city]" could increase visibility by 80%.',
      impact: 'high',
      effort: 'medium',
      actionItems: [
        'Update Google Business description with local keywords',
        'Add location-specific content to your website',
        'Encourage reviews mentioning specific dishes',
        'Create blog posts about local food culture'
      ],
      priority: 1
    },
    {
      id: '8',
      category: 'competitive',
      title: 'Event Marketing Opportunity',
      description: 'Competitors host monthly events. Hosting themed dining nights could attract 25-30 additional bookings per event.',
      impact: 'medium',
      effort: 'high',
      actionItems: [
        'Plan monthly themed dinner nights',
        'Create early-bird booking discounts',
        'Partner with local wineries or breweries',
        'Promote events 3 weeks in advance on all channels'
      ],
      priority: 4
    },
    {
      id: '9',
      category: 'engagement',
      title: 'Loyalty Program Potential',
      description: '68% of your customers visit 3+ times per year. A loyalty program could increase repeat visits by 30% and boost lifetime value.',
      impact: 'high',
      effort: 'high',
      actionItems: [
        'Design a points-based rewards system',
        'Offer birthday rewards and exclusive perks',
        'Create a digital loyalty card system',
        'Promote program through email and social media'
      ],
      priority: 3
    },
    {
      id: '10',
      category: 'content',
      title: 'Seasonal Content Calendar',
      description: 'Creating content around local events and seasons can increase engagement by 55%. Plan content 4 weeks ahead for maximum impact.',
      impact: 'medium',
      effort: 'low',
      actionItems: [
        'Create content calendar around holidays and events',
        'Develop seasonal menu promotions',
        'Tie content to local happenings and festivals',
        'Plan photo shoots for seasonal dishes in advance'
      ],
      priority: 3
    }
  ];

  const filteredInsights = activeTab === 'all'
    ? insights
    : insights.filter(i => i.category === activeTab);

  const impactColors = {
    high: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
  };

  const effortColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    medium: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
  };

  const categoryIcons = {
    content: Lightbulb,
    analytics: BarChart3,
    competitive: Target,
    engagement: Users
  };

  const handleGenerateInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950/50 dark:to-gray-900">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            AI Business Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized recommendations to outperform your competition
          </p>
        </div>

        <Button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25"
        >
          <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
          {isGenerating ? 'Generating...' : 'Refresh Insights'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                  High Priority Actions
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {insights.filter(i => i.impact === 'high' && i.effort === 'low').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/50">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2">
              Quick wins with major impact
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                  Total Insights
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {insights.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">
              Personalized recommendations
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                  Potential Impact
                </p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  +{insights.filter(i => i.impact === 'high').length * 15}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/50">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2">
              Estimated growth opportunity
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredInsights.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No insights yet</h3>
                <p className="text-muted-foreground">
                  Click "Refresh Insights" to generate personalized recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredInsights
              .sort((a, b) => a.priority - b.priority)
              .map((insight) => {
                const CategoryIcon = categoryIcons[insight.category];

                return (
                  <Card key={insight.id} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                            <CategoryIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg">{insight.title}</CardTitle>
                              {insight.priority <= 2 && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900">
                                  <Star className="w-3 h-3 mr-1" />
                                  Priority
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-sm">
                              {insight.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={cn('text-xs', impactColors[insight.impact])}>
                            Impact: {insight.impact}
                          </Badge>
                          <Badge className={cn('text-xs', effortColors[insight.effort])}>
                            Effort: {insight.effort}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <ChevronRight className="w-4 h-4" />
                          Action Items
                        </h4>
                        <ul className="space-y-2">
                          {insight.actionItems.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="text-muted-foreground">{action}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full mt-4 gap-2">
                          <Award className="w-4 h-4" />
                          Implement This Strategy
                          <ArrowRight className="w-4 h-4 ml-auto" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
