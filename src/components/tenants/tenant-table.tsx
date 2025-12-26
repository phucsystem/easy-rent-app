'use client';

import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Tenant, TenantListResponse } from '@/types/tenant';

interface TenantTableProps {
  data: TenantListResponse;
  onView?: (tenant: Tenant) => void;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
  onPageChange: (page: number) => void;
}

export function TenantTable({
  data,
  onView,
  onEdit,
  onDelete,
  onPageChange,
}: TenantTableProps) {
  const t = useTranslations('tenants');

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.fullName')}</TableHead>
              <TableHead>{t('table.idCard')}</TableHead>
              <TableHead>{t('table.phone')}</TableHead>
              <TableHead>{t('table.email')}</TableHead>
              <TableHead className="w-[140px]">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.fullName}</TableCell>
                <TableCell>{tenant.idCard ?? '-'}</TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell>{tenant.email ?? '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(tenant)}
                        aria-label={t('actions.view')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(tenant)}
                      aria-label={t('actions.edit')}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(tenant)}
                      aria-label={t('actions.delete')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t('pagination.showing', {
            from: (data.page - 1) * data.pageSize + 1,
            to: Math.min(data.page * data.pageSize, data.total),
            total: data.total,
          })}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.page - 1)}
            disabled={data.page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.page + 1)}
            disabled={data.page >= data.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
