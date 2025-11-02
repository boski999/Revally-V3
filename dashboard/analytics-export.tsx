'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { exportTableAsCSV } from '@/lib/chart-export';
import { toast } from 'sonner';

interface ReviewExport {
  id: string;
  reviewer: string;
  rating: number;
  content: string;
  date: string;
  platform: string;
  status: string;
  sentiment: string;
}

interface Analytics {
  totalReviews: number;
  averageRating: number;
  pendingResponses: number;
  autoApprovalRate: number;
  responseTime: number;
  platformBreakdown: Array<{ platform: string; count: number; rating: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
}

interface AnalyticsExportProps {
  reviews: ReviewExport[];
  analytics: Analytics | null;
}

export function AnalyticsExport({ reviews, analytics }: AnalyticsExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportReviewsCSV = () => {
    setIsExporting(true);
    try {
      const data = reviews.map((review) => ({
        Date: new Date(review.date).toLocaleDateString(),
        Reviewer: review.reviewer,
        Platform: review.platform,
        Rating: review.rating,
        Content: review.content,
        Status: review.status,
        Sentiment: review.sentiment,
      }));

      exportTableAsCSV(data, `reviews-${new Date().toISOString().split('T')[0]}`);
      toast.success('Reviews exported successfully');
    } catch (error) {
      toast.error('Failed to export reviews');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAnalyticsCSV = () => {
    if (!analytics) {
      toast.error('No analytics data available');
      return;
    }

    setIsExporting(true);
    try {
      const summaryData = [
        { Metric: 'Total Reviews', Value: analytics.totalReviews },
        { Metric: 'Average Rating', Value: analytics.averageRating },
        { Metric: 'Pending Responses', Value: analytics.pendingResponses },
        { Metric: 'Auto-Approval Rate', Value: `${analytics.autoApprovalRate}%` },
        { Metric: 'Avg Response Time', Value: `${analytics.responseTime}h` },
      ];

      exportTableAsCSV(summaryData, `analytics-summary-${new Date().toISOString().split('T')[0]}`);
      toast.success('Analytics exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics');
    } finally {
      setIsExporting(false);
    }
  };

  const exportPlatformBreakdown = () => {
    if (!analytics?.platformBreakdown) {
      toast.error('No platform data available');
      return;
    }

    setIsExporting(true);
    try {
      const data = analytics.platformBreakdown.map((platform) => ({
        Platform: platform.platform,
        'Total Reviews': platform.count,
        'Average Rating': platform.rating,
      }));

      exportTableAsCSV(data, `platform-breakdown-${new Date().toISOString().split('T')[0]}`);
      toast.success('Platform breakdown exported successfully');
    } catch (error) {
      toast.error('Failed to export platform breakdown');
    } finally {
      setIsExporting(false);
    }
  };

  const exportRatingDistribution = () => {
    if (!analytics?.ratingDistribution) {
      toast.error('No rating distribution data available');
      return;
    }

    setIsExporting(true);
    try {
      const data = analytics.ratingDistribution.map((item) => ({
        Rating: `${item.rating} Star${item.rating !== 1 ? 's' : ''}`,
        Count: item.count,
        Percentage: analytics.totalReviews > 0
          ? `${((item.count / analytics.totalReviews) * 100).toFixed(1)}%`
          : '0%',
      }));

      exportTableAsCSV(data, `rating-distribution-${new Date().toISOString().split('T')[0]}`);
      toast.success('Rating distribution exported successfully');
    } catch (error) {
      toast.error('Failed to export rating distribution');
    } finally {
      setIsExporting(false);
    }
  };

  const exportFullReport = () => {
    setIsExporting(true);
    try {
      const report = {
        exportDate: new Date().toISOString(),
        summary: {
          totalReviews: analytics?.totalReviews || 0,
          averageRating: analytics?.averageRating || 0,
          pendingResponses: analytics?.pendingResponses || 0,
          autoApprovalRate: analytics?.autoApprovalRate || 0,
          responseTime: analytics?.responseTime || 0,
        },
        platformBreakdown: analytics?.platformBreakdown || [],
        ratingDistribution: analytics?.ratingDistribution || [],
        reviews: reviews.map((r) => ({
          date: r.date,
          reviewer: r.reviewer,
          platform: r.platform,
          rating: r.rating,
          content: r.content,
          status: r.status,
          sentiment: r.sentiment,
        })),
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `full-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Full report exported successfully');
    } catch (error) {
      toast.error('Failed to export full report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={exportReviewsCSV}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          All Reviews (CSV)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={exportAnalyticsCSV}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Analytics Summary (CSV)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={exportPlatformBreakdown}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Platform Breakdown (CSV)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={exportRatingDistribution}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Rating Distribution (CSV)
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={exportFullReport}>
          <FileJson className="w-4 h-4 mr-2" />
          Full Report (JSON)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
