import { createClient } from '@/lib/supabase/client';
import type {
  Tenant,
  CreateTenantInput,
  UpdateTenantInput,
  TenantListParams,
  TenantListResponse,
  TenantRow,
} from '@/types/tenant';
import { toTenant, toTenantInsert, toTenantUpdate } from '@/types/tenant';

// Client-side tenant service
export const tenantService = {
  /**
   * List tenants with pagination, search, and sorting
   */
  async list(params: TenantListParams = {}): Promise<TenantListResponse> {
    const supabase = createClient();
    const {
      page = 1,
      pageSize = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    // Map domain field to DB column
    const sortColumnMap: Record<string, string> = {
      fullName: 'full_name',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
    const sortColumn = sortColumnMap[sortBy as string] || 'created_at';

    let query = supabase
      .from('tenants')
      .select('*', { count: 'exact' });

    // Apply search filter (search by name, phone, id_card, email)
    if (search) {
      // Escape special characters to prevent SQL injection via LIKE patterns
      const escapedSearch = search.replace(/[%_]/g, '\\$&');
      query = query.or(
        `full_name.ilike.%${escapedSearch}%,phone.ilike.%${escapedSearch}%,id_card.ilike.%${escapedSearch}%,email.ilike.%${escapedSearch}%`
      );
    }

    // Apply sorting
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const tenants = (data as TenantRow[]).map(toTenant);
    const total = count ?? 0;

    return {
      data: tenants,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  /**
   * Get single tenant by ID
   */
  async getById(id: string): Promise<Tenant> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return toTenant(data as TenantRow);
  },

  /**
   * Create new tenant
   */
  async create(input: CreateTenantInput): Promise<Tenant> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const insertData = toTenantInsert(input, user.id);

    const { data, error } = await supabase
      .from('tenants')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return toTenant(data as TenantRow);
  },

  /**
   * Update existing tenant
   */
  async update(id: string, input: UpdateTenantInput): Promise<Tenant> {
    const supabase = createClient();
    const updateData = toTenantUpdate(input);

    const { data, error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toTenant(data as TenantRow);
  },

  /**
   * Delete tenant
   */
  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Check if ID card exists (for validation)
   */
  async checkIdCardExists(idCard: string, excludeId?: string): Promise<boolean> {
    const supabase = createClient();
    let query = supabase
      .from('tenants')
      .select('id')
      .eq('id_card', idCard);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data?.length ?? 0) > 0;
  },
};
