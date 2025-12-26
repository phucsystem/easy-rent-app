'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TenantTable,
  TenantCardList,
  TenantSearch,
  TenantFormDialog,
  TenantDeleteDialog,
  TenantSkeleton,
  TenantEmptyState,
} from '@/components/tenants';
import {
  useTenants,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from '@/hooks/use-tenants';
import { useToast } from '@/hooks/use-toast';
import type { Tenant, TenantListParams } from '@/types/tenant';
import type { TenantFormSchema } from '@/lib/validations/tenant';

interface TenantPageClientProps {
  locale: string;
}

export function TenantPageClient({ locale }: TenantPageClientProps) {
  const t = useTranslations('tenants');
  const router = useRouter();
  const { toast } = useToast();

  // List params state
  const [params, setParams] = useState<TenantListParams>({
    page: 1,
    pageSize: 10,
    search: '',
  });

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Queries and mutations
  const { data, isLoading, error } = useTenants(params);
  
  // Debug tenant loading
  console.log('Tenants Debug:', {
    isLoading,
    hasData: !!data,
    dataLength: data?.data?.length ?? 0,
    total: data?.total ?? 0,
    page: data?.page ?? 0,
    error: error?.message ?? null,
    params,
  });

  const createMutation = useCreateTenant();
  const updateMutation = useUpdateTenant();
  const deleteMutation = useDeleteTenant();

  // Handlers
  const handleSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const handleCreate = () => {
    router.push(`/${locale}/tenant-new`);
  };

  const handleView = (tenant: Tenant) => {
    router.push(`/${locale}/tenants/${tenant.id}`);
  };

  const handleEdit = (tenant: Tenant) => {
    router.push(`/${locale}/tenant-edit/${tenant.id}`);
  };

  const handleDelete = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (values: TenantFormSchema) => {
    try {
      if (selectedTenant) {
        await updateMutation.mutateAsync({ id: selectedTenant.id, input: values });
        toast({
          title: t('success.update'),
          variant: 'default',
        });
      } else {
        await createMutation.mutateAsync(values);
        toast({
          title: t('success.create'),
          variant: 'default',
        });
      }
      setFormOpen(false);
      setSelectedTenant(null);
    } catch (error) {
      toast({
        title: selectedTenant ? t('error.update') : t('error.create'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedTenant) {
      try {
        await deleteMutation.mutateAsync(selectedTenant.id);
        toast({
          title: t('success.delete'),
          variant: 'default',
        });
        setDeleteOpen(false);
        setSelectedTenant(null);
      } catch (error) {
        toast({
          title: t('error.delete'),
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{t('title')}</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {t('actions.create')}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <TenantSearch value={params.search ?? ''} onChange={handleSearch} />
          </div>

          {/* Content */}
          {isLoading ? (
            <TenantSkeleton />
          ) : error ? (
            <div className="p-8 text-center space-y-2">
              <div className="text-destructive font-medium">{t('error.load')}</div>
              <div className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            </div>
          ) : data && data.data.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <TenantTable
                  data={data}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPageChange={handlePageChange}
                />
              </div>
              {/* Mobile Card List */}
              <div className="md:hidden space-y-4">
                <TenantCardList
                  tenants={data.data}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {/* Mobile Pagination */}
                <div className="flex items-center justify-between pt-4">
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
                      onClick={() => handlePageChange(data.page - 1)}
                      disabled={data.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(data.page + 1)}
                      disabled={data.page >= data.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <TenantEmptyState onCreateClick={handleCreate} />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <TenantFormDialog
        tenant={selectedTenant}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <TenantDeleteDialog
        tenant={selectedTenant}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}

