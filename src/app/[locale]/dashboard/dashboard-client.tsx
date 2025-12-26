'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartContainer } from '@/components/dashboard/chart-container';
import { MetricItem } from '@/components/dashboard/metric-item';
import { Building2, Users, FileText, Calendar } from 'lucide-react';

interface DashboardClientProps {
  locale: string;
  userEmail: string;
}

export function DashboardClient({ locale, userEmail }: DashboardClientProps) {
  const [chartFilter, setChartFilter] = useState('Monthly');

  return (
    <DashboardLayout locale={locale}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userEmail}</p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <StatCard
          title="Locations"
          value="20"
          trend="+10%"
          trendPositive
          icon={<Building2 className="w-5 h-5" />}
          badge="Pro"
        />
        <StatCard
          title="Customers"
          value="12,345"
          trend="+10%"
          trendPositive
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Active Contract"
          value="1,000"
          trend="+10%"
          trendPositive
          icon={<FileText className="w-5 h-5" />}
        />
        <StatCard
          title="Total Revenue"
          value="1B"
          trend="+10%"
          trendPositive
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Bookings"
          value="500"
          trend="+10%"
          trendPositive
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          title="Completed Bookings"
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
            title="Invoice Amount By Time"
            filterOptions={['Monthly', 'Weekly', 'Daily']}
            selectedFilter={chartFilter}
            onFilterChange={setChartFilter}
          >
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">Chart will be rendered here</p>
            </div>
          </ChartContainer>
        </div>

        {/* Total Invoiced Amount */}
        <div>
          <ChartContainer title="Total Invoiced Amount">
            <div className="space-y-1">
              <MetricItem label="Paid Amount" value="50.0M" color="success" />
              <MetricItem label="Unpaid Amount" value="30.0M" color="warning" />
              <MetricItem label="Overdue" value="20.0M" color="error" />
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold">100.0M</span>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
