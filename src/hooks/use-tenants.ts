import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { tenantService } from '@/lib/services/tenant-service';
import type {
  Tenant,
  CreateTenantInput,
  UpdateTenantInput,
  TenantListParams,
  TenantListResponse,
} from '@/types/tenant';

// Query keys factory
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (params: TenantListParams) => [...tenantKeys.lists(), params] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
};

// List tenants hook
export function useTenants(
  params: TenantListParams = {},
  options?: Omit<UseQueryOptions<TenantListResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: tenantKeys.list(params),
    queryFn: () => tenantService.list(params),
    ...options,
  });
}

// Get single tenant hook
export function useTenant(
  id: string,
  options?: Omit<UseQueryOptions<Tenant, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => tenantService.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Create tenant mutation
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTenantInput) => tenantService.create(input),
    onSuccess: () => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}

// Update tenant mutation with optimistic update
export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTenantInput }) =>
      tenantService.update(id, input),
    onMutate: async ({ id, input }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: tenantKeys.detail(id) });

      // Snapshot previous value
      const previousTenant = queryClient.getQueryData<Tenant>(tenantKeys.detail(id));

      // Optimistically update
      if (previousTenant) {
        queryClient.setQueryData<Tenant>(tenantKeys.detail(id), {
          ...previousTenant,
          ...input,
          fullName: input.fullName ?? previousTenant.fullName,
          phone: input.phone ?? previousTenant.phone,
          email: input.email ?? previousTenant.email,
          idCard: input.idCard ?? previousTenant.idCard,
          currentAddress: input.currentAddress ?? previousTenant.currentAddress,
          permanentAddress: input.permanentAddress ?? previousTenant.permanentAddress,
          updatedAt: new Date(),
        });
      }

      return { previousTenant };
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousTenant) {
        queryClient.setQueryData(tenantKeys.detail(id), context.previousTenant);
      }
    },
    onSettled: (_data, _error, { id }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}

// Delete tenant mutation with optimistic update
export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: tenantKeys.lists() });

      // Snapshot all list queries
      const previousLists = queryClient.getQueriesData<TenantListResponse>({
        queryKey: tenantKeys.lists(),
      });

      // Optimistically remove from all lists
      previousLists.forEach(([queryKey]) => {
        queryClient.setQueryData<TenantListResponse>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((t) => t.id !== id),
            total: old.total - 1,
          };
        });
      });

      return { previousLists };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}
