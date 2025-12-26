import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { TenantDetailClient } from './tenant-detail-client';

export default async function TenantDetailPage({
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

  return <TenantDetailClient locale={locale} tenantId={id} />;
}

