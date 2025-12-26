'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface AuthSplitLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthSplitLayout({ children, title, subtitle }: AuthSplitLayoutProps) {
  const t = useTranslations();
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Gradient with geometric shapes */}
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-8 lg:p-16">
        {/* Geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large circle */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-amber-200/30 blur-3xl animate-pulse" />
          {/* Medium circle */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-tl from-yellow-300/20 to-orange-200/20 blur-2xl" />
          {/* Small circles */}
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-amber-300/30 to-primary/10 blur-xl" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Floating shapes */}
          <div className="absolute top-1/3 left-1/6 w-16 h-16 rounded-2xl bg-primary/10 rotate-12 backdrop-blur-sm border border-primary/20" />
          <div className="absolute bottom-1/3 right-1/6 w-12 h-12 rounded-full bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30" />
          <div className="absolute top-2/3 right-1/4 w-20 h-20 rounded-xl bg-orange-300/10 -rotate-6 backdrop-blur-sm border border-orange-200/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-amber-500 shadow-2xl shadow-primary/30 mb-6">
              <span className="text-4xl font-bold text-white">$</span>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {subtitle}
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {t('features.easyRentals')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {t('features.secure')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {t('features.fast')}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
