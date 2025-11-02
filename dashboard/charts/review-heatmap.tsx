'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface HeatmapData {
  day: number;
  hour: number;
  count: number;
}

interface ReviewHeatmapProps {
  reviews: Array<{
    date: string;
  }>;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function ReviewHeatmap({ reviews }: ReviewHeatmapProps) {
  const heatmapData = useMemo(() => {
    const dataMap = new Map<string, number>();

    reviews.forEach((review) => {
      const date = new Date(review.date);
      const day = date.getDay();
      const hour = date.getHours();
      const key = `${day}-${hour}`;
      dataMap.set(key, (dataMap.get(key) || 0) + 1);
    });

    const maxCount = Math.max(...Array.from(dataMap.values()), 1);

    return {
      data: Array.from(dataMap.entries()).map(([key, count]) => {
        const [day, hour] = key.split('-').map(Number);
        return {
          day,
          hour,
          count,
          intensity: count / maxCount,
        };
      }),
      maxCount,
    };
  }, [reviews]);

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (intensity < 0.25) return 'bg-blue-200 dark:bg-blue-900';
    if (intensity < 0.5) return 'bg-blue-400 dark:bg-blue-700';
    if (intensity < 0.75) return 'bg-blue-600 dark:bg-blue-600';
    return 'bg-blue-800 dark:bg-blue-500';
  };

  const getCellData = (day: number, hour: number) => {
    return heatmapData.data.find((d) => d.day === day && d.hour === hour);
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          Review Activity Heatmap
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Busiest times for receiving reviews
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex gap-1 mb-2">
              <div className="w-12" />
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="flex-1 text-center text-xs font-medium text-muted-foreground min-w-[40px]"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {HOURS.map((hour) => (
                <div key={hour} className="flex gap-1 items-center">
                  <div className="w-12 text-xs text-muted-foreground text-right pr-2">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {DAYS.map((_, dayIndex) => {
                    const cellData = getCellData(dayIndex, hour);
                    const intensity = cellData?.intensity || 0;
                    const count = cellData?.count || 0;

                    return (
                      <div
                        key={`${dayIndex}-${hour}`}
                        className={`flex-1 min-w-[40px] h-8 rounded ${getColor(
                          intensity
                        )} hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer group relative`}
                        title={`${DAYS[dayIndex]} ${hour}:00 - ${count} reviews`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-semibold">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                Activity Level:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Less</span>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="w-6 h-6 rounded bg-blue-200 dark:bg-blue-900" />
                  <div className="w-6 h-6 rounded bg-blue-400 dark:bg-blue-700" />
                  <div className="w-6 h-6 rounded bg-blue-600 dark:bg-blue-600" />
                  <div className="w-6 h-6 rounded bg-blue-800 dark:bg-blue-500" />
                </div>
                <span className="text-xs text-muted-foreground">More</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
