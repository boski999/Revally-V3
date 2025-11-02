'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  Video,
  BookOpen,
  Star,
  Users,
  Zap,
  BarChart3,
  Settings,
  MessageSquare
} from 'lucide-react';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
}

const videoTutorials: VideoTutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Revally',
    description: 'A complete walkthrough of setting up your account and connecting your first review platform.',
    duration: '8:30',
    difficulty: 'Beginner',
    category: 'Setup',
    thumbnail: '/api/placeholder/400/225',
    icon: <Play className="w-5 h-5" />,
    isComingSoon: true
  },
  {
    id: 'ai-responses',
    title: 'Understanding AI Response Generation',
    description: 'Learn how our AI creates personalized responses and how to customize them for your brand.',
    duration: '12:15',
    difficulty: 'Beginner',
    category: 'AI Features',
    thumbnail: '/api/placeholder/400/225',
    icon: <Zap className="w-5 h-5" />,
    isComingSoon: true
  },
  {
    id: 'review-management',
    title: 'Managing Reviews Efficiently',
    description: 'Master the review workflow from approval to publishing across multiple platforms.',
    duration: '15:45',
    difficulty: 'Intermediate',
    category: 'Workflow',
    thumbnail: '/api/placeholder/400/225',
    icon: <MessageSquare className="w-5 h-5" />,
    isComingSoon: true
  },
  {
    id: 'analytics-deep-dive',
    title: 'Analytics and Reporting Deep Dive',
    description: 'Understand your review metrics, sentiment analysis, and how to generate reports.',
    duration: '18:20',
    difficulty: 'Intermediate',
    category: 'Analytics',
    thumbnail: '/api/placeholder/400/225',
    icon: <BarChart3 className="w-5 h-5" />,
    isComingSoon: true
  },
  {
    id: 'multi-location',
    title: 'Multi-Location Management',
    description: 'Learn how to manage reviews across multiple business locations effectively.',
    duration: '14:30',
    difficulty: 'Advanced',
    category: 'Advanced',
    thumbnail: '/api/placeholder/400/225',
    icon: <Users className="w-5 h-5" />,
    isComingSoon: true
  },
  {
    id: 'custom-prompts',
    title: 'Creating Custom AI Prompts',
    description: 'Advanced techniques for creating custom prompts to guide AI response generation.',
    duration: '22:10',
    difficulty: 'Advanced',
    category: 'Advanced',
    thumbnail: '/api/placeholder/400/225',
    icon: <Settings className="w-5 h-5" />,
    isComingSoon: true
  }
];

export function VideoTutorials() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Setup': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'AI Features': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Workflow': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Analytics': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
              <Video className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Video Tutorials</h2>
              <p className="text-muted-foreground">
                Visual learning resources to help you master Revally
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="border-2 border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-lg">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">
                Video Tutorials Coming Soon!
              </h3>
              <p className="text-amber-700 dark:text-amber-300">
                We're currently producing high-quality video tutorials to help you get the most out of Revally. 
                Check back soon for comprehensive visual guides.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {videoTutorials.map((video) => (
          <Card key={video.id} className="border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all group">
            <CardHeader className="p-0">
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg">
                    {video.icon}
                  </div>
                </div>
                {video.isComingSoon && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-amber-500 text-white">
                      Coming Soon
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-3">
                {/* Title and Description */}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Badge className={getCategoryColor(video.category)}>
                    {video.category}
                  </Badge>
                  <Badge className={getDifficultyColor(video.difficulty)}>
                    {video.difficulty}
                  </Badge>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full min-h-[44px] sm:min-h-auto text-sm" 
                  variant={video.isComingSoon ? "outline" : "default"}
                  disabled={video.isComingSoon}
                >
                  {video.isComingSoon ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Coming Soon
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for Future Video Player */}
      <div className="hidden">
        {/* This space is reserved for the video player component */}
        {/* Will be implemented when videos are ready */}
        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-6">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Video Player Placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}