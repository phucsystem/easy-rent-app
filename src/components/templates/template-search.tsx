'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TemplateSearchProps {
  search: string;
  onSearchChange: (search: string) => void;
  filterDefault?: boolean;
  onFilterDefaultChange: (value: boolean | undefined) => void;
}

export function TemplateSearch({
  search,
  onSearchChange,
  filterDefault,
  onFilterDefaultChange,
}: TemplateSearchProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm mẫu hợp đồng..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter by default */}
      <Select
        value={
          filterDefault === undefined
            ? 'all'
            : filterDefault
              ? 'default'
              : 'custom'
        }
        onValueChange={(value) => {
          if (value === 'all') onFilterDefaultChange(undefined);
          else if (value === 'default') onFilterDefaultChange(true);
          else onFilterDefaultChange(false);
        }}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Loại mẫu" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="default">Mẫu mặc định</SelectItem>
          <SelectItem value="custom">Mẫu tùy chỉnh</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
