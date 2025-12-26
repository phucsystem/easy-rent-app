'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { FormMessageTranslated } from '@/components/ui/form-message-translated';
import { tenantFormSchema, type TenantFormSchema } from '@/lib/validations/tenant';
import type { Tenant } from '@/types/tenant';

interface TenantFormProps {
  tenant?: Tenant;
  onSubmit: (values: TenantFormSchema) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TenantForm({
  tenant,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TenantFormProps) {
  const t = useTranslations('tenants');

  const form = useForm<TenantFormSchema>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      fullName: tenant?.fullName ?? '',
      idCard: tenant?.idCard ?? '',
      phone: tenant?.phone ?? '',
      email: tenant?.email ?? '',
      currentAddress: tenant?.currentAddress ?? '',
      permanentAddress: tenant?.permanentAddress ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fullName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form.fullNamePlaceholder')} {...field} />
              </FormControl>
              <FormMessageTranslated />
            </FormItem>
          )}
        />

        {/* ID Card (CCCD) */}
        <FormField
          control={form.control}
          name="idCard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.idCard')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form.idCardPlaceholder')} {...field} />
              </FormControl>
              <FormMessageTranslated />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.phone')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form.phonePlaceholder')} {...field} />
              </FormControl>
              <FormMessageTranslated />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.email')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('form.emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessageTranslated />
            </FormItem>
          )}
        />

        {/* Current Address */}
        <FormField
          control={form.control}
          name="currentAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.currentAddress')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form.currentAddressPlaceholder')}
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessageTranslated />
            </FormItem>
          )}
        />

        {/* Permanent Address */}
        <FormField
          control={form.control}
          name="permanentAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.permanentAddress')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form.permanentAddressPlaceholder')}
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessageTranslated />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('form.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('form.saving') : tenant ? t('form.update') : t('form.create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
