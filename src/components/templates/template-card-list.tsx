'use client';

import { Eye, Edit, Trash2, Copy, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ContractTemplate } from '@/types/contract-template';

interface TemplateCardListProps {
  templates: ContractTemplate[];
  onEdit: (template: ContractTemplate) => void;
  onDelete: (template: ContractTemplate) => void;
  onView: (id: string) => void;
  onClone: (template: ContractTemplate) => void;
}

export function TemplateCardList({
  templates,
  onEdit,
  onDelete,
  onView,
  onClone,
}: TemplateCardListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {template.isDefault && (
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  )}
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {template.isDefault ? (
                    <Badge variant="secondary">Mặc định</Badge>
                  ) : (
                    <Badge variant="outline">Tùy chỉnh</Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {template.variables.length} biến
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="line-clamp-2 text-muted-foreground">
                {template.content.substring(0, 120)}...
              </div>
              <p className="text-xs text-muted-foreground">
                Ngày tạo: {formatDate(template.createdAt)}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 border-t bg-muted/50 p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(template.id)}
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(template)}
              disabled={template.isDefault}
              className="flex-1"
            >
              <Edit className="mr-2 h-4 w-4" />
              Sửa
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onClone(template)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onDelete(template)}
              disabled={template.isDefault}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
