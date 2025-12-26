'use client';

import { useTranslations } from 'next-intl';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Tenant } from '@/types/tenant';

interface TenantCardListProps {
  tenants: Tenant[];
  onView?: (tenant: Tenant) => void;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export function TenantCardList({
  tenants,
  onView,
  onEdit,
  onDelete,
}: TenantCardListProps) {
  const t = useTranslations('tenants');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => (
        <Card key={tenant.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{tenant.fullName}</h3>
                <p className="text-sm text-muted-foreground truncate">{tenant.phone}</p>
              </div>
              <div className="flex gap-1 ml-2">
                {onView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(tenant)}
                    aria-label={t('actions.view')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(tenant)}
                  aria-label={t('actions.edit')}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete(tenant)}
                  aria-label={t('actions.delete')}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {tenant.idCard && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('table.idCard')}:</span>
                  <span className="font-medium">{tenant.idCard}</span>
                </div>
              )}
              {tenant.email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('table.email')}:</span>
                  <span className="font-medium truncate ml-2">{tenant.email}</span>
                </div>
              )}
              {tenant.currentAddress && (
                <div>
                  <span className="text-muted-foreground">{t('form.currentAddress')}:</span>
                  <p className="mt-1 text-sm line-clamp-2">{tenant.currentAddress}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
