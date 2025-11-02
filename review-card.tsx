'use client';

import { Review } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Edit, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { mockSettings } from '@/lib/mock-data';
import { ReviewCardSkeleton } from '@/components/skeletons/review-card-skeleton';

interface ReviewCardProps {
  review: Review;
  onStatusUpdate: (reviewId: string, status: Review['status']) => void;
  onResponseUpdate: (reviewId: string, content: string) => void;
  loading?: boolean;
}

export function ReviewCard({ review, onStatusUpdate, onResponseUpdate, loading = false }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponse, setEditedResponse] = useState(review.aiResponse.content);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  if (loading) {
    return <ReviewCardSkeleton />;
  }

  // Get response templates from settings
  const responseTemplates = mockSettings.aiSettings.responseTemplates;

  const handleSaveEdit = () => {
    onResponseUpdate(review.id, editedResponse);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedResponse(review.aiResponse.content);
    setIsEditing(false);
  };

  const handleTemplateSelect = (template: string) => {
    setEditedResponse(template);
    setShowTemplates(false);
  };

  const getPlatformStyles = (platform: string) => {
    switch (platform) {
      case 'Google': 
        return {
          bg: 'bg-google',
          text: 'text-google',
          border: 'border-google',
          gradient: 'from-blue-500/10 to-blue-600/10'
        };
      case 'Yelp': 
        return {
          bg: 'bg-yelp',
          text: 'text-yelp',
          border: 'border-yelp',
          gradient: 'from-red-500/10 to-red-600/10'
        };
      case 'Facebook': 
        return {
          bg: 'bg-facebook',
          text: 'text-facebook',
          border: 'border-facebook',
          gradient: 'from-blue-600/10 to-blue-700/10'
        };
      case 'TripAdvisor': 
        return {
          bg: 'bg-tripadvisor',
          text: 'text-tripadvisor',
          border: 'border-tripadvisor',
          gradient: 'from-green-500/10 to-green-600/10'
        };
      default: 
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-500',
          border: 'border-gray-500',
          gradient: 'from-gray-500/10 to-gray-600/10'
        };
    }
  };

  const getStatusStyles = (status: Review['status']) => {
    switch (status) {
      case 'pending': 
        return {
          bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
          icon: <Clock className="w-4 h-4" />,
          dot: 'bg-orange-500'
        };
      case 'approved': 
        return {
          bg: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          icon: <CheckCircle2 className="w-4 h-4" />,
          dot: 'bg-green-500'
        };
      case 'published': 
        return {
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          icon: <CheckCircle2 className="w-4 h-4" />,
          dot: 'bg-blue-500'
        };
      case 'rejected': 
        return {
          bg: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          icon: <XCircle className="w-4 h-4" />,
          dot: 'bg-red-500'
        };
    }
  };

  const platformStyles = getPlatformStyles(review.platform);
  const statusStyles = getStatusStyles(review.status);

  // Truncate content for mobile
  const shouldTruncate = review.content.length > 150;
  const displayContent = !isExpanded && shouldTruncate
    ? review.content.substring(0, 150) + '...'
    : review.content;

  const getSentimentGradient = () => {
    const sentiment = review.aiResponse.sentiment;
    if (sentiment === 'positive') return 'from-green-500/5 via-transparent to-transparent';
    if (sentiment === 'negative') return 'from-red-500/5 via-transparent to-transparent';
    return 'from-blue-500/5 via-transparent to-transparent';
  };

  return (
    <Card className={cn(
      'group relative transition-all duration-300 hover:shadow-xl hover:shadow-black/10 border-l-4 overflow-hidden',
      'bg-gradient-to-br from-white/50 to-white dark:from-gray-900/50 dark:to-gray-900',
      'backdrop-blur-sm hover:scale-[1.01] hover:-translate-y-1',
      platformStyles.border,
      review.isUrgent && 'ring-2 ring-red-400 dark:ring-red-600 shadow-lg shadow-red-500/20'
    )}>
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none', getSentimentGradient())} />
      <CardHeader className="pb-3 px-4 sm:px-6 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <div className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r flex-shrink-0 shadow-sm',
              'transition-all duration-300 hover:scale-105 hover:shadow-md',
              platformStyles.gradient,
              platformStyles.text
            )}>
              {review.platform}
            </div>
            {review.isUrgent && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-bold flex-shrink-0 shadow-lg shadow-red-500/50 transition-all duration-300">
                <AlertTriangle className="w-3 h-3 sm:inline hidden" />
                <span className="hidden sm:inline">URGENT</span>
                <span className="sm:hidden">!</span>
              </div>
            )}
            <Badge variant="outline" className={cn('text-xs border-0 flex-shrink-0 shadow-sm transition-all duration-300 hover:scale-105', statusStyles.bg)}>
              <div className="flex items-center gap-1.5">
                <div className={cn('w-1.5 h-1.5 rounded-full', statusStyles.dot)} />
                <span className="sm:hidden">{statusStyles.icon}</span>
                <span className="hidden sm:flex items-center gap-1.5">
                  {statusStyles.icon}
                  <span className="capitalize font-medium">{review.status}</span>
                </span>
              </div>
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="text-xs text-muted-foreground hidden sm:block">
              {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
            </div>
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Original
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Response
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hidden sm:flex">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {/* Mobile timestamp */}
        <div className="text-xs text-muted-foreground sm:hidden mt-2">
          {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 sm:px-6 relative z-10">
        {/* Original Review */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-white dark:ring-gray-800 shadow-md transition-transform duration-300 hover:scale-110 flex-shrink-0">
              <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white">
                {review.reviewer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-sm font-semibold truncate">{review.reviewer.name}</span>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3 sm:w-3.5 sm:h-3.5',
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {review.title && (
            <h4 className="font-semibold text-sm text-foreground pl-11 leading-relaxed">{review.title}</h4>
          )}
          
          <div className="pl-11">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayContent}
            </p>
            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 h-auto p-0 text-xs text-primary hover:bg-transparent"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show more
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* AI Response */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 space-y-3 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-sm font-semibold">AI Response</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-700/50 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold flex-shrink-0 shadow-sm transition-all duration-300 hover:scale-105">
                <div className="relative w-3 h-3">
                  <svg className="w-3 h-3 transform -rotate-90">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
                    <circle
                      cx="6"
                      cy="6"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 5}`}
                      strokeDashoffset={`${2 * Math.PI * 5 * (1 - review.aiResponse.confidence)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
                <span className="hidden sm:inline">{Math.round(review.aiResponse.confidence * 100)}% confidence</span>
                <span className="sm:hidden">{Math.round(review.aiResponse.confidence * 100)}%</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="h-7 px-2 hidden sm:flex transition-all duration-300 hover:scale-110 hover:bg-purple-100 dark:hover:bg-purple-900/20"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
          
          {isEditing ? (
            <div className="space-y-3 animate-in slide-in-from-top duration-300">
              <div className="relative">
                <Textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="min-h-[80px] sm:min-h-[100px] resize-none text-sm pr-12"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu open={showTemplates} onOpenChange={setShowTemplates}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        title="Response Templates"
                      >
                        <FileText className="w-4 h-4 text-blue-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                        Response Templates
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {responseTemplates.map((template, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => handleTemplateSelect(template)}
                          className="cursor-pointer p-3 text-sm leading-relaxed whitespace-normal"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="break-words">{template}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      {responseTemplates.length === 0 && (
                        <DropdownMenuItem disabled className="text-center text-muted-foreground">
                          No templates available
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 w-full sm:w-auto shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Save Changes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-transparent dark:from-purple-900/10 dark:via-pink-900/5 dark:to-transparent p-4 rounded-lg border border-purple-200/30 dark:border-purple-700/30 shadow-sm transition-all duration-300 hover:shadow-md">
              <p className="text-sm leading-relaxed break-words text-gray-700 dark:text-gray-300">
                {review.aiResponse.content}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {review.status === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onStatusUpdate(review.id, 'approved')}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 min-h-[44px] sm:min-h-auto transition-all duration-300 hover:scale-105 hover:shadow-xl font-medium"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onStatusUpdate(review.id, 'rejected')}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/30 min-h-[44px] sm:min-h-auto transition-all duration-300 hover:scale-105 hover:shadow-xl font-medium"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}

        {/* Tags */}
        {review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
            {review.tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="secondary"
                className={cn(
                  'text-xs px-2 sm:px-2.5 py-1 font-medium shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default',
                  index % 4 === 0 && 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400 border border-blue-300/50 dark:border-blue-700/50',
                  index % 4 === 1 && 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-400 border border-green-300/50 dark:border-green-700/50',
                  index % 4 === 2 && 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-400 border border-purple-300/50 dark:border-purple-700/50',
                  index % 4 === 3 && 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-400 border border-orange-300/50 dark:border-orange-700/50'
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}