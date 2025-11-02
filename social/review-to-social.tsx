'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare, Share2, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  reviewer: { name: string };
  rating: number;
  content: string;
  date: string;
  platform: string;
}

interface ReviewToSocialProps {
  reviews: Review[];
  onCreatePost: (content: string, sourceReviewId: string) => void;
}

export function ReviewToSocial({ reviews, onCreatePost }: ReviewToSocialProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const positiveReviews = reviews.filter(r => r.rating >= 4).slice(0, 10);

  const generatePostContent = (review: Review) => {
    setIsGenerating(true);
    setSelectedReview(review);

    setTimeout(() => {
      const templates = [
        `⭐️ Amazing feedback from ${review.reviewer.name}!\n\n"${review.content.slice(0, 150)}..."\n\nThank you for your kind words! We're thrilled we could exceed your expectations. 💙\n\n#CustomerReview #Grateful #ThankYou`,

        `🌟 We love hearing from happy customers!\n\n${review.reviewer.name} shared: "${review.content.slice(0, 120)}..."\n\nYour feedback motivates us to keep delivering excellence every day! 🙏\n\n#CustomerLove #Appreciation #FiveStars`,

        `💫 Customer spotlight!\n\nCheck out what ${review.reviewer.name} had to say about their experience:\n\n"${review.content.slice(0, 130)}..."\n\nThis is why we do what we do! Thank you! ❤️\n\n#HappyCustomers #Review #Excellence`,
      ];

      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      setGeneratedContent(randomTemplate);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCreatePost = () => {
    if (!selectedReview || !generatedContent) return;

    onCreatePost(generatedContent, selectedReview.id);
    toast.success('Post created from review!');
    setSelectedReview(null);
    setGeneratedContent('');
  };

  return (
    <div className="space-y-6">
      {/* Review Selection */}
      <Card className="border-2 border-pink-200/50 dark:border-pink-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Turn Reviews into Social Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a positive review to automatically generate engaging social media content
          </p>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {positiveReviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No positive reviews available</p>
              </div>
            ) : (
              positiveReviews.map((review) => (
                <Card
                  key={review.id}
                  className={`cursor-pointer transition-all ${
                    selectedReview?.id === review.id
                      ? 'border-2 border-pink-500 bg-pink-50 dark:bg-pink-950/20'
                      : 'border hover:border-pink-300'
                  }`}
                  onClick={() => generatePostContent(review)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.reviewer.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {review.platform}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {review.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedReview?.id === review.id && (
                        <div className="p-1 bg-pink-500 rounded-full">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {(generatedContent || isGenerating) && (
        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Generated Social Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={8}
                  className="resize-none bg-white dark:bg-gray-800"
                  placeholder="Generated content will appear here..."
                />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedReview(null);
                      setGeneratedContent('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => selectedReview && generatePostContent(selectedReview)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col"
            onClick={() => {
              if (positiveReviews.length > 0) {
                generatePostContent(positiveReviews[0]);
              }
            }}
          >
            <Star className="w-5 h-5 mb-2 text-yellow-500" />
            <span className="font-medium">Latest 5-Star</span>
            <span className="text-xs text-muted-foreground">
              Share your most recent positive review
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col"
            onClick={() => {
              const milestone = Math.floor(reviews.length / 100) * 100;
              const content = `🎉 Milestone Alert! We've reached ${milestone}+ customer reviews!\n\nThank you to every person who took the time to share their experience. Your feedback drives us to be better every single day! 💪\n\n#Milestone #Grateful #CustomerReviews #ThankYou`;
              setGeneratedContent(content);
            }}
          >
            <MessageSquare className="w-5 h-5 mb-2 text-blue-500" />
            <span className="font-medium">Milestone Post</span>
            <span className="text-xs text-muted-foreground">
              Celebrate review milestones
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
