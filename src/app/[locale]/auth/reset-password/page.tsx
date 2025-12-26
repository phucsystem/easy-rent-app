'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { updatePassword } from '@/lib/supabase/auth';

export default function ResetPasswordPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await updatePassword(password);
      router.push(`/${locale}/auth/login`);
    } catch (err: unknown) {
      const authError = err as { message: string };
      setError(authError.message || t('auth.validation.updatePasswordFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">$</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t('auth.resetPassword.title')}</CardTitle>
          <CardDescription className="text-center text-base">
            {t('auth.resetPassword.description')}
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
              <Label htmlFor="password" className="text-sm font-medium">{t('auth.resetPassword.newPasswordLabel')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.resetPassword.placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                autoComplete="new-password"
                className="rounded-xl h-11 border-gray-200 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('auth.resetPassword.confirmPasswordLabel')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('auth.resetPassword.placeholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                className="rounded-xl h-11 border-gray-200 focus-visible:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl"
              disabled={loading}
            >
              {loading ? t('auth.resetPassword.updating') : t('auth.resetPassword.button')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
