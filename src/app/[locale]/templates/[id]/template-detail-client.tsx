'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { contractTemplateService } from '@/lib/services/contract-template-service';

interface TemplateDetailClientProps {
  id: string;
}

export function TemplateDetailClient({ id }: TemplateDetailClientProps) {
  const router = useRouter();

  const { data: template, isLoading, error } = useQuery({
    queryKey: ['contract-template', id],
    queryFn: () => contractTemplateService.getById(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-destructive">
          Lỗi: {error ? (error as Error).message : 'Không tìm thấy mẫu hợp đồng'}
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/templates`)}>
            <Copy className="mr-2 h-4 w-4" />
            Sao chép
          </Button>
          {!template.isDefault && (
            <Button size="sm" onClick={() => router.push(`/templates`)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Template Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{template.name}</CardTitle>
              <div className="mt-2 flex items-center gap-2">
                {template.isDefault ? (
                  <Badge variant="secondary">Mẫu mặc định</Badge>
                ) : (
                  <Badge variant="outline">Mẫu tùy chỉnh</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {template.variables.length} biến số
                </span>
              </div>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Ngày tạo</p>
              <p className="font-medium">{formatDate(template.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cập nhật lần cuối</p>
              <p className="font-medium">{formatDate(template.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variables */}
      {template.variables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Biến số trong mẫu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {template.variables.map((variable) => (
                <div
                  key={variable.key}
                  className="rounded-lg border p-3"
                >
                  <code className="text-sm font-mono text-primary">
                    {'{{'}{variable.key}{'}}'}
                  </code>
                  <p className="mt-1 text-sm font-medium">{variable.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {variable.type}
                    </Badge>
                    {variable.required && (
                      <Badge variant="secondary" className="text-xs">
                        Bắt buộc
                      </Badge>
                    )}
                  </div>
                  {variable.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {variable.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Nội dung mẫu hợp đồng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {template.content}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
