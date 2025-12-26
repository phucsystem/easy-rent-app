'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { AuthSplitLayout } from '@/components/auth/auth-split-layout';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      const authError = err as { message: string };
      setError(authError.message || t('auth.validation.signInFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center lg:text-left">{t('auth.login.cardTitle')}</CardTitle>
          <CardDescription className="text-base text-center lg:text-left">
            {t('auth.login.description')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t('auth.login.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                className="rounded-xl h-11 border-gray-200 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">{t('auth.login.passwordLabel')}</Label>
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.register.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                className="rounded-xl h-11 border-gray-200 focus-visible:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl"
              disabled={loading}
            >
              {loading ? t('auth.login.signingIn') : t('auth.login.button')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('auth.login.noAccount')}{' '}
              <Link
                href={`/${locale}/auth/register`}
                className="text-primary hover:underline font-semibold"
              >
                {t('auth.login.signUpLink')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthSplitLayout>
  );
}
