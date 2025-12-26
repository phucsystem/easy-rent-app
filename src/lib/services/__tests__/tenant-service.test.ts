import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { tenantService } from '../tenant-service';
import type { CreateTenantInput, UpdateTenantInput } from '@/types/tenant';

// Mock the Supabase client before importing
const mockSupabase = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
};

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

const mockTenantRow = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  user_id: 'user-123',
  full_name: 'John Doe',
  id_card: '123456789012',
  phone: '0912345678',
  email: 'john@example.com',
  current_address: '123 Main St',
  permanent_address: '456 Oak St',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('tenantService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list()', () => {
    it('should list tenants with default pagination', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: 1,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.list();

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should list tenants without search filter when search is empty', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: 1,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await tenantService.list({ search: '' });

      expect(mockQuery.or).not.toHaveBeenCalled();
    });

    it('should apply search filter', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: 1,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await tenantService.list({ search: 'john' });

      expect(mockQuery.or).toHaveBeenCalledWith(
        'full_name.ilike.%john%,phone.ilike.%john%,id_card.ilike.%john%,email.ilike.%john%'
      );
    });

    it('should apply custom sorting with descending order', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: 1,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await tenantService.list({ sortBy: 'fullName', sortOrder: 'desc' });

      expect(mockQuery.order).toHaveBeenCalledWith('full_name', { ascending: false });
    });

    it('should apply custom sorting with ascending order', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: 1,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await tenantService.list({ sortBy: 'fullName', sortOrder: 'asc' });

      expect(mockQuery.order).toHaveBeenCalledWith('full_name', { ascending: true });
    });

    it('should sort by updatedAt field', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: 1,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await tenantService.list({ sortBy: 'updatedAt' });

      expect(mockQuery.order).toHaveBeenCalledWith('updated_at', { ascending: false });
    });

    it('should handle invalid sortBy field with default', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: 1,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await tenantService.list({ sortBy: 'invalidField' as any });

      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should handle pagination correctly', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: 25,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.list({ page: 2, pageSize: 10 });

      expect(mockQuery.range).toHaveBeenCalledWith(10, 19);
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(3);
    });

    it('should handle null count gracefully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [mockTenantRow],
          error: null,
          count: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.list();

      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('should throw error on database failure', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error'),
          count: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(tenantService.list()).rejects.toThrow('Database error');
    });
  });

  describe('getById()', () => {
    it('should fetch tenant by ID', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockTenantRow,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.getById('123e4567-e89b-12d3-a456-426614174000');

      expect(result.id).toBe(mockTenantRow.id);
      expect(result.fullName).toBe(mockTenantRow.full_name);
    });

    it('should throw error when tenant not found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Not found'),
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(tenantService.getById('invalid-id')).rejects.toThrow('Not found');
    });
  });

  describe('create()', () => {
    it('should create a new tenant', async () => {
      const input: CreateTenantInput = {
        fullName: 'John Doe',
        idCard: '123456789012',
        phone: '0912345678',
        email: 'john@example.com',
        currentAddress: '123 Main St',
        permanentAddress: '456 Oak St',
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockTenantRow,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const result = await tenantService.create(input);

      expect(result.fullName).toBe(input.fullName);
      expect(result.phone).toBe(input.phone);
    });

    it('should throw error when user not authenticated', async () => {
      const input: CreateTenantInput = {
        fullName: 'John Doe',
        idCard: '123456789012',
        phone: '0912345678',
        email: 'john@example.com',
        currentAddress: '123 Main St',
        permanentAddress: '456 Oak St',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(tenantService.create(input)).rejects.toThrow('Not authenticated');
    });

    it('should throw error on insert failure', async () => {
      const input: CreateTenantInput = {
        fullName: 'John Doe',
        idCard: '123456789012',
        phone: '0912345678',
        email: 'john@example.com',
        currentAddress: '123 Main St',
        permanentAddress: '456 Oak St',
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Insert failed'),
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      await expect(tenantService.create(input)).rejects.toThrow('Insert failed');
    });
  });

  describe('update()', () => {
    it('should update existing tenant with full data', async () => {
      const input: UpdateTenantInput = {
        fullName: 'Jane Doe',
        phone: '0987654321',
      };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockTenantRow, full_name: 'Jane Doe', phone: '0987654321' },
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.update('123e4567-e89b-12d3-a456-426614174000', input);

      expect(result.fullName).toBe('Jane Doe');
      expect(result.phone).toBe('0987654321');
    });

    it('should handle partial update', async () => {
      const input: UpdateTenantInput = {
        email: 'newemail@example.com',
      };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockTenantRow, email: 'newemail@example.com' },
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.update('123e4567-e89b-12d3-a456-426614174000', input);

      expect(result.email).toBe('newemail@example.com');
    });

    it('should throw error on update failure', async () => {
      const input: UpdateTenantInput = {
        fullName: 'Jane Doe',
      };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Update failed'),
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(
        tenantService.update('123e4567-e89b-12d3-a456-426614174000', input)
      ).rejects.toThrow('Update failed');
    });
  });

  describe('delete()', () => {
    it('should delete tenant successfully', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await tenantService.delete('123e4567-e89b-12d3-a456-426614174000');

      expect(mockSupabase.from).toHaveBeenCalledWith('tenants');
      expect(mockQuery.delete).toHaveBeenCalled();
    });

    it('should throw error on delete failure', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          error: new Error('Delete failed'),
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(tenantService.delete('123e4567-e89b-12d3-a456-426614174000')).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('checkIdCardExists()', () => {
    it('should return true if ID card exists', async () => {
      // When excludeId is not provided, the query resolves directly
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [{ id: '123' }],
          error: null,
        }),
        neq: vi.fn().mockReturnThis(),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const exists = await tenantService.checkIdCardExists('123456789012');

      expect(exists).toBe(true);
    });

    it('should return false if ID card does not exist', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
        neq: vi.fn().mockReturnThis(),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const exists = await tenantService.checkIdCardExists('999999999999');

      expect(exists).toBe(false);
    });

    it('should exclude specified ID from check', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const exists = await tenantService.checkIdCardExists('123456789012', 'exclude-id');

      expect(mockQuery.neq).toHaveBeenCalledWith('id', 'exclude-id');
      expect(exists).toBe(false);
    });

    it('should return true when ID card exists with exclude ID', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockResolvedValue({
          data: [{ id: 'tenant-456' }],
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const exists = await tenantService.checkIdCardExists('123456789012', 'exclude-id');

      expect(exists).toBe(true);
    });

    it('should handle null data gracefully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const exists = await tenantService.checkIdCardExists('999999999999');

      expect(exists).toBe(false);
    });

    it('should throw error on query failure', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: new Error('Query failed'),
        }),
        neq: vi.fn().mockReturnThis(),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(tenantService.checkIdCardExists('123456789012')).rejects.toThrow(
        'Query failed'
      );
    });
  });
});
