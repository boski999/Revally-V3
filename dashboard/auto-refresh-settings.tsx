'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AutoRefreshSettingsProps {
  enabled: boolean;
  interval: number;
  onEnabledChange: (enabled: boolean) => void;
  onIntervalChange: (interval: number) => void;
}

const INTERVAL_OPTIONS = [
  { value: 1, label: '1 minute' },
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
];

export function AutoRefreshSettings({
  enabled,
  interval,
  onEnabledChange,
  onIntervalChange,
}: AutoRefreshSettingsProps) {
  const [localEnabled, setLocalEnabled] = useState(enabled);
  const [localInterval, setLocalInterval] = useState(interval);

  useEffect(() => {
    setLocalEnabled(enabled);
    setLocalInterval(interval);
  }, [enabled, interval]);

  const handleEnabledChange = (checked: boolean) => {
    setLocalEnabled(checked);
    onEnabledChange(checked);
    toast.success(
      checked ? 'Auto-refresh enabled' : 'Auto-refresh disabled'
    );
  };

  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value, 10);
    setLocalInterval(newInterval);
    onIntervalChange(newInterval);
    toast.success(`Refresh interval set to ${INTERVAL_OPTIONS.find(o => o.value === newInterval)?.label}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Auto-Refresh Settings
        </CardTitle>
        <CardDescription>
          Configure automatic dashboard refresh intervals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-refresh">Enable Auto-Refresh</Label>
            <div className="text-sm text-muted-foreground">
              Automatically refresh dashboard data
            </div>
          </div>
          <Switch
            id="auto-refresh"
            checked={localEnabled}
            onCheckedChange={handleEnabledChange}
          />
        </div>

        {localEnabled && (
          <div className="space-y-2">
            <Label htmlFor="refresh-interval">Refresh Interval</Label>
            <Select
              value={localInterval.toString()}
              onValueChange={handleIntervalChange}
            >
              <SelectTrigger id="refresh-interval">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                {INTERVAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Dashboard will refresh every {INTERVAL_OPTIONS.find(o => o.value === localInterval)?.label}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
