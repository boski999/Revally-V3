'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Sparkles, Play, Download, Share2, Clock, Eye, Heart, MessageCircle, Wand as Wand2, Camera, Music, Palette, Type, Zap, TrendingUp, Users, Target, Lightbulb, RefreshCw, Settings, Upload, CreditCard as Edit3, Trash2, Copy, ExternalLink, ChevronRight, Star, Filter, Search, Calendar, ChartBar as BarChart3, Globe } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

interface VideoProject {
  id: string;
  title: string;
  description: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  duration: number;
  status: 'draft' | 'generating' | 'ready' | 'published';
  thumbnail: string;
  createdAt: string;
  style: string;
  music: string;
  views?: number;
  likes?: number;
  comments?: number;
}

interface AIIdea {
  id: string;
  title: string;
  description: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'all';
  category: string;
  trending: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedViews: string;
  tags: string[];
}

const mockVideoProjects: VideoProject[] = [
  {
    id: '1',
    title: 'Behind the Scenes: Making Fresh Pasta',
    description: 'Show the authentic process of making our signature pasta from scratch',
    platform: 'instagram',
    duration: 30,
    status: 'ready',
    thumbnail: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    createdAt: '2024-01-15T10:30:00Z',
    style: 'Cinematic',
    music: 'Upbeat Italian',
    views: 12500,
    likes: 890,
    comments: 67
  },
  {
    id: '2',
    title: 'Customer Reaction: First Bite',
    description: 'Capture genuine customer reactions to our signature dishes',
    platform: 'tiktok',
    duration: 15,
    status: 'generating',
    thumbnail: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    createdAt: '2024-01-14T15:20:00Z',
    style: 'Trendy',
    music: 'Viral TikTok Beat'
  },
  {
    id: '3',
    title: 'Quick Recipe: 60-Second Tiramisu',
    description: 'Fast-paced recipe tutorial for our famous tiramisu',
    platform: 'youtube',
    duration: 60,
    status: 'draft',
    thumbnail: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg',
    createdAt: '2024-01-13T09:45:00Z',
    style: 'Educational',
    music: 'Cooking Show Theme'
  }
];

const mockAIIdeas: AIIdea[] = [
  {
    id: '1',
    title: 'Transform Negative Reviews into Positive Content',
    description: 'Create a video showing how you\'ve improved based on customer feedback. Perfect for building trust and transparency.',
    platform: 'all',
    category: 'Reputation Management',
    trending: true,
    difficulty: 'medium',
    estimatedViews: '50K-100K',
    tags: ['transparency', 'improvement', 'customer-first']
  },
  {
    id: '2',
    title: 'Staff Appreciation Reel',
    description: 'Highlight your amazing team members who make great customer experiences possible. Based on positive review mentions.',
    platform: 'instagram',
    category: 'Team Spotlight',
    trending: false,
    difficulty: 'easy',
    estimatedViews: '10K-25K',
    tags: ['team', 'behind-scenes', 'appreciation']
  },
  {
    id: '3',
    title: 'Most Loved Dishes Compilation',
    description: 'Showcase dishes that customers rave about in reviews. Use actual review quotes as text overlays.',
    platform: 'tiktok',
    category: 'Food Showcase',
    trending: true,
    difficulty: 'easy',
    estimatedViews: '75K-150K',
    tags: ['food', 'popular', 'customer-favorites']
  },
  {
    id: '4',
    title: 'Response to Viral Food Trend',
    description: 'Create your version of the trending #PastaChallenge that\'s popular on TikTok right now.',
    platform: 'tiktok',
    category: 'Trending',
    trending: true,
    difficulty: 'medium',
    estimatedViews: '100K-500K',
    tags: ['trending', 'challenge', 'viral']
  },
  {
    id: '5',
    title: 'Customer Journey Story',
    description: 'Tell the story of a customer\'s experience from reservation to dessert, based on a 5-star review.',
    platform: 'youtube',
    category: 'Storytelling',
    trending: false,
    difficulty: 'hard',
    estimatedViews: '25K-50K',
    tags: ['story', 'experience', 'journey']
  },
  {
    id: '6',
    title: 'Quick Cooking Tips',
    description: 'Share professional cooking secrets that customers ask about in reviews.',
    platform: 'youtube',
    category: 'Educational',
    trending: false,
    difficulty: 'medium',
    estimatedViews: '30K-75K',
    tags: ['tips', 'cooking', 'educational']
  }
];

