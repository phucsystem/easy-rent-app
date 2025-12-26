import { cn } from '@/lib/utils';

interface MetricItemProps {
  label: string;
  value: string;
  color: 'success' | 'warning' | 'error' | 'info';
}

const colorStyles = {
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export function MetricItem({ label, value, color }: MetricItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className={cn('w-2 h-2 rounded-full', colorStyles[color])} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
