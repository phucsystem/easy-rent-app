import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

interface TenantEditLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function TenantEditLayout({
  children,
  params,
}: TenantEditLayoutProps) {
  const { locale } = await params;

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

