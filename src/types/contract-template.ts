import type { Database, Json } from './database';

// Database row type
export type ContractTemplateRow = Database['public']['Tables']['contract_templates']['Row'];
export type ContractTemplateInsert = Database['public']['Tables']['contract_templates']['Insert'];
export type ContractTemplateUpdate = Database['public']['Tables']['contract_templates']['Update'];

// Template variable definition
export interface TemplateVariable {
  key: string; // e.g., "tenant_name"
  label: string; // e.g., "Tên người thuê"
  type: 'text' | 'number' | 'date' | 'currency';
  required: boolean;
  description?: string;
}

// Domain model (camelCase)
export interface ContractTemplate {
  id: string;
  userId: string;
  name: string;
  content: string;
  variables: TemplateVariable[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Input types for API operations
export interface CreateContractTemplateInput {
  name: string;
  content: string;
  variables?: TemplateVariable[];
  isDefault?: boolean;
}

export interface UpdateContractTemplateInput {
  name?: string;
  content?: string;
  variables?: TemplateVariable[];
  isDefault?: boolean;
}

// List parameters
export interface ContractTemplateListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isDefault?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// List response
export interface ContractTemplateListResponse {
  data: ContractTemplate[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Type mappers: Database row (snake_case) ↔ Domain model (camelCase)

export function toContractTemplate(row: ContractTemplateRow): ContractTemplate {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    content: row.content,
    variables: Array.isArray(row.variables) ? (row.variables as unknown as TemplateVariable[]) : [],
    isDefault: row.is_default,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function toContractTemplateInsert(
  input: CreateContractTemplateInput,
  userId: string
): ContractTemplateInsert {
  return {
    user_id: userId,
    name: input.name,
    content: input.content,
    variables: (input.variables || []) as unknown as Json,
    is_default: input.isDefault || false,
  };
}

export function toContractTemplateUpdate(
  input: UpdateContractTemplateInput
): ContractTemplateUpdate {
  const update: ContractTemplateUpdate = {};

  if (input.name !== undefined) update.name = input.name;
  if (input.content !== undefined) update.content = input.content;
  if (input.variables !== undefined) update.variables = input.variables as unknown as Json;
  if (input.isDefault !== undefined) update.is_default = input.isDefault;

  return update;
}

// Predefined template variables
export const STANDARD_TEMPLATE_VARIABLES: TemplateVariable[] = [
  {
    key: 'tenant_full_name',
    label: 'Tên đầy đủ người thuê',
    type: 'text',
    required: true,
    description: 'Họ và tên đầy đủ của người thuê',
  },
  {
    key: 'tenant_id_card',
    label: 'Số CCCD người thuê',
    type: 'text',
    required: true,
    description: 'Số căn cước công dân',
  },
  {
    key: 'tenant_phone',
    label: 'Số điện thoại người thuê',
    type: 'text',
    required: true,
    description: 'Số điện thoại liên hệ',
  },
  {
    key: 'tenant_email',
    label: 'Email người thuê',
    type: 'text',
    required: false,
    description: 'Địa chỉ email liên hệ',
  },
  {
    key: 'tenant_current_address',
    label: 'Địa chỉ hiện tại người thuê',
    type: 'text',
    required: true,
    description: 'Nơi ở hiện tại',
  },
  {
    key: 'property_address',
    label: 'Địa chỉ bất động sản',
    type: 'text',
    required: true,
    description: 'Địa chỉ nhà/phòng cho thuê',
  },
  {
    key: 'monthly_rent',
    label: 'Tiền thuê hàng tháng',
    type: 'currency',
    required: true,
    description: 'Số tiền thuê phải trả mỗi tháng',
  },
  {
    key: 'deposit',
    label: 'Tiền đặt cọc',
    type: 'currency',
    required: true,
    description: 'Số tiền đặt cọc',
  },
  {
    key: 'start_date',
    label: 'Ngày bắt đầu',
    type: 'date',
    required: true,
    description: 'Ngày bắt đầu hợp đồng',
  },
  {
    key: 'end_date',
    label: 'Ngày kết thúc',
    type: 'date',
    required: true,
    description: 'Ngày kết thúc hợp đồng',
  },
  {
    key: 'landlord_name',
    label: 'Tên chủ nhà',
    type: 'text',
    required: true,
    description: 'Họ và tên chủ nhà',
  },
  {
    key: 'landlord_id_card',
    label: 'Số CCCD chủ nhà',
    type: 'text',
    required: true,
    description: 'Số căn cước công dân chủ nhà',
  },
  {
    key: 'landlord_phone',
    label: 'Số điện thoại chủ nhà',
    type: 'text',
    required: true,
    description: 'Số điện thoại liên hệ chủ nhà',
  },
  {
    key: 'payment_date',
    label: 'Ngày thanh toán',
    type: 'number',
    required: true,
    description: 'Ngày trong tháng phải thanh toán (1-31)',
  },
  {
    key: 'contract_date',
    label: 'Ngày ký hợp đồng',
    type: 'date',
    required: true,
    description: 'Ngày ký kết hợp đồng',
  },
];
