'use client';

import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TenantEmptyStateProps {
  onCreateClick: () => void;
}

export function TenantEmptyState({ onCreateClick }: TenantEmptyStateProps) {
  const t = useTranslations('tenants');

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{t('empty.title')}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {t('empty.description')}
      </p>
      <Button onClick={onCreateClick}>{t('empty.action')}</Button>
    </div>
  );
}
