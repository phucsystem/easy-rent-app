'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TenantDeleteDialog } from '@/components/tenants/tenant-delete-dialog';
import { useTenant, useDeleteTenant } from '@/hooks/use-tenants';
import { useToast } from '@/hooks/use-toast';

interface TenantDetailClientProps {
  locale: string;
  tenantId: string;
}

export function TenantDetailClient({ locale, tenantId }: TenantDetailClientProps) {
  const t = useTranslations('tenants');
  const router = useRouter();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: tenant, isLoading, error } = useTenant(tenantId);
  const deleteMutation = useDeleteTenant();

  const handleEdit = () => {
    router.push(`/${locale}/dashboard/tenant-edit/${tenantId}`);
  };

  const handleDelete = () => {
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(tenantId);
      toast({
        title: t('success.delete'),
        variant: 'default',
      });
      router.push(`/${locale}/dashboard/tenants`);
    } catch (error) {
      toast({
        title: t('error.delete'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/dashboard/tenants`);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('actions.back')}
        </Button>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-destructive">
              {t('error.load')}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('actions.back')}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              {t('actions.edit')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('actions.delete')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{tenant.fullName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('table.fullName')}
                </label>
                <p className="mt-1 text-lg">{tenant.fullName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('table.idCard')}
                </label>
                <p className="mt-1 text-lg">{tenant.idCard || '—'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('table.phone')}
                </label>
                <p className="mt-1 text-lg">{tenant.phone}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('table.email')}
                </label>
                <p className="mt-1 text-lg">{tenant.email || '—'}</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {t('form.currentAddress')}
                </label>
                <p className="mt-1 text-lg">{tenant.currentAddress || '—'}</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {t('form.permanentAddress')}
                </label>
                <p className="mt-1 text-lg">{tenant.permanentAddress || '—'}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <p className="mt-1">{tenant.createdAt.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated:</span>
                  <p className="mt-1">{tenant.updatedAt.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TenantDeleteDialog
        tenant={tenant}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
