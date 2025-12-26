import { z } from 'zod';

// Vietnamese phone regex: 10 digits starting with 0 (03, 05, 07, 08, 09)
const vietnamesePhoneRegex = /^0[35789][0-9]{8}$/;

// Vietnamese ID card (CCCD): 12 digits (required per migration)
const vietnameseIdCardRegex = /^[0-9]{12}$/;

export const tenantFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'validation.fullNameMin')
    .max(100, 'validation.fullNameMax'),

  idCard: z
    .string()
    .regex(vietnameseIdCardRegex, 'validation.idCardInvalid'),

  phone: z
    .string()
    .regex(vietnamesePhoneRegex, 'validation.phoneInvalid'),

  email: z
    .string()
    .email('validation.emailInvalid')
    .or(z.literal('')),

  currentAddress: z
    .string()
    .min(1, 'validation.addressRequired')
    .max(500, 'validation.addressMax'),

  permanentAddress: z.string().max(500, 'validation.addressMax'),
});

export type TenantFormSchema = z.infer<typeof tenantFormSchema>;
