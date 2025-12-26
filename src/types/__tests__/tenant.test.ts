import { describe, it, expect } from 'vitest';
import {
  toTenant,
  toTenantInsert,
  toTenantUpdate,
  type TenantRow,
} from '../tenant';

describe('Tenant Type Mappers', () => {
  const mockTenantRow: TenantRow = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: 'user-123',
    full_name: 'Nguyen Van A',
    id_card: '123456789012',
    phone: '0912345678',
    email: 'nguyenvana@example.com',
    current_address: '123 Nguyen Hue',
    permanent_address: '456 Tran Hung Dao',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  describe('toTenant()', () => {
    it('should map database row to domain model', () => {
      const result = toTenant(mockTenantRow);

      expect(result.id).toBe(mockTenantRow.id);
      expect(result.userId).toBe(mockTenantRow.user_id);
      expect(result.fullName).toBe(mockTenantRow.full_name);
      expect(result.idCard).toBe(mockTenantRow.id_card);
      expect(result.phone).toBe(mockTenantRow.phone);
      expect(result.email).toBe(mockTenantRow.email);
      expect(result.currentAddress).toBe(mockTenantRow.current_address);
      expect(result.permanentAddress).toBe(mockTenantRow.permanent_address);
    });

    it('should convert ISO date string to Date object', () => {
      const result = toTenant(mockTenantRow);

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.getTime()).toBe(new Date(mockTenantRow.created_at).getTime());
      expect(result.updatedAt.getTime()).toBe(new Date(mockTenantRow.updated_at).getTime());
    });

    it('should handle null optional fields', () => {
      const rowWithNulls: TenantRow = {
        ...mockTenantRow,
        id_card: null,
        email: null,
        current_address: null,
        permanent_address: null,
      };

      const result = toTenant(rowWithNulls);

      expect(result.idCard).toBeNull();
      expect(result.email).toBeNull();
      expect(result.currentAddress).toBeNull();
      expect(result.permanentAddress).toBeNull();
    });
  });

  describe('toTenantInsert()', () => {
    it('should map form input to insert format with all fields', () => {
      const input = {
        fullName: 'Nguyen Van B',
        idCard: '210987654321',
        phone: '0987654321',
        email: 'nguyenvanb@example.com',
        currentAddress: '789 Le Loi',
        permanentAddress: '321 Dong Khoi',
      };

      const result = toTenantInsert(input, 'user-456');

      expect(result.user_id).toBe('user-456');
      expect(result.full_name).toBe(input.fullName);
      expect(result.id_card).toBe(input.idCard);
      expect(result.phone).toBe(input.phone);
      expect(result.email).toBe(input.email);
      expect(result.current_address).toBe(input.currentAddress);
      expect(result.permanent_address).toBe(input.permanentAddress);
    });

    it('should convert empty string to null for optional fields', () => {
      const input = {
        fullName: 'Nguyen Van C',
        idCard: '',
        phone: '0909090909',
        email: '',
        currentAddress: '',
        permanentAddress: '',
      };

      const result = toTenantInsert(input, 'user-789');

      expect(result.id_card).toBeNull();
      expect(result.email).toBeNull();
      expect(result.current_address).toBeNull();
      expect(result.permanent_address).toBeNull();
    });

    it('should preserve user ID for multiple inserts', () => {
      const input1 = {
        fullName: 'User 1',
        idCard: '111111111111',
        phone: '0911111111',
        email: 'user1@example.com',
        currentAddress: 'Address 1',
        permanentAddress: 'Address 1',
      };

      const input2 = {
        fullName: 'User 2',
        idCard: '222222222222',
        phone: '0922222222',
        email: 'user2@example.com',
        currentAddress: 'Address 2',
        permanentAddress: 'Address 2',
      };

      const userId = 'same-user-123';
      const result1 = toTenantInsert(input1, userId);
      const result2 = toTenantInsert(input2, userId);

      expect(result1.user_id).toBe(userId);
      expect(result2.user_id).toBe(userId);
    });
  });

  describe('toTenantUpdate()', () => {
    it('should map partial update with single field', () => {
      const input = { fullName: 'Updated Name' };
      const result = toTenantUpdate(input);

      expect(result.full_name).toBe('Updated Name');
      expect(result.phone).toBeUndefined();
      expect(result.email).toBeUndefined();
    });

    it('should map partial update with multiple fields', () => {
      const input = {
        fullName: 'New Name',
        phone: '0923456789',
        email: 'newemail@example.com',
      };

      const result = toTenantUpdate(input);

      expect(result.full_name).toBe('New Name');
      expect(result.phone).toBe('0923456789');
      expect(result.email).toBe('newemail@example.com');
    });

    it('should convert empty idCard to null', () => {
      const input = { idCard: '' };
      const result = toTenantUpdate(input);

      expect(result.id_card).toBeNull();
    });

    it('should convert empty email to null', () => {
      const input = { email: '' };
      const result = toTenantUpdate(input);

      expect(result.email).toBeNull();
    });

    it('should convert empty currentAddress to null', () => {
      const input = { currentAddress: '' };
      const result = toTenantUpdate(input);

      expect(result.current_address).toBeNull();
    });

    it('should convert empty permanentAddress to null', () => {
      const input = { permanentAddress: '' };
      const result = toTenantUpdate(input);

      expect(result.permanent_address).toBeNull();
    });

    it('should preserve non-empty values for optional fields', () => {
      const input = {
        idCard: '333333333333',
        email: 'user@example.com',
        currentAddress: '123 Street',
        permanentAddress: '456 Street',
      };

      const result = toTenantUpdate(input);

      expect(result.id_card).toBe('333333333333');
      expect(result.email).toBe('user@example.com');
      expect(result.current_address).toBe('123 Street');
      expect(result.permanent_address).toBe('456 Street');
    });

    it('should handle empty object (no updates)', () => {
      const input = {};
      const result = toTenantUpdate(input);

      expect(Object.keys(result).length).toBe(0);
    });

    it('should ignore undefined values', () => {
      const input = {
        fullName: 'Name',
        email: undefined,
        currentAddress: undefined,
      };

      const result = toTenantUpdate(input);

      expect(result.full_name).toBe('Name');
      expect(result.email).toBeUndefined();
      expect(result.current_address).toBeUndefined();
    });
  });
});
