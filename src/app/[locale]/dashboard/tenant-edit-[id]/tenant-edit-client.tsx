'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TenantForm } from '@/components/tenants/tenant-form';
import { useTenant, useUpdateTenant } from '@/hooks/use-tenants';
import { useToast } from '@/hooks/use-toast';
import type { TenantFormSchema } from '@/lib/validations/tenant';

interface TenantEditClientProps {
  locale: string;
  tenantId: string;
}

export function TenantEditClient({ locale, tenantId }: TenantEditClientProps) {
  const t = useTranslations('tenants');
  const router = useRouter();
  const { toast } = useToast();

  const { data: tenant, isLoading, error } = useTenant(tenantId);
  const updateMutation = useUpdateTenant();

  const handleSubmit = async (values: TenantFormSchema) => {
    try {
      await updateMutation.mutateAsync({ id: tenantId, input: values });
      toast({
        title: t('success.update'),
        variant: 'default',
      });
      router.push(`/${locale}/dashboard/tenant/${tenantId}`);
    } catch (error) {
      toast({
        title: t('error.update'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/dashboard/tenants/${tenantId}`);
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
                <Skeleton className="h-10 w-full" />
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
        <Button variant="ghost" onClick={handleCancel} className="mb-6">
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('actions.back')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('actions.edit')}</CardTitle>
          <CardDescription>{t('form.editDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <TenantForm
            tenant={tenant}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