const videoStyles = [
  { id: 'cinematic', name: 'Cinematic', description: 'Professional, movie-like quality' },
  { id: 'trendy', name: 'Trendy', description: 'Modern, social media optimized' },
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple aesthetic' },
  { id: 'vibrant', name: 'Vibrant', description: 'Colorful, energetic feel' },
  { id: 'vintage', name: 'Vintage', description: 'Retro, nostalgic look' },
  { id: 'educational', name: 'Educational', description: 'Clear, instructional style' }
];

const musicOptions = [
  { id: 'upbeat', name: 'Upbeat & Energetic', description: 'Perfect for food reveals and celebrations' },
  { id: 'chill', name: 'Chill & Relaxed', description: 'Great for behind-the-scenes content' },
  { id: 'trending', name: 'Trending Audio', description: 'Popular sounds that boost reach' },
  { id: 'classical', name: 'Classical & Elegant', description: 'Sophisticated dining atmosphere' },
  { id: 'acoustic', name: 'Acoustic & Warm', description: 'Cozy, intimate feeling' },
  { id: 'none', name: 'No Music', description: 'Natural sound only' }
];

export default function VideoGeneratorPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | 'youtube'>('instagram');
  const [videoProjects, setVideoProjects] = useState<VideoProject[]>(mockVideoProjects);
  const [aiIdeas, setAiIdeas] = useState<AIIdea[]>(mockAIIdeas);
  
  // Video creation form state
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    script: '',
    style: 'cinematic',
    music: 'upbeat',
    duration: [30],
    includeText: true,
    includeLogo: true,
    includeContact: false,
    autoCaption: true
  });

  // Filters
  const [ideaFilter, setIdeaFilter] = useState({
    platform: 'all',
    category: 'all',
    trending: false,
    search: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateVideo = async () => {
    if (!videoForm.title.trim() || !videoForm.description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    setGenerating(true);
    
    // Simulate AI video generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newProject: VideoProject = {
      id: Date.now().toString(),
      title: videoForm.title,
      description: videoForm.description,
      platform: selectedPlatform,
      duration: videoForm.duration[0],
      status: 'ready',
      thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      createdAt: new Date().toISOString(),
      style: videoForm.style,
      music: videoForm.music
    };

    setVideoProjects(prev => [newProject, ...prev]);
    setGenerating(false);
    setActiveTab('projects');
    
    toast.success('Video generated successfully!', {
      description: 'Your video is ready for review and publishing.'
    });
  };

  const handleUseIdea = (idea: AIIdea) => {
    setVideoForm(prev => ({
      ...prev,
      title: idea.title,
      description: idea.description,
      script: `Create engaging content about: ${idea.description}\n\nKey points to cover:\n- ${idea.tags.join('\n- ')}`
    }));
    
    if (idea.platform !== 'all') {
      setSelectedPlatform(idea.platform);
    }
    
    setActiveTab('create');
    toast.success('Idea applied to video creator!');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📸';
      case 'tiktok': return '🎵';
      case 'youtube': return '📺';
      default: return '🎬';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-purple-500';
      case 'tiktok': return 'from-black to-pink-500';
      case 'youtube': return 'from-red-500 to-red-600';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      case 'generating': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ready': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'published': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredIdeas = aiIdeas.filter(idea => {
    const matchesPlatform = ideaFilter.platform === 'all' || idea.platform === ideaFilter.platform || idea.platform === 'all';
    const matchesCategory = ideaFilter.category === 'all' || idea.category === ideaFilter.category;
    const matchesTrending = !ideaFilter.trending || idea.trending;
    const matchesSearch = ideaFilter.search === '' || 
      idea.title.toLowerCase().includes(ideaFilter.search.toLowerCase()) ||
      idea.description.toLowerCase().includes(ideaFilter.search.toLowerCase()) ||
      idea.tags.some(tag => tag.toLowerCase().includes(ideaFilter.search.toLowerCase()));

    return matchesPlatform && matchesCategory && matchesTrending && matchesSearch;
  });

  const categories = Array.from(new Set(aiIdeas.map(idea => idea.category)));

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            AI Video Generator
          </h1>
          <p className="text-muted-foreground">
            Create engaging reels, TikToks, and YouTube Shorts with AI-powered content generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                <Video className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{videoProjects.length}</div>
                <div className="text-xs text-muted-foreground">Videos Created</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200/50 dark:border-pink-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-lg">
                <Eye className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {videoProjects.reduce((sum, project) => sum + (project.views || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Views</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-muted-foreground">Engagement Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">AI Ideas</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Creation Form */}
            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Create New Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Platform Selection */}
                <div className="space-y-3">
                  <Label>Target Platform</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['instagram', 'tiktok', 'youtube'] as const).map((platform) => (
                      <Button
                        key={platform}
                        variant={selectedPlatform === platform ? "default" : "outline"}
                        onClick={() => setSelectedPlatform(platform)}
                        className={cn(
                          "h-16 flex flex-col gap-1",
                          selectedPlatform === platform && `bg-gradient-to-r ${getPlatformColor(platform)} text-white`
                        )}
                      >
                        <span className="text-lg">{getPlatformIcon(platform)}</span>
                        <span className="text-xs capitalize">{platform}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter an engaging title..."
                      value={videoForm.title}
                      onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your video will show..."
                      value={videoForm.description}
                      onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="script">Video Script (Optional)</Label>
                    <Textarea
                      id="script"
                      placeholder="AI will generate a script if left empty..."
                      value={videoForm.script}
                      onChange={(e) => setVideoForm(prev => ({ ...prev, script: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Style & Music */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Video Style</Label>
                    <Select
                      value={videoForm.style}
                      onValueChange={(value) => setVideoForm(prev => ({ ...prev, style: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {videoStyles.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            <div>
                              <div className="font-medium">{style.name}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Background Music</Label>
                    <Select
                      value={videoForm.music}
                      onValueChange={(value) => setVideoForm(prev => ({ ...prev, music: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {musicOptions.map((music) => (
                          <SelectItem key={music.id} value={music.id}>
                            <div>
                              <div className="font-medium">{music.name}</div>
                              <div className="text-xs text-muted-foreground">{music.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration Slider */}
                <div className="space-y-3">
                  <Label>Video Duration: {videoForm.duration[0]} seconds</Label>
                  <Slider
                    value={videoForm.duration}
                    onValueChange={(value) => setVideoForm(prev => ({ ...prev, duration: value }))}
                    max={selectedPlatform === 'tiktok' ? 60 : selectedPlatform === 'instagram' ? 90 : 60}
                    min={15}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15s</span>
                    <span>{selectedPlatform === 'tiktok' ? '60s' : selectedPlatform === 'instagram' ? '90s' : '60s'}</span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Text Overlays</Label>
                      <p className="text-xs text-muted-foreground">Add engaging text animations</p>
                    </div>
                    <Switch
                      checked={videoForm.includeText}
                      onCheckedChange={(checked) => setVideoForm(prev => ({ ...prev, includeText: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Logo</Label>
                      <p className="text-xs text-muted-foreground">Add your business logo</p>
                    </div>
                    <Switch
                      checked={videoForm.includeLogo}
                      onCheckedChange={(checked) => setVideoForm(prev => ({ ...prev, includeLogo: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Generate Captions</Label>
                      <p className="text-xs text-muted-foreground">AI-powered subtitles</p>
                    </div>
                    <Switch
                      checked={videoForm.autoCaption}
                      onCheckedChange={(checked) => setVideoForm(prev => ({ ...prev, autoCaption: checked }))}
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerateVideo}
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 h-12"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Video with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Video Preview</h3>
                      <p className="text-sm text-muted-foreground">
                        {videoForm.title || 'Enter a title to see preview'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Platform Overlay */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`bg-gradient-to-r ${getPlatformColor(selectedPlatform)} text-white`}>
                      {getPlatformIcon(selectedPlatform)} {selectedPlatform}
                    </Badge>
                  </div>

                  {/* Duration Overlay */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {videoForm.duration[0]}s
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Ideas Tab */}
        <TabsContent value="ideas" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Content Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search ideas..."
                    value={ideaFilter.search}
                    onChange={(e) => setIdeaFilter(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                
                <Select value={ideaFilter.platform} onValueChange={(value) => setIdeaFilter(prev => ({ ...prev, platform: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={ideaFilter.category} onValueChange={(value) => setIdeaFilter(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={ideaFilter.trending}
                    onCheckedChange={(checked) => setIdeaFilter(prev => ({ ...prev, trending: checked }))}
                  />
                  <Label className="text-sm">Trending Only</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-blue-500" />
                      </div>
                      {idea.trending && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {idea.platform === 'all' ? '🎬 All' : `${getPlatformIcon(idea.platform)} ${idea.platform}`}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-tight">{idea.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {idea.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Estimated Views:</span>
                      <span className="font-medium text-green-600">{idea.estimatedViews}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge className={cn(
                        'text-xs',
                        idea.difficulty === 'easy' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                        idea.difficulty === 'medium' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
                        idea.difficulty === 'hard' && 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      )}>
                        {idea.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {idea.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {idea.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{idea.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button 
                    onClick={() => handleUseIdea(idea)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Use This Idea
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoProjects.map((project) => (
              <Card key={project.id} className="border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all group">
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={`bg-gradient-to-r ${getPlatformColor(project.platform)} text-white`}>
                        {getPlatformIcon(project.platform)}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {project.duration}s
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1">{project.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  </div>

                  {project.views && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {project.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {project.likes?.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {project.comments}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {project.status === 'ready' && (
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                        <Share2 className="w-3 h-3 mr-1" />
                        Publish
                      </Button>
                    )}
                    {project.status === 'generating' && (
                      <Button size="sm" disabled className="flex-1">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </Button>
                    )}
                    {project.status === 'draft' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                    <Video className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-xs text-muted-foreground">Videos This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200/50 dark:border-green-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                    <Eye className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1.2M</div>
                    <div className="text-xs text-muted-foreground">Total Views</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">89K</div>
                    <div className="text-xs text-muted-foreground">Total Likes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200/50 dark:border-orange-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12.4%</div>
                    <div className="text-xs text-muted-foreground">Engagement Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-pink-200/50 dark:border-pink-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📸</span>
                      <div>
                        <span className="font-medium text-sm">Instagram</span>
                        <p className="text-xs text-muted-foreground">8 videos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-pink-600">456K</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-pink-50 dark:from-gray-950/20 dark:to-pink-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🎵</span>
                      <div>
                        <span className="font-medium text-sm">TikTok</span>
                        <p className="text-xs text-muted-foreground">12 videos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800 dark:text-gray-200">623K</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📺</span>
                      <div>
                        <span className="font-medium text-sm">YouTube</span>
                        <p className="text-xs text-muted-foreground">4 videos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">187K</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200/50 dark:border-green-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Top Performing Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {videoProjects.filter(p => p.views).slice(0, 3).map((project, index) => (
                  <div key={project.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{project.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{getPlatformIcon(project.platform)}</span>
                        <span>{project.views?.toLocaleString()} views</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">
                        {((project.likes || 0) / (project.views || 1) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">engagement</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content Ideas Based on Reviews */}
          <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-400">
                <Sparkles className="w-5 h-5" />
                AI Insights from Your Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Based on your recent reviews, here are some content ideas that could boost engagement:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-sm">Most Praised: Pasta Dishes</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    15 recent reviews mentioned your pasta. Create a pasta-making video!
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Video className="w-3 h-3 mr-1" />
                    Generate Pasta Video
                  </Button>
                </div>

                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm">Staff Appreciation</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Customers love your team! Show them behind the scenes.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Camera className="w-3 h-3 mr-1" />
                    Create Team Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}