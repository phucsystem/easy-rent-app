'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface AuthError {
  message: string;
  code?: string;
}

export async function signOutAction(locale: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw { message: error.message, code: error.name } as AuthError;
  }

  redirect(`/${locale}/auth/login`);
}
