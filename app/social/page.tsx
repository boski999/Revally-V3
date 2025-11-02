'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Calendar, FileText, ChartBar as BarChart3, Instagram, Facebook, Twitter, Linkedin, Plus, Upload, X, Image as ImageIcon, Camera, Grid3x3 as Grid3X3, ArrowLeft, ArrowRight, Trash2, CreditCard as Edit3, Share2, Clock, Eye, Heart, MessageCircle, Send, Wand as Wand2, Target, TrendingUp, Users, Lightbulb, Star, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';

interface PostImage {
  id: string;
  url: string;
  alt: string;
  file?: File;
}

interface SocialPost {
  id: string;
  content: string;
  images: PostImage[];
  platforms: string[];
  hashtags: string[];
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
}

interface ContentSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  platforms: string[];
  hashtags: string[];
}

const mockContentSuggestions: ContentSuggestion[] = [
  {
    id: '1',
    title: 'Weekly Review Appreciation',
    description: 'Thank customers for recent reviews',
    category: 'Customer Appreciation',
    platforms: ['Instagram', 'Facebook'],
    hashtags: ['grateful', 'customerreview', 'thankyou']
  },
  {
    id: '2',
    title: 'Milestone Celebration',
    description: 'Celebrate review milestones',
    category: 'Milestone',
    platforms: ['Instagram', 'Facebook', 'Twitter'],
    hashtags: ['milestone', 'celebration', 'grateful']
  },
  {
    id: '3',
    title: 'Behind the Scenes',
    description: 'Show your team\'s dedication',
    category: 'Team Spotlight',
    platforms: ['Instagram', 'Facebook'],
    hashtags: ['behindthescenes', 'team', 'dedication']
  }
];

