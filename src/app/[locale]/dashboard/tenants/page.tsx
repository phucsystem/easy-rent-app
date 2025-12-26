import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { TenantPageClient } from './tenant-page-client';

export default async function TenantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return <TenantPageClient locale={locale} />;
}
