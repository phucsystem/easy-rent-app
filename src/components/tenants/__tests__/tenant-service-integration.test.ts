import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tenantService } from '@/lib/services/tenant-service';
import type { CreateTenantInput } from '@/types/tenant';

// Mock Supabase
const mockSupabase = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
};

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

describe('Tenant Management - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Tenant Flow', () => {
    it('should create tenant with valid data', async () => {
      const createInput: CreateTenantInput = {
        fullName: 'Nguyen Van A',
        idCard: '123456789012',
        phone: '0912345678',
        email: 'nguyenvana@example.com',
        currentAddress: '123 Nguyen Hue',
        permanentAddress: '456 Tran Hung Dao',
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'tenant-123',
            user_id: 'user-123',
            full_name: createInput.fullName,
            id_card: createInput.idCard,
            phone: createInput.phone,
            email: createInput.email,
            current_address: createInput.currentAddress,
            permanent_address: createInput.permanentAddress,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const result = await tenantService.create(createInput);

      expect(result.fullName).toBe(createInput.fullName);
      expect(result.phone).toBe(createInput.phone);
      expect(result.email).toBe(createInput.email);
    });

    it('should fail create when user is not authenticated', async () => {
      const createInput: CreateTenantInput = {
        fullName: 'Nguyen Van B',
        idCard: '210987654321',
        phone: '0987654321',
        email: 'nguyenvanb@example.com',
        currentAddress: '789 Le Loi',
        permanentAddress: '321 Dong Khoi',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(tenantService.create(createInput)).rejects.toThrow('Not authenticated');
    });
  });

  describe('Edit Tenant Flow', () => {
    it('should update tenant information', async () => {
      const updateInput = {
        phone: '0923456789',
        email: 'newemail@example.com',
      };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'tenant-123',
            user_id: 'user-123',
            full_name: 'Nguyen Van A',
            id_card: '123456789012',
            phone: updateInput.phone,
            email: updateInput.email,
            current_address: '123 Nguyen Hue',
            permanent_address: '456 Tran Hung Dao',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.update('tenant-123', updateInput);

      expect(result.phone).toBe(updateInput.phone);
      expect(result.email).toBe(updateInput.email);
    });
  });

  describe('Delete Tenant Flow', () => {
    it('should delete tenant successfully', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(tenantService.delete('tenant-123')).resolves.not.toThrow();
    });

    it('should handle delete errors', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          error: new Error('Permission denied'),
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(tenantService.delete('tenant-123')).rejects.toThrow('Permission denied');
    });
  });

  describe('Search and Filter Tenants', () => {
    it('should search tenants by name', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [
            {
              id: 'tenant-1',
              user_id: 'user-123',
              full_name: 'Nguyen Van A',
              id_card: '123456789012',
              phone: '0912345678',
              email: 'nguyenvana@example.com',
              current_address: '123 Nguyen Hue',
              permanent_address: '456 Tran Hung Dao',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          error: null,
          count: 1,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.list({ search: 'Nguyen' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].fullName).toBe('Nguyen Van A');
      expect(mockQuery.or).toHaveBeenCalled();
    });

    it('should filter tenants with pagination', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 50,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await tenantService.list({ page: 2, pageSize: 10 });

      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(5);
      expect(mockQuery.range).toHaveBeenCalledWith(10, 19);
    });
  });

  describe('Validation Tests', () => {
    it('should check ID card uniqueness', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [{ id: 'tenant-1' }],
          error: null,
        }),
        neq: vi.fn().mockReturnThis(),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const exists = await tenantService.checkIdCardExists('123456789012');
      expect(exists).toBe(true);
    });

    it('should allow unique ID cards', async () => {
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
  });
});
