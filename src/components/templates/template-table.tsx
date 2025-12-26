'use client';

import { Eye, Edit, Trash2, Copy, Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ContractTemplate } from '@/types/contract-template';

interface TemplateTableProps {
  templates: ContractTemplate[];
  onEdit: (template: ContractTemplate) => void;
  onDelete: (template: ContractTemplate) => void;
  onView: (id: string) => void;
  onClone: (template: ContractTemplate) => void;
}

export function TemplateTable({
  templates,
  onEdit,
  onDelete,
  onView,
  onClone,
}: TemplateTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên mẫu</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Biến số</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {template.isDefault && (
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  )}
                  {template.name}
                </div>
              </TableCell>
              <TableCell>
                {template.isDefault ? (
                  <Badge variant="secondary">Mặc định</Badge>
                ) : (
                  <Badge variant="outline">Tùy chỉnh</Badge>
                )}
              </TableCell>
              <TableCell>{template.variables.length} biến</TableCell>
              <TableCell>{formatDate(template.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onView(template.id)}
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(template)}
                    title="Chỉnh sửa"
                    disabled={template.isDefault}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onClone(template)}
                    title="Sao chép"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(template)}
                    title="Xóa"
                    disabled={template.isDefault}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
