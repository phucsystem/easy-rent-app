'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, labelKey: 'nav.dashboard', href: '/dashboard' },
  { icon: Users, labelKey: 'nav.tenants', href: '/dashboard/tenants' },
  { icon: FileText, labelKey: 'nav.contracts', href: '/dashboard/contracts' },
];

interface DashboardSidebarProps {
  locale: string;
}

export function DashboardSidebar({ locale }: DashboardSidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const getWidth = () => collapsed ? 'w-16' : 'w-60';

  return (
    <aside
      className={`${getWidth()} bg-[#212121] min-h-screen flex flex-col transition-all duration-300 relative`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-[#333333]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-lg transition-transform hover:scale-105">
            <span className="text-lg font-bold text-primary-foreground">$</span>
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-lg">{t('dashboard.sidebar.brand')}</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === `/${locale}${item.href}`;

            return (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className={`
                    group flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-200 ease-out
                    cursor-pointer
                    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#212121]
                    ${isActive
                      ? 'bg-primary text-[#212121] font-semibold shadow-md scale-[1.02]'
                      : 'text-[#CCCCCC] hover:text-white hover:bg-[#333333] hover:scale-[1.01] hover:shadow-sm'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && (
                    <span className="truncate">{t(item.labelKey)}</span>
                  )}
                  {isActive && (
                    <div className="ml-auto w-1 h-5 bg-[#F08C00] rounded-full shadow-sm" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-[#F08C00] hover:scale-110 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={collapsed ? t('dashboard.sidebar.expandSidebar') : t('dashboard.sidebar.collapseSidebar')}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-[#212121]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[#212121]" />
        )}
      </button>
    </aside>
  );
}
