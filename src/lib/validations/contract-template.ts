import { z } from 'zod';

// Template variable schema
export const templateVariableSchema = z.object({
  key: z.string().min(1).max(100).regex(/^[a-z_]+$/),
  label: z.string().min(1).max(200),
  type: z.enum(['text', 'number', 'date', 'currency']),
  required: z.boolean(),
  description: z.string().max(500).optional(),
});

// Contract template form schema
export const contractTemplateFormSchema = z.object({
  name: z.string().min(2, 'Tên mẫu hợp đồng phải ít nhất 2 ký tự').max(200, 'Tên mẫu hợp đồng không quá 200 ký tự'),
  content: z.string().min(10, 'Nội dung hợp đồng phải ít nhất 10 ký tự'),
  variables: z.array(templateVariableSchema).optional().default([]),
  isDefault: z.boolean().optional().default(false),
});

export type ContractTemplateFormData = z.infer<typeof contractTemplateFormSchema>;
