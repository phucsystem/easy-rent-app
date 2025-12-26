'use client';

import { ReactNode } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';

interface DashboardLayoutProps {
  locale: string;
  children: ReactNode;
}

export function DashboardLayout({ locale, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <DashboardSidebar locale={locale} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader locale={locale} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
