'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ChevronDown, 
  Play,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: Array<{
    title: string;
    description: string;
    completed?: boolean;
  }>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
}

const guideSections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of setting up and using Revally',
    icon: <Play className="w-5 h-5" />,
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    steps: [
      {
        title: 'Connect Your Review Platforms',
        description: 'Link your Google, Yelp, Facebook, and TripAdvisor accounts to start monitoring reviews.',
        completed: true
      },
      {
        title: 'Set Up Your Business Profile',
        description: 'Add your business information, contact details, and preferences.',
        completed: true
      },
      {
        title: 'Configure AI Response Settings',
        description: 'Customize how AI generates responses to match your brand voice.',
        completed: false
      },
      {
        title: 'Review Your First AI Response',
        description: 'Learn how to approve, edit, or reject AI-generated responses.',
        completed: false
      }
    ]
  },
  {
    id: 'managing-reviews',
    title: 'Managing Reviews',
    description: 'Master the review management workflow',
    icon: <MessageSquare className="w-5 h-5" />,
    difficulty: 'Beginner',
    estimatedTime: '15 min',
    steps: [
      {
        title: 'Understanding Review Status',
        description: 'Learn about pending, approved, published, and rejected review statuses.',
      },
      {
        title: 'Filtering and Searching Reviews',
        description: 'Use filters to find specific reviews by platform, rating, or status.',
      },
      {
        title: 'Editing AI Responses',
        description: 'Customize AI-generated responses before publishing them.',
      },
      {
        title: 'Handling Urgent Reviews',
        description: 'Quickly identify and respond to negative reviews that need immediate attention.',
      }
    ]
  },
  {
    id: 'analytics-insights',
    title: 'Analytics & Insights',
    description: 'Understand your review performance metrics',
    icon: <BarChart3 className="w-5 h-5" />,
    difficulty: 'Intermediate',
    estimatedTime: '12 min',
    steps: [
      {
        title: 'Reading Your Dashboard',
        description: 'Understand key metrics like average rating, response time, and review volume.',
      },
      {
        title: 'Platform Performance Analysis',
        description: 'Compare performance across different review platforms.',
      },
      {
        title: 'Sentiment Analysis',
        description: 'Track positive, neutral, and negative sentiment trends over time.',
      },
      {
        title: 'Exporting Reports',
        description: 'Generate and export detailed analytics reports for stakeholders.',
      }
    ]
  },
  {
    id: 'advanced-features',
    title: 'Advanced Features',
    description: 'Unlock the full potential of Revally',
    icon: <Settings className="w-5 h-5" />,
    difficulty: 'Advanced',
    estimatedTime: '20 min',
    steps: [
      {
        title: 'Custom AI Prompts',
        description: 'Create custom prompts to guide AI response generation for specific scenarios.',
      },
      {
        title: 'Multi-Location Management',
        description: 'Manage reviews across multiple business locations from a single dashboard.',
      },
      {
        title: 'Automated Workflows',
        description: 'Set up rules for automatic response approval based on confidence scores.',
      },
      {
        title: 'Integration Setup',
        description: 'Connect Revally with your existing business tools and CRM systems.',
      }
    ]
  }
];

export function UserGuide() {
  const [expandedSection, setExpandedSection] = useState<string>('getting-started');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Interactive User Guide</h2>
              <p className="text-muted-foreground">
                Follow our step-by-step guides to master Revally's features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide Sections */}
      <div className="space-y-4">
        {guideSections.map((section) => {
          const isExpanded = expandedSection === section.id;
          const completedSteps = section.steps.filter(step => step.completed).length;
          const totalSteps = section.steps.length;
          const progressPercentage = (completedSteps / totalSteps) * 100;

          return (
            <Card key={section.id} className="border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setExpandedSection(isExpanded ? '' : section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-gray-500/10 to-gray-600/10 rounded-lg">
                      {section.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getDifficultyColor(section.difficulty)}>
                      {section.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {section.estimatedTime}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                {completedSteps > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{completedSteps}/{totalSteps} completed</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {section.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                        <div className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5",
                          step.completed 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        )}>
                          {step.completed ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                        </div>
                        {!step.completed && (
                          <Button size="sm" variant="outline" className="text-xs">
                            Start
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}