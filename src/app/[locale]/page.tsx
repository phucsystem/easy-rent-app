import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${locale}/dashboard`);
  } else {
    redirect(`/${locale}/auth/login`);
  }
}