export default function SocialPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(true);
  
  // Post creation state
  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState<PostImage[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram', 'Facebook']);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock posts
  const [posts, setPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: PostImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            alt: file.name,
            file
          };
          setPostImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    toast.success('Images uploaded successfully!');
  };

  const removeImage = (imageId: string) => {
    setPostImages(prev => prev.filter(img => img.id !== imageId));
    if (currentImageIndex >= postImages.length - 1) {
      setCurrentImageIndex(Math.max(0, postImages.length - 2));
    }
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      setHashtags(prev => [...prev, newHashtag.trim()]);
      setNewHashtag('');
    }
  };

  const removeHashtag = (hashtag: string) => {
    setHashtags(prev => prev.filter(h => h !== hashtag));
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast.error('Please add some content to your post');
      return;
    }

    const newPost: SocialPost = {
      id: Date.now().toString(),
      content: postContent,
      images: postImages,
      platforms: selectedPlatforms,
      hashtags,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [newPost, ...prev]);
    
    // Reset form
    setPostContent('');
    setPostImages([]);
    setHashtags([]);
    setCurrentImageIndex(0);
    
    toast.success('Post created successfully!');
    setActiveTab('posts');
  };

  const useSuggestion = (suggestion: ContentSuggestion) => {
    setPostContent(suggestion.description);
    setHashtags(suggestion.hashtags);
    setSelectedPlatforms(suggestion.platforms);
    toast.success('Content suggestion applied!');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'Facebook': return <Facebook className="w-4 h-4" />;
      case 'Twitter': return <Twitter className="w-4 h-4" />;
      case 'LinkedIn': return <Linkedin className="w-4 h-4" />;
      default: return <Share2 className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'from-pink-500 to-purple-500';
      case 'Facebook': return 'from-blue-600 to-blue-700';
      case 'Twitter': return 'from-blue-400 to-blue-500';
      case 'LinkedIn': return 'from-blue-700 to-blue-800';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Social Media Manager
          </h1>
          <p className="text-muted-foreground">
            Create, schedule, and manage your social media content across platforms
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-2 border-pink-200/50 dark:border-pink-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-lg">
                <FileText className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-xs text-muted-foreground">Posts Created</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-muted-foreground">Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200/50 dark:border-green-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">12.4K</div>
                <div className="text-xs text-muted-foreground">Total Reach</div>
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
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            {/* Create Content */}
            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 order-2 xl:order-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Post Images Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Post Images</h3>
                    <Badge variant="outline" className="text-xs">
                      {postImages.length} image{postImages.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  {/* Image Upload Area */}
                  <div className="space-y-3">
                    {postImages.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mx-auto">
                              <Upload className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">Upload Images</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Drag and drop or click to select images
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Image Carousel */}
                        <div className="relative">
                          <div className="aspect-square sm:aspect-video lg:aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={postImages[currentImageIndex]?.url}
                              alt={postImages[currentImageIndex]?.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Carousel Controls */}
                          {postImages.length > 1 && (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg"
                                onClick={() => setCurrentImageIndex(prev => 
                                  prev === 0 ? postImages.length - 1 : prev - 1
                                )}
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg"
                                onClick={() => setCurrentImageIndex(prev => 
                                  prev === postImages.length - 1 ? 0 : prev + 1
                                )}
                              >
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          {/* Image Actions */}
                          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-white/90 hover:bg-white shadow-lg"
                              onClick={() => removeImage(postImages[currentImageIndex].id)}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>

                          {/* Image Counter */}
                          {postImages.length > 1 && (
                            <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2">
                              <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                                {currentImageIndex + 1} / {postImages.length}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Image Thumbnails */}
                        {postImages.length > 1 && (
                          <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {postImages.map((image, index) => (
                              <div
                                key={image.id}
                                className={cn(
                                  "relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                                  index === currentImageIndex 
                                    ? "border-blue-500 ring-2 ring-blue-200" 
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                )}
                                onClick={() => setCurrentImageIndex(index)}
                              >
                                <img
                                  src={image.url}
                                  alt={image.alt}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add More Images Button */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files)}
                            className="hidden"
                            id="add-more-images"
                          />
                          <label htmlFor="add-more-images">
                            <Button variant="outline" size="sm" className="cursor-pointer w-full sm:w-auto" asChild>
                              <span>
                                <Plus className="w-3 h-3 mr-1" />
                                Add More Images
                              </span>
                            </Button>
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => {
                              setPostImages([]);
                              setCurrentImageIndex(0);
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Clear All
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Post Content</h3>
                  <Textarea
                    placeholder="What's happening? Share your story..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {postContent.length}/280 characters
                  </div>
                </div>

                {/* Select Platforms */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Select Platforms</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Instagram', 'Facebook', 'Twitter', 'LinkedIn'].map((platform) => {
                      const isSelected = selectedPlatforms.includes(platform);
                      const isConnected = platform === 'Instagram' || platform === 'Facebook';
                      
                      return (
                        <Button
                          key={platform}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => isConnected && togglePlatform(platform)}
                          disabled={!isConnected}
                          className={cn(
                            "h-12 sm:h-14 flex items-center gap-2 text-left justify-start",
                            isSelected && `bg-gradient-to-r ${getPlatformColor(platform)} text-white`,
                            !isConnected && "opacity-50"
                          )}
                        >
                          {getPlatformIcon(platform)}
                          <div className="text-left flex-1">
                            <div className="text-sm sm:text-base font-medium">{platform}</div>
                            <div className="text-xs sm:text-sm opacity-70">
                              {isConnected ? 'Connected' : 'Not Connected'}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Hashtags */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Hashtags</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                    {hashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="secondary" className="flex items-center gap-1 text-xs">
                        #{hashtag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => removeHashtag(hashtag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Add hashtag..."
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addHashtag()}
                      className="flex-1"
                    />
                    <Button onClick={addHashtag} disabled={!newHashtag.trim()} className="w-full sm:w-auto">
                      <Plus className="w-4 h-4" />
                      <span className="ml-2 sm:hidden">Add Hashtag</span>
                    </Button>
                  </div>
                </div>

                {/* Create Button */}
                <Button 
                  onClick={handleCreatePost}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 h-12 sm:h-14 text-sm sm:text-base"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </CardContent>
            </Card>

            {/* AI Content Suggestions */}
            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 order-1 xl:order-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  AI Content Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Generate content ideas based on your recent reviews and business performance.
                </p>
                
                <div className="space-y-3">
                  {mockContentSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm sm:text-base">{suggestion.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{suggestion.description}</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-1 order-2 sm:order-1">
                              <Badge variant="outline" className="text-xs">
                                {suggestion.category}
                              </Badge>
                              {suggestion.hashtags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <Button 
                              size="sm"
                              className="order-1 sm:order-2 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                              onClick={() => useSuggestion(suggestion)}
                            >
                              <Wand2 className="w-3 h-3 mr-1" />
                              Use
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 sm:h-14"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate More Ideas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 px-4">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-medium mb-2">No Scheduled Posts</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
                  Schedule your posts to publish at optimal times
                </p>
                <Button onClick={() => setActiveTab('create')} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium mb-2">No Posts Yet</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
                    Create your first social media post to get started
                  </p>
                  <Button onClick={() => setActiveTab('create')} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm sm:text-base leading-relaxed">{post.content}</p>
                              {post.images.length > 0 && (
                                <div className="flex gap-1 sm:gap-2 mt-2 overflow-x-auto">
                                  {post.images.slice(0, 3).map((image) => (
                                    <div key={image.id} className="w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden flex-shrink-0">
                                      <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {post.images.length > 3 && (
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs flex-shrink-0">
                                      +{post.images.length - 3}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <Badge className="self-start">
                              {post.status}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-1 order-2 sm:order-1">
                              {post.platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="text-xs flex items-center gap-1">
                                  {getPlatformIcon(platform)}
                                  <span className="hidden sm:inline">{platform}</span>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-1 order-1 sm:order-2">
                              <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                                <Edit3 className="w-3 h-3" />
                                <span className="ml-1 sm:hidden">Edit</span>
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                                <Share2 className="w-3 h-3" />
                                <span className="ml-1 sm:hidden">Share</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">45.2K</div>
                    <div className="text-xs text-muted-foreground">Impressions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200/50 dark:border-green-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                    <Heart className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3.8K</div>
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
                    <div className="text-2xl font-bold">892</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200/50 dark:border-orange-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg">
                    <Share2 className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">234</div>
                    <div className="text-xs text-muted-foreground">Shares</div>
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
                        <p className="text-xs text-muted-foreground">8 posts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-pink-600">456K</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📘</span>
                      <div>
                        <span className="font-medium text-sm">Facebook</span>
                        <p className="text-xs text-muted-foreground">12 posts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">623K</div>
                      <div className="text-xs text-muted-foreground">views</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🐦</span>
                      <div>
                        <span className="font-medium text-sm">Twitter</span>
                        <p className="text-xs text-muted-foreground">4 posts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-600">187K</div>
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
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">Behind the Scenes: Fresh Pasta Making</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>📸 Instagram</span>
                      <span>•</span>
                      <span>89K views</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">12.4%</div>
                    <div className="text-xs text-muted-foreground">engagement</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">Customer Appreciation Post</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>📘 Facebook</span>
                      <span>•</span>
                      <span>67K views</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-600">9.8%</div>
                    <div className="text-xs text-muted-foreground">engagement</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">Team Spotlight Video</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>📸 Instagram</span>
                      <span>•</span>
                      <span>54K views</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-600">8.7%</div>
                    <div className="text-xs text-muted-foreground">engagement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Performance Insights */}
          <Card className="border-2 border-indigo-200/50 dark:border-indigo-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Content Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50 dark:border-green-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-sm">Best Performing Time</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">6-8 PM</div>
                  <p className="text-xs text-muted-foreground">
                    Posts published between 6-8 PM get 40% more engagement
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm">Top Content Type</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">Behind-the-Scenes</div>
                  <p className="text-xs text-muted-foreground">
                    Food preparation videos get 3x more engagement
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-sm">Audience Growth</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">+15.2%</div>
                  <p className="text-xs text-muted-foreground">
                    Follower growth this month across all platforms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations Based on Reviews */}
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
                    <Camera className="w-3 h-3 mr-1" />
                    Generate Pasta Content
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
                    Create Team Content
                  </Button>
                </div>

                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-sm">Customer Stories</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Share positive customer experiences and testimonials
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <FileText className="w-3 h-3 mr-1" />
                    Create Story Post
                  </Button>
                </div>

                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-sm">Address Feedback</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Show improvements made based on customer suggestions
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Wand2 className="w-3 h-3 mr-1" />
                    Create Update Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Best Posting Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                    <span className="text-sm">Monday 6-8 PM</span>
                    <Badge className="bg-green-500 text-white text-xs">Best</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                    <span className="text-sm">Friday 12-2 PM</span>
                    <Badge className="bg-blue-500 text-white text-xs">Good</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                    <span className="text-sm">Sunday 10-12 AM</span>
                    <Badge className="bg-yellow-500 text-white text-xs">Average</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200/50 dark:border-orange-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Content Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50 dark:border-orange-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-orange-500" />
                      <span className="font-medium text-xs">Trending Hashtag</span>
                    </div>
                    <p className="text-sm font-medium">#FreshPasta</p>
                    <p className="text-xs text-muted-foreground">+340% engagement boost</p>
                  </div>

                  <div className="p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200/50 dark:border-pink-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Camera className="w-3 h-3 text-pink-500" />
                      <span className="font-medium text-xs">Content Type</span>
                    </div>
                    <p className="text-sm font-medium">Recipe Videos</p>
                    <p className="text-xs text-muted-foreground">2x more shares than photos</p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-3 h-3 text-blue-500" />
                      <span className="font-medium text-xs">Engagement Tip</span>
                    </div>
                    <p className="text-sm font-medium">Ask Questions</p>
                    <p className="text-xs text-muted-foreground">Posts with questions get 60% more comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Performance Chart */}
          <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Weekly Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const heights = [60, 45, 80, 95, 70, 85, 55];
                    const engagements = [2.1, 1.8, 3.2, 4.1, 2.9, 3.8, 2.3];
                    return (
                      <div key={day} className="space-y-2">
                        <div className="text-xs font-medium">{day}</div>
                        <div className="h-20 flex items-end justify-center">
                          <div 
                            className="w-6 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                            style={{ height: `${heights[index]}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{engagements[index]}K</div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Average engagement per day this week
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}