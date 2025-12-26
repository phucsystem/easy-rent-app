'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartContainer } from '@/components/dashboard/chart-container';
import { MetricItem } from '@/components/dashboard/metric-item';
import { Building2, Users, FileText, Calendar } from 'lucide-react';

interface DashboardClientProps {
  userEmail: string;
}

export function DashboardClient({ userEmail }: DashboardClientProps) {
  const t = useTranslations();
  const [chartFilter, setChartFilter] = useState(t('dashboard.charts.monthly'));

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.heading')}</h1>
        <p className="text-muted-foreground">{t('dashboard.welcomeBack')} {userEmail}</p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <StatCard
          title={t('dashboard.stats.locations')}
          value="20"
          trend="+10%"
          trendPositive
          icon={<Building2 className="w-5 h-5" />}
          badge="Pro"
        />
        <StatCard
          title={t('dashboard.stats.customers')}
          value="12,345"
          trend="+10%"
          trendPositive
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title={t('dashboard.stats.activeContract')}
          value="1,000"
          trend="+10%"
          trendPositive
          icon={<FileText className="w-5 h-5" />}
        />
        <StatCard
          title={t('dashboard.stats.totalRevenue')}
          value="1B"
          trend="+10%"
          trendPositive
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          title={t('dashboard.stats.pendingBookings')}
          value="500"
          trend="+10%"
          trendPositive
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          title={t('dashboard.stats.completedBookings')}
          value="999"
          trend="+10%"
          trendPositive
          icon={<Calendar className="w-5 h-5" />}
        />
      </div>

      {/* Charts and Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2">
          <ChartContainer
            title={t('dashboard.charts.invoiceAmountByTime')}
            filterOptions={[
              t('dashboard.charts.monthly'),
              t('dashboard.charts.weekly'),
              t('dashboard.charts.daily')
            ]}
            selectedFilter={chartFilter}
            onFilterChange={setChartFilter}
          >
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">{t('dashboard.charts.placeholder')}</p>
            </div>
          </ChartContainer>
        </div>

        {/* Total Invoiced Amount */}
        <div>
          <ChartContainer title={t('dashboard.charts.totalInvoicedAmount')}>
            <div className="space-y-1">
              <MetricItem label={t('dashboard.metrics.paidAmount')} value="50.0M" color="success" />
              <MetricItem label={t('dashboard.metrics.unpaidAmount')} value="30.0M" color="warning" />
              <MetricItem label={t('dashboard.metrics.overdue')} value="20.0M" color="error" />
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('dashboard.metrics.total')}</span>
                  <span className="text-lg font-bold">100.0M</span>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>
    </>
  );
}
