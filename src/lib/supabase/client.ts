import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'set' : 'MISSING'}, ` +
      `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'set' : 'MISSING'}. ` +
      'Please check your .env file in the project root.'
    );
  }

  // Use any as second generic to work around Supabase type inference issues
  // See: https://github.com/supabase/supabase-js/issues/849
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<Database, any>(supabaseUrl, supabaseAnonKey);
};
