'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, User, MessageSquare } from 'lucide-react';

interface DrillDownData {
  title: string;
  description: string;
  reviews?: Array<{
    id: string;
    reviewer: string;
    rating: number;
    content: string;
    date: string;
    platform: string;
  }>;
  stats?: Record<string, string | number>;
}

interface ChartDrillDownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrillDownData | null;
}

export function ChartDrillDownDialog({
  open,
  onOpenChange,
  data,
}: ChartDrillDownDialogProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{data.title}</DialogTitle>
          <DialogDescription>{data.description}</DialogDescription>
        </DialogHeader>

        {data.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            {Object.entries(data.stats).map(([key, value]) => (
              <div
                key={key}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border"
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {key}
                </div>
                <div className="text-2xl font-bold">{value}</div>
              </div>
            ))}
          </div>
        )}

        {data.reviews && data.reviews.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Related Reviews ({data.reviews.length})
            </h3>
            {data.reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{review.reviewer}</span>
                      <Badge variant="outline">{review.platform}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {review.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
