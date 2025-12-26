import { createClient } from '@/lib/supabase/client';
import type {
  ContractTemplate,
  CreateContractTemplateInput,
  UpdateContractTemplateInput,
  ContractTemplateListParams,
  ContractTemplateListResponse,
  ContractTemplateRow,
} from '@/types/contract-template';
import {
  toContractTemplate,
  toContractTemplateInsert,
  toContractTemplateUpdate,
} from '@/types/contract-template';

// Client-side contract template service
export const contractTemplateService = {
  /**
   * List contract templates with pagination, search, and sorting
   */
  async list(
    params: ContractTemplateListParams = {}
  ): Promise<ContractTemplateListResponse> {
    const supabase = createClient();
    const {
      page = 1,
      pageSize = 10,
      search = '',
      isDefault,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    // Map domain field to DB column
    const sortColumnMap: Record<string, string> = {
      name: 'name',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
    const sortColumn = sortColumnMap[sortBy as string] || 'created_at';

    let query = supabase
      .from('contract_templates')
      .select('*', { count: 'exact' });

    // Apply search filter (search by name and content)
    if (search) {
      const escapedSearch = search.replace(/[%_]/g, '\\$&');
      query = query.or(
        `name.ilike.%${escapedSearch}%,content.ilike.%${escapedSearch}%`
      );
    }

    // Filter by isDefault if specified
    if (isDefault !== undefined) {
      query = query.eq('is_default', isDefault);
    }

    // Apply sorting
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const templates = (data as ContractTemplateRow[]).map(toContractTemplate);
    const total = count ?? 0;

    return {
      data: templates,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  /**
   * Get single contract template by ID
   */
  async getById(id: string): Promise<ContractTemplate> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return toContractTemplate(data as ContractTemplateRow);
  },

  /**
   * Create new contract template
   */
  async create(
    input: CreateContractTemplateInput
  ): Promise<ContractTemplate> {
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const insertData = toContractTemplateInsert(input, user.id);

    const { data, error } = await supabase
      .from('contract_templates')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return toContractTemplate(data as ContractTemplateRow);
  },

  /**
   * Update existing contract template
   */
  async update(
    id: string,
    input: UpdateContractTemplateInput
  ): Promise<ContractTemplate> {
    const supabase = createClient();
    const updateData = toContractTemplateUpdate(input);

    const { data, error } = await supabase
      .from('contract_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toContractTemplate(data as ContractTemplateRow);
  },

  /**
   * Delete contract template
   */
  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('contract_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Clone a contract template
   */
  async clone(id: string, newName: string): Promise<ContractTemplate> {
    const supabase = createClient();

    // Get the template to clone
    const original = await this.getById(id);

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create a new template with the same content
    const cloneInput: CreateContractTemplateInput = {
      name: newName || `${original.name} (Copy)`,
      content: original.content,
      variables: original.variables,
      isDefault: false, // Clones are never default
    };

    return this.create(cloneInput);
  },

  /**
   * Replace template variables with actual values
   * Note: Escapes HTML entities to prevent XSS when rendering in HTML context
   */
  replaceVariables(
    content: string,
    values: Record<string, string | number>
  ): string {
    let result = content;

    // HTML entity escape function
    const escapeHtml = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    for (const [key, value] of Object.entries(values)) {
      // Escape special regex characters in placeholder
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const placeholder = `{{${escapedKey}}}`;
      const stringValue = escapeHtml(String(value));
      result = result.replace(new RegExp(placeholder, 'g'), stringValue);
    }

    return result;
  },

  /**
   * Extract variables from template content
   */
  extractVariables(content: string): string[] {
    const regex = /\{\{([a-z_]+)\}\}/g;
    const matches = content.matchAll(regex);
    const variables = new Set<string>();

    for (const match of matches) {
      variables.add(match[1]);
    }

    return Array.from(variables);
  },
};
