import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateEmptyStateProps {
  hasSearch: boolean;
  onCreateClick: () => void;
}

export function TemplateEmptyState({
  hasSearch,
  onCreateClick,
}: TemplateEmptyStateProps) {
  if (hasSearch) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed">
        <h3 className="mt-4 text-lg font-semibold">Không tìm thấy mẫu hợp đồng</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Thử thay đổi bộ lọc hoặc tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed">
      <h3 className="mt-4 text-lg font-semibold">Chưa có mẫu hợp đồng</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        Tạo mẫu hợp đồng đầu tiên để bắt đầu
      </p>
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Tạo mẫu hợp đồng
      </Button>
    </div>
  );
}
