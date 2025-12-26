import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartContainerProps {
  title: string;
  filterOptions?: string[];
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  children: ReactNode;
}

export function ChartContainer({
  title,
  filterOptions,
  selectedFilter = 'Monthly',
  onFilterChange,
  children,
}: ChartContainerProps) {
  return (
    <Card className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {filterOptions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>{selectedFilter}</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => onFilterChange?.(option)}
                  className={selectedFilter === option ? 'bg-accent' : 'cursor-pointer hover:bg-gray-100'}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
