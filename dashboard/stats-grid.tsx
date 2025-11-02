'use client';

import { StatsCard } from '@/components/stats-card';
import { MessageSquare, Star, Clock, Target } from 'lucide-react';
import { Analytics } from '@/types';
import { useLanguage } from '@/contexts/language-context';

interface StatsGridProps {
  analytics: Analytics | null;
  pendingCount: number;
}

export function StatsGrid({ analytics, pendingCount }: StatsGridProps) {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatsCard
        title={t('dashboard.totalReviews')}
        value={analytics?.totalReviews || 0}
        description={t('dashboard.allPlatforms')}
        icon={MessageSquare}
        trend={{ value: 12, isPositive: true }}
        color="blue"
      />
      <StatsCard
        title={t('dashboard.averageRating')}
        value={analytics?.averageRating.toFixed(1) || '0.0'}
        description={t('dashboard.acrossPlatforms')}
        icon={Star}
        trend={{ value: 0.2, isPositive: true }}
        color="green"
      />
      <StatsCard
        title={t('dashboard.pendingResponses')}
        value={pendingCount}
        description={t('dashboard.awaitingApproval')}
        icon={Clock}
        trend={{ value: -8, isPositive: false }}
        color="orange"
      />
      <StatsCard
        title={t('dashboard.autoApprovalRate')}
        value={`${analytics?.autoApprovalRate || 0}%`}
        description={t('dashboard.aiConfidence')}
        icon={Target}
        trend={{ value: 5, isPositive: true }}
        color="purple"
      />
    </div>
  );
}