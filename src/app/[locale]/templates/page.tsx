import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { TemplatePageClient } from './template-page-client';

export default async function TemplatesPage({
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

  return <TemplatePageClient />;
}
