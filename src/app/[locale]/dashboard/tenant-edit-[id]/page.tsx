import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { TenantEditClient } from './tenant-edit-client';

export default async function TenantEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return <TenantEditClient locale={locale} tenantId={id} />;
}
