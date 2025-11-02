'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, ArrowDown } from 'lucide-react';

interface WorkflowStage {
  stage: string;
  count: number;
  percentage: number;
  color: string;
  dropOff?: number;
}

interface WorkflowFunnelProps {
  reviews: Array<{
    status: 'pending' | 'approved' | 'published' | 'rejected';
  }>;
}

export function WorkflowFunnel({ reviews }: WorkflowFunnelProps) {
  const funnelData = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return [
        { stage: 'Received', count: 0, percentage: 100, color: 'bg-blue-500', dropOff: 0 },
        { stage: 'Reviewed', count: 0, percentage: 0, color: 'bg-green-500', dropOff: 0 },
        { stage: 'Approved', count: 0, percentage: 0, color: 'bg-emerald-500', dropOff: 0 },
        { stage: 'Published', count: 0, percentage: 0, color: 'bg-teal-500', dropOff: 0 },
      ];
    }

    const received = total;
    const reviewed = reviews.filter((r) => r.status !== 'pending').length;
    const approved = reviews.filter(
      (r) => r.status === 'approved' || r.status === 'published'
    ).length;
    const published = reviews.filter((r) => r.status === 'published').length;

    return [
      {
        stage: 'Received',
        count: received,
        percentage: 100,
        color: 'bg-blue-500',
        dropOff: 0,
      },
      {
        stage: 'Reviewed',
        count: reviewed,
        percentage: (reviewed / received) * 100,
        color: 'bg-green-500',
        dropOff: received - reviewed,
      },
      {
        stage: 'Approved',
        count: approved,
        percentage: (approved / received) * 100,
        color: 'bg-emerald-500',
        dropOff: reviewed - approved,
      },
      {
        stage: 'Published',
        count: published,
        percentage: (published / received) * 100,
        color: 'bg-teal-500',
        dropOff: approved - published,
      },
    ];
  }, [reviews]);

  const maxPercentage = 100;

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
            <Filter className="w-5 h-5 text-blue-500" />
          </div>
          Review Workflow Funnel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track reviews through each stage of your workflow
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {funnelData.map((stage, index) => {
            const width = (stage.percentage / maxPercentage) * 100;
            const isLast = index === funnelData.length - 1;

            return (
              <div key={stage.stage}>
                <div className="relative group">
                  <div
                    className={`${stage.color} text-white rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer`}
                    style={{
                      width: `${width}%`,
                      marginLeft: `${(100 - width) / 2}%`,
                    }}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">
                          {stage.stage}
                        </div>
                        <div className="text-sm opacity-90">
                          {stage.count} reviews
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {stage.percentage.toFixed(0)}%
                        </div>
                        {stage.dropOff !== undefined && stage.dropOff > 0 && (
                          <div className="text-xs opacity-75">
                            -{stage.dropOff} dropped
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 -bottom-2 top-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-popover border rounded-lg p-3 shadow-lg text-sm mx-auto max-w-xs">
                      <div className="font-medium mb-1">{stage.stage} Details</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Total: {stage.count} reviews</div>
                        <div>Percentage: {stage.percentage.toFixed(1)}%</div>
                        {stage.dropOff !== undefined && stage.dropOff > 0 && (
                          <div className="text-red-600 dark:text-red-400">
                            Drop-off: {stage.dropOff} reviews (
                            {((stage.dropOff / reviews.length) * 100).toFixed(1)}%)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Conversion Insights</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Overall Completion</div>
              <div className="text-lg font-bold">
                {funnelData[funnelData.length - 1].percentage.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Reviews</div>
              <div className="text-lg font-bold">{reviews.length}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
