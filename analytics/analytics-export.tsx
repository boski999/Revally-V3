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
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AnalyticsExportProps {
  data: any;
  dateRange: { start: Date; end: Date };
}

export function AnalyticsExport({ data, dateRange }: AnalyticsExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const csvRows = [];
      csvRows.push(['Analytics Report']);
      csvRows.push([`Date Range: ${format(dateRange.start, 'PPP')} - ${format(dateRange.end, 'PPP')}`]);
      csvRows.push(['']);
      csvRows.push(['Metric', 'Value']);

      csvRows.push(['Total Reviews', data.totalReviews || 0]);
      csvRows.push(['Average Rating', data.averageRating?.toFixed(2) || '0.00']);
      csvRows.push(['Response Rate', `${data.responseRate?.toFixed(1) || 0}%`]);
      csvRows.push(['Avg Response Time', `${data.avgResponseTime?.toFixed(1) || 0} hours`]);
      csvRows.push(['Pending Reviews', data.pendingReviews || 0]);
      csvRows.push(['Sentiment Score', `${data.sentimentScore?.toFixed(1) || 0}%`]);

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        dateRange: {
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString(),
        },
        analytics: data,
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('JSON exported successfully');
    } catch (error) {
      toast.error('Failed to export JSON');
    } finally {
      setIsExporting(false);
    }
  };

  const printReport = () => {
    window.print();
    toast.success('Opening print dialog');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV}>
          <Table className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={printReport}>
          <FileText className="w-4 h-4 mr-2" />
          Print Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
