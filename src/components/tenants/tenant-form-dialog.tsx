'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TenantForm } from './tenant-form';
import type { Tenant } from '@/types/tenant';
import type { TenantFormSchema } from '@/lib/validations/tenant';

interface TenantFormDialogProps {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TenantFormSchema) => void;
  isSubmitting?: boolean;
}

export function TenantFormDialog({
  tenant,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: TenantFormDialogProps) {
  const t = useTranslations('tenants');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tenant ? t('dialog.editTitle') : t('dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {tenant ? t('dialog.editDescription') : t('dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <TenantForm
          tenant={tenant ?? undefined}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
