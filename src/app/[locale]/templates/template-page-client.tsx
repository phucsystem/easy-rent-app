'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contractTemplateService } from '@/lib/services/contract-template-service';
import { TemplateTable } from '@/components/templates/template-table';
import { TemplateCardList } from '@/components/templates/template-card-list';
import { TemplateSearch } from '@/components/templates/template-search';
import { TemplateEmptyState } from '@/components/templates/template-empty-state';
import { TemplateSkeleton } from '@/components/templates/template-skeleton';
import { TemplateDeleteDialog } from '@/components/templates/template-delete-dialog';
import { TemplateFormDialog } from '@/components/templates/template-form-dialog';
import { toast } from 'sonner';
import type { ContractTemplate, ContractTemplateListResponse } from '@/types/contract-template';

export function TemplatePageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterDefault, setFilterDefault] = useState<boolean | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ContractTemplate | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ContractTemplate | null>(null);

  const pageSize = 10;

  // Fetch templates
  const { data, isLoading, error } = useQuery({
    queryKey: ['contract-templates', { page, search, isDefault: filterDefault }],
    queryFn: () =>
      contractTemplateService.list({
        page,
        pageSize,
        search,
        isDefault: filterDefault,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  });

  // Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: contractTemplateService.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['contract-templates'] });
      const previousData = queryClient.getQueryData(['contract-templates', { page, search, isDefault: filterDefault }]);

      queryClient.setQueryData(['contract-templates', { page, search, isDefault: filterDefault }], (old: ContractTemplateListResponse | undefined) => ({
        ...old,
        data: old?.data?.filter((t: ContractTemplate) => t.id !== id) || [],
        total: (old?.total || 1) - 1,
      }));

      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['contract-templates', { page, search, isDefault: filterDefault }], context.previousData);
      }
      toast.error('Xóa mẫu hợp đồng thất bại');
    },
    onSuccess: () => {
      toast.success('Đã xóa mẫu hợp đồng');
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
    },
  });

  // Clone mutation
  const cloneMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      contractTemplateService.clone(id, name),
    onSuccess: () => {
      toast.success('Đã sao chép mẫu hợp đồng');
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
    },
    onError: () => {
      toast.error('Sao chép mẫu hợp đồng thất bại');
    },
  });

  const handleDelete = (template: ContractTemplate) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      deleteMutation.mutate(templateToDelete.id);
    }
  };

  const handleEdit = (template: ContractTemplate) => {
    setTemplateToEdit(template);
    setEditDialogOpen(true);
  };

  const handleView = (id: string) => {
    router.push(`/templates/${id}`);
  };

  const handleClone = async (template: ContractTemplate) => {
    const newName = `${template.name} (Copy)`;
    cloneMutation.mutate({ id: template.id, name: newName });
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
    toast.success('Đã tạo mẫu hợp đồng');
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setTemplateToEdit(null);
    queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
    toast.success('Đã cập nhật mẫu hợp đồng');
  };

  const templates = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-destructive">Lỗi: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mẫu hợp đồng</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý mẫu hợp đồng cho thuê nhà
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo mẫu hợp đồng
        </Button>
      </div>

      {/* Search and Filters */}
      <TemplateSearch
        search={search}
        onSearchChange={setSearch}
        filterDefault={filterDefault}
        onFilterDefaultChange={setFilterDefault}
      />

      {/* Content */}
      {isLoading ? (
        <TemplateSkeleton count={6} />
      ) : templates.length === 0 ? (
        <TemplateEmptyState
          hasSearch={!!search || filterDefault !== undefined}
          onCreateClick={() => setCreateDialogOpen(true)}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TemplateTable
              templates={templates}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onClone={handleClone}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <TemplateCardList
              templates={templates}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onClone={handleClone}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Trang {page} / {totalPages} ({total} mẫu hợp đồng)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <TemplateDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        templateName={templateToDelete?.name || ''}
        isLoading={deleteMutation.isPending}
      />

      <TemplateFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
        mode="create"
      />

      <TemplateFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
        mode="edit"
        template={templateToEdit}
      />
    </div>
  );
}
