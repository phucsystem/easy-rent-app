import { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
  icon?: ReactNode;
  badge?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendPositive = true,
  icon,
  badge,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'rounded-2xl border border-gray-100 bg-white',
        // Dimensional layering - elevated shadow on hover
        'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        'hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
        'hover:-translate-y-0.5',
        'transition-all duration-300 ease-out',
        'cursor-pointer',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <Info
                className="w-3.5 h-3.5 text-muted-foreground cursor-help transition-colors hover:text-primary"
              />
            </div>
            {badge && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200">
                {badge}
              </span>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground transition-transform hover:scale-110">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <span
              className={cn(
                'text-sm font-semibold px-2 py-1 rounded-lg',
                'transition-all duration-200 hover:scale-105',
                trendPositive
                  ? 'bg-gradient-to-r from-green-50 to-green-100/50 text-green-600 border border-green-200'
                  : 'bg-gradient-to-r from-red-50 to-red-100/50 text-red-600 border border-red-200'
              )}
            >
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
