'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';

interface ScheduledPost {
  id: string;
  date: Date;
  time: string;
  content: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}

interface SchedulingCalendarProps {
  posts: ScheduledPost[];
  onDateClick: (date: Date) => void;
  onPostClick: (post: ScheduledPost) => void;
  optimalTimes?: { day: number; hours: number[] }[];
}

export function SchedulingCalendar({ posts, onDateClick, onPostClick, optimalTimes }: SchedulingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDay = (day: Date) => {
    return posts.filter(post => isSameDay(post.date, day));
  };

  const isOptimalDay = (day: Date) => {
    if (!optimalTimes) return false;
    const dayOfWeek = day.getDay();
    return optimalTimes.some(ot => ot.day === dayOfWeek);
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Content Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-semibold min-w-[120px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Optimal Time</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Published</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day, index) => {
              const dayPosts = getPostsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              const isOptimal = isOptimalDay(day);

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[80px] p-1 border rounded-lg cursor-pointer transition-all hover:bg-accent",
                    !isCurrentMonth && "opacity-40",
                    isTodayDate && "ring-2 ring-blue-500",
                    isOptimal && "bg-green-50 dark:bg-green-950/20"
                  )}
                  onClick={() => onDateClick(day)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-xs font-medium",
                      isTodayDate && "text-blue-600 font-bold"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {isOptimal && (
                      <Clock className="w-3 h-3 text-green-600" />
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayPosts.slice(0, 2).map(post => (
                      <div
                        key={post.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostClick(post);
                        }}
                        className={cn(
                          "text-[10px] p-1 rounded truncate",
                          post.status === 'scheduled' && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
                          post.status === 'published' && "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                          post.status === 'failed' && "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <span>{post.time}</span>
                          <span className="truncate">{post.content.slice(0, 15)}...</span>
                        </div>
                      </div>
                    ))}
                    {dayPosts.length > 2 && (
                      <div className="text-[10px] text-muted-foreground text-center">
                        +{dayPosts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
