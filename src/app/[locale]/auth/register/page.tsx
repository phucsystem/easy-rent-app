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

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t('auth.validation.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.validation.passwordMinLength'));
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err: unknown) {
      const authError = err as { message: string };
      setError(authError.message || t('auth.validation.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthSplitLayout
        title={t('auth.register.success.title')}
        subtitle={t('auth.register.success.subtitle')}
      >
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center lg:text-left">{t('auth.register.success.cardTitle')}</CardTitle>
            <CardDescription className="text-base text-center lg:text-left">
              {t('auth.register.success.cardDescription')}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push(`/${locale}/auth/login`)}
              className="w-full h-11 rounded-xl"
            >
              {t('auth.register.success.button')}
            </Button>
          </CardFooter>
        </Card>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center lg:text-left">{t('auth.register.cardTitle')}</CardTitle>
          <CardDescription className="text-base text-center lg:text-left">
            {t('auth.register.description')}
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
              <Label htmlFor="email" className="text-sm font-medium">{t('auth.register.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.register.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                className="rounded-xl h-11 border-gray-200 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">{t('auth.register.passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.register.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                autoComplete="new-password"
                className="rounded-xl h-11 border-gray-200 focus-visible:ring-primary"
              />
              <p className="text-xs text-muted-foreground">{t('auth.register.passwordHint')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('auth.register.confirmPasswordLabel')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
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
              {loading ? t('auth.register.creatingAccount') : t('auth.register.button')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('auth.register.haveAccount')}{' '}
              <Link
                href={`/${locale}/auth/login`}
                className="text-primary hover:underline font-semibold"
              >
                {t('auth.register.signInLink')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthSplitLayout>
  );
}
