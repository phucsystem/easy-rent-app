import { describe, it, expect } from 'vitest';
import { tenantFormSchema } from '../tenant';

describe('Tenant Form Validation Schema', () => {
  const validTenantData = {
    fullName: 'Nguyen Van A',
    idCard: '123456789012',
    phone: '0912345678',
    email: 'nguyenvana@example.com',
    currentAddress: '123 Nguyen Hue, District 1, HCMC',
    permanentAddress: '456 Tran Hung Dao, District 3, HCMC',
  };

  describe('Full Name Validation', () => {
    it('should accept valid full name', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        fullName: 'Nguyen Van A',
      });
      expect(result.success).toBe(true);
    });

    it('should accept full name with special characters and spaces', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        fullName: 'Nguyen Van A-B Tran',
      });
      expect(result.success).toBe(true);
    });

    it('should reject full name with less than 2 characters', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        fullName: 'A',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.fullNameMin');
      }
    });

    it('should reject empty full name', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        fullName: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject full name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101);
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        fullName: longName,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.fullNameMax');
      }
    });

    it('should accept full name at exactly 100 characters', () => {
      const nameAt100 = 'A'.repeat(100);
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        fullName: nameAt100,
      });
      expect(result.success).toBe(true);
    });

    it('should accept full name at exactly 2 characters', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        fullName: 'AB',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Vietnamese ID Card Validation', () => {
    it('should accept valid 12-digit ID card', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        idCard: '123456789012',
      });
      expect(result.success).toBe(true);
    });

    it('should accept ID card starting with various digits', () => {
      const validCards = [
        '000000000000',
        '111111111111',
        '987654321098',
        '123456789012',
      ];
      validCards.forEach((idCard) => {
        const result = tenantFormSchema.safeParse({
          ...validTenantData,
          idCard,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject ID card with less than 12 digits', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        idCard: '12345678901',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.idCardInvalid');
      }
    });

    it('should reject ID card with more than 12 digits', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        idCard: '1234567890123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.idCardInvalid');
      }
    });

    it('should reject ID card with non-numeric characters', () => {
      const invalidCards = [
        '12345678901a',
        '1234567890-2',
        '123456 789012',
        'ABCDEFGHIJKL',
        '123456789-12',
      ];
      invalidCards.forEach((idCard) => {
        const result = tenantFormSchema.safeParse({
          ...validTenantData,
          idCard,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject empty ID card', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        idCard: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject ID card with only spaces', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        idCard: '            ',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Vietnamese Phone Validation', () => {
    it('should accept valid phone starting with 03', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '0312345678',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid phone starting with 05', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '0512345678',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid phone starting with 07', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '0712345678',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid phone starting with 08', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '0812345678',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid phone starting with 09', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '0912345678',
      });
      expect(result.success).toBe(true);
    });

    it('should accept various valid 09 numbers', () => {
      const validPhones = [
        '0901234567',
        '0909876543',
        '0912121212',
        '0919999999',
        '0990000000',
      ];
      validPhones.forEach((phone) => {
        const result = tenantFormSchema.safeParse({
          ...validTenantData,
          phone,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject phone without leading 0', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '912345678',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.phoneInvalid');
      }
    });

    it('should reject phone with invalid prefix (01, 02, 04, 06)', () => {
      const invalidPhones = [
        '0112345678',
        '0212345678',
        '0412345678',
        '0612345678',
      ];
      invalidPhones.forEach((phone) => {
        const result = tenantFormSchema.safeParse({
          ...validTenantData,
          phone,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject phone with less than 10 digits', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '091234567',
      });
      expect(result.success).toBe(false);
    });

    it('should reject phone with more than 10 digits', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '09123456789',
      });
      expect(result.success).toBe(false);
    });

    it('should reject phone with non-numeric characters', () => {
      const invalidPhones = [
        '0912345-78',
        '091 234 5678',
        '091234567a',
        '(091) 234-5678',
      ];
      invalidPhones.forEach((phone) => {
        const result = tenantFormSchema.safeParse({
          ...validTenantData,
          phone,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject empty phone', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        phone: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        email: 'nguyenvana@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid email with different domains', () => {
      const validEmails = [
        'user@gmail.com',
        'user@yahoo.com',
        'user@company.co.uk',
        'first.last@example.com',
        'user+tag@example.com',
      ];
      validEmails.forEach((email) => {
        const result = tenantFormSchema.safeParse({
          ...validTenantData,
          email,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept empty email (optional field)', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        email: '',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'user@',
        'user @example.com',
        'user@example',
      ];
      invalidEmails.forEach((email) => {
        const result = tenantFormSchema.safeParse({
          ...validTenantData,
          email,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Address Validation', () => {
    it('should accept valid current address', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        currentAddress: '123 Nguyen Hue, District 1, HCMC',
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid permanent address', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        permanentAddress: '456 Tran Hung Dao, District 3, HCMC',
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty address (optional field)', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        currentAddress: '',
        permanentAddress: '',
      });
      expect(result.success).toBe(true);
    });

    it('should accept address up to 500 characters', () => {
      const address500 = 'A'.repeat(500);
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        currentAddress: address500,
      });
      expect(result.success).toBe(true);
    });

    it('should reject address exceeding 500 characters', () => {
      const address501 = 'A'.repeat(501);
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        currentAddress: address501,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('validation.addressMax');
      }
    });

    it('should accept short address', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        currentAddress: '123 Main St',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Combined Validation - Happy Path', () => {
    it('should validate complete valid tenant form', () => {
      const result = tenantFormSchema.safeParse(validTenantData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validTenantData);
      }
    });

    it('should validate with all required fields minimum length', () => {
      const result = tenantFormSchema.safeParse({
        fullName: 'AB',
        idCard: '123456789012',
        phone: '0912345678',
        email: 'a@b.com',
        currentAddress: '',
        permanentAddress: '',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Combined Validation - Error Scenarios', () => {
    it('should return multiple validation errors', () => {
      const result = tenantFormSchema.safeParse({
        fullName: 'A',
        idCard: '12345',
        phone: '123456789',
        email: 'invalid',
        currentAddress: 'A'.repeat(501),
        permanentAddress: 'A'.repeat(501),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });

    it('should catch missing required fields', () => {
      const result = tenantFormSchema.safeParse({
        fullName: 'Valid Name',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle email with Vietnamese characters in domain', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        email: 'user@vietnamdomain.vn',
      });
      expect(result.success).toBe(true);
    });

    it('should accept ID card with all same digits', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        idCard: '000000000000',
      });
      expect(result.success).toBe(true);
    });

    it('should accept address with numbers and special characters', () => {
      const result = tenantFormSchema.safeParse({
        ...validTenantData,
        currentAddress: '123/45A, ABC Street, District 1, HCMC - Vietnam',
      });
      expect(result.success).toBe(true);
    });

    it('should handle phone numbers from all major telecom providers', () => {
      // Viettel, Vinaphone, MobiFone, Vietnamobile
      const phones = [
        '0316234567', // Viettel (03)
        '0517654321', // Vinaphone (05)
        '0789123456', // MobiFone (07)
        '0834567890', // Viettel (08)
        '0912345678', // Viettel (09)
      ];
      phones.forEach((phone) => {
        const result = tenantFormSchema.safeParse({
          ...validTenantData,
          phone,
        });
        expect(result.success).toBe(true);
      });
    });
  });
});
