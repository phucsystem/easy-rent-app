'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TenantForm } from '@/components/tenants/tenant-form';
import { useCreateTenant } from '@/hooks/use-tenants';
import { useToast } from '@/hooks/use-toast';
import type { TenantFormSchema } from '@/lib/validations/tenant';

interface TenantNewClientProps {
  locale: string;
}

export function TenantNewClient({ locale }: TenantNewClientProps) {
  const t = useTranslations('tenants');
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreateTenant();

  const handleSubmit = async (values: TenantFormSchema) => {
    try {
      await createMutation.mutateAsync(values);
      toast({
        title: t('success.create'),
        variant: 'default',
      });
      router.push(`/${locale}/tenants`);
    } catch (error) {
      toast({
        title: t('error.create'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/tenants`);
  };

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
          <CardTitle>{t('actions.create')}</CardTitle>
          <CardDescription>{t('form.createDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <TenantForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

