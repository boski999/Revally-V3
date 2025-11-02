'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Circle,
  Star,
  MessageSquare,
  Globe,
  Share2,
  TrendingUp,
  Clock,
  Target,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'reviews' | 'seo' | 'social' | 'engagement';
  icon: React.ReactNode;
  value?: number;
  target?: number;
  link?: string;
}

interface TodoListProps {
  reviews: any[];
  analytics: any;
}

export function TodoList({ reviews, analytics }: TodoListProps) {
  const router = useRouter();

  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const totalReviews = reviews.length;
  const responseRate = totalReviews > 0
    ? ((totalReviews - pendingReviews) / totalReviews) * 100
    : 0;

  const todos: TodoItem[] = [
    {
      id: '1',
      title: 'Respond to Pending Reviews',
      description: `${pendingReviews} review${pendingReviews !== 1 ? 's' : ''} waiting for response`,
      completed: pendingReviews === 0,
      priority: pendingReviews > 5 ? 'high' : pendingReviews > 0 ? 'medium' : 'low',
      category: 'reviews',
      icon: <MessageSquare className="w-5 h-5" />,
      value: totalReviews - pendingReviews,
      target: totalReviews,
      link: '/reviews'
    },
    {
      id: '2',
      title: 'Achieve 100% Response Rate',
      description: `Current: ${responseRate.toFixed(0)}% - Target: 100%`,
      completed: responseRate === 100,
      priority: responseRate < 80 ? 'high' : responseRate < 100 ? 'medium' : 'low',
      category: 'reviews',
      icon: <Target className="w-5 h-5" />,
      value: responseRate,
      target: 100,
      link: '/reviews'
    },
    {
      id: '3',
      title: 'Optimize Google My Business',
      description: 'Complete profile with photos, hours, and description',
      completed: false,
      priority: 'high',
      category: 'seo',
      icon: <Globe className="w-5 h-5" />,
      link: '/business'
    },
    {
      id: '4',
      title: 'Maintain 4.5+ Star Rating',
      description: `Current: ${analytics?.averageRating?.toFixed(1) || '0.0'} stars`,
      completed: (analytics?.averageRating || 0) >= 4.5,
      priority: (analytics?.averageRating || 0) < 4.0 ? 'high' : 'medium',
      category: 'reviews',
      icon: <Star className="w-5 h-5" />,
      value: analytics?.averageRating || 0,
      target: 5,
      link: '/reviews'
    },
    {
      id: '5',
      title: 'Post Weekly Social Content',
      description: 'Share updates, photos, and engage with customers',
      completed: false,
      priority: 'medium',
      category: 'social',
      icon: <Share2 className="w-5 h-5" />,
      link: '/social'
    },
    {
      id: '6',
      title: 'Improve Response Time',
      description: 'Reply within 24 hours for better engagement',
      completed: (analytics?.responseTime || 0) <= 24,
      priority: (analytics?.responseTime || 0) > 48 ? 'high' : 'medium',
      category: 'engagement',
      icon: <Clock className="w-5 h-5" />,
      value: analytics?.responseTime || 0,
      target: 24,
      link: '/reviews'
    },
    {
      id: '7',
      title: 'Generate Monthly Reports',
      description: 'Track performance and identify trends',
      completed: false,
      priority: 'low',
      category: 'reviews',
      icon: <TrendingUp className="w-5 h-5" />,
      link: '/analytics'
    },
    {
      id: '8',
      title: 'Engage with All Platforms',
      description: 'Monitor and respond across Google, Facebook, and more',
      completed: false,
      priority: 'medium',
      category: 'engagement',
      icon: <Globe className="w-5 h-5" />,
      link: '/reviews'
    }
  ];

  const completedCount = todos.filter(t => t.completed).length;
  const completionPercentage = (completedCount / todos.length) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low':
        return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      default:
        return '';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 text-white">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-500 text-white">Low Priority</Badge>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reviews':
        return '💬';
      case 'seo':
        return '🔍';
      case 'social':
        return '📱';
      case 'engagement':
        return '⚡';
      default:
        return '📋';
    }
  };

  const handleTodoClick = (todo: TodoItem) => {
    if (todo.link) {
      router.push(todo.link);
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      <Card className="border-2 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span>Overall Progress</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">
                {completedCount} of {todos.length} completed
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-3">
            Complete all tasks to achieve 100% optimization and maximize your online presence
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sortedTodos.map((todo) => (
          <Card
            key={todo.id}
            className={cn(
              "border-l-4 transition-all hover:shadow-lg cursor-pointer",
              todo.completed
                ? "border-green-500 bg-green-50/50 dark:bg-green-950/10 opacity-75"
                : getPriorityColor(todo.priority)
            )}
            onClick={() => handleTodoClick(todo)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl">{getCategoryIcon(todo.category)}</span>
                      <h3 className={cn(
                        "font-semibold text-sm sm:text-base",
                        todo.completed && "line-through text-muted-foreground"
                      )}>
                        {todo.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!todo.completed && getPriorityBadge(todo.priority)}
                      {todo.completed && (
                        <Badge className="bg-green-500 text-white">Completed</Badge>
                      )}
                    </div>
                  </div>

                  <p className={cn(
                    "text-sm text-muted-foreground",
                    todo.completed && "line-through"
                  )}>
                    {todo.description}
                  </p>

                  {todo.value !== undefined && todo.target !== undefined && !todo.completed && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>
                          {todo.value.toFixed(0)} / {todo.target}
                        </span>
                      </div>
                      <Progress
                        value={(todo.value / todo.target) * 100}
                        className="h-2"
                      />
                    </div>
                  )}

                  {!todo.completed && todo.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (todo.link) router.push(todo.link);
                      }}
                    >
                      Take Action
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <div className={cn(
                    "p-2 rounded-lg",
                    todo.completed
                      ? "bg-green-100 dark:bg-green-900/20 text-green-600"
                      : "bg-blue-100 dark:bg-blue-900/20 text-blue-600"
                  )}>
                    {todo.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {completionPercentage === 100 && (
        <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-muted-foreground">
              You've completed all optimization tasks. Keep up the great work to maintain your excellent online presence!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
