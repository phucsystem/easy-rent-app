import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { FileText } from 'lucide-react';

export default async function ContractsPage({
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

  const t = await getTranslations('contracts');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FileText className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground">{t('comingSoon')}</p>
    </div>
  );
}

