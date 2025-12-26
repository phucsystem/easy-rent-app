import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { TenantNewClient } from './tenant-new-client';

export default async function TenantNewPage({
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

  return <TenantNewClient locale={locale} />;
}

