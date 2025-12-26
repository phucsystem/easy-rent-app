import type { Database } from './database';

// Database types
export type TenantRow = Database['public']['Tables']['tenants']['Row'];
export type TenantInsert = Database['public']['Tables']['tenants']['Insert'];
export type TenantUpdate = Database['public']['Tables']['tenants']['Update'];

// Domain types (camelCase for frontend)
export interface Tenant {
  id: string;
  userId: string;
  fullName: string;
  idCard: string | null;
  phone: string;
  email: string | null;
  currentAddress: string | null;
  permanentAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Form input types
export interface TenantFormValues {
  fullName: string;
  idCard: string;
  phone: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
}

export type CreateTenantInput = TenantFormValues;
export type UpdateTenantInput = Partial<TenantFormValues>;

// List params
export interface TenantListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: keyof Tenant;
  sortOrder?: 'asc' | 'desc';
}

export interface TenantListResponse {
  data: Tenant[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Mapper functions: DB row to domain model
export function toTenant(row: TenantRow): Tenant {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    idCard: row.id_card,
    phone: row.phone,
    email: row.email,
    currentAddress: row.current_address,
    permanentAddress: row.permanent_address,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Mapper: domain model to DB insert
export function toTenantInsert(
  input: CreateTenantInput,
  userId: string
): TenantInsert {
  return {
    user_id: userId,
    full_name: input.fullName,
    id_card: input.idCard || null,
    phone: input.phone,
    email: input.email || null,
    current_address: input.currentAddress || null,
    permanent_address: input.permanentAddress || null,
  };
}

// Mapper: domain model to DB update
export function toTenantUpdate(input: UpdateTenantInput): TenantUpdate {
  const update: TenantUpdate = {};

  if (input.fullName !== undefined) update.full_name = input.fullName;
  if (input.phone !== undefined) update.phone = input.phone;
  if (input.idCard !== undefined) {
    update.id_card = input.idCard || null;
  }
  if (input.email !== undefined) {
    update.email = input.email || null;
  }
  if (input.currentAddress !== undefined) {
    update.current_address = input.currentAddress || null;
  }
  if (input.permanentAddress !== undefined) {
    update.permanent_address = input.permanentAddress || null;
  }

  return update;
}
