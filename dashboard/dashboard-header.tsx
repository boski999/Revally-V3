'use client';

import { Building2 } from 'lucide-react';
import { Store } from '@/types';
import { useLanguage } from '@/contexts/language-context';

interface DashboardHeaderProps {
  activeStore: Store | null;
}

export function DashboardHeader({ activeStore }: DashboardHeaderProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {t('dashboard.title')}
      </h1>
      <p className="text-muted-foreground flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        {activeStore?.name || t('store.noStoreSelected')}
      </p>
    </div>
  );
}