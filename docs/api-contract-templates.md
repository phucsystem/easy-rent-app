# Contract Templates API Documentation

**Last Updated:** 2025-12-26
**Version:** 1.0.0
**Status:** Complete & Production Ready

## Overview

The Contract Templates API provides comprehensive CRUD operations for managing reusable contract templates with variable substitution support. All endpoints enforce Row Level Security (RLS) policies, ensuring users can only access their own templates and system defaults.

## Base Information

- **Frontend Client**: `src/lib/services/contract-template-service.ts`
- **Database Table**: `public.contract_templates`
- **Authentication**: Required (Supabase Auth)
- **Data Format**: JSON
- **Pagination**: Supported (limit/offset)

## Data Model

### ContractTemplate Resource

```typescript
interface ContractTemplate {
  id: string;                    // UUID, unique identifier
  userId: string;                // UUID, owner (nullable for defaults)
  name: string;                  // 1-255 characters, required
  content: string;               // Template content with {{variable}} syntax
  variables: TemplateVariable[]; // Array of template variables
  isDefault: boolean;            // System-provided defaults
  createdAt: Date;               // ISO timestamp
  updatedAt: Date;               // ISO timestamp
}
```

### TemplateVariable Definition

```typescript
interface TemplateVariable {
  key: string;                   // Identifier: tenant_full_name, property_address, etc
  label: string;                 // Display name in Vietnamese
  type: 'text' | 'number' | 'date' | 'currency'; // Variable data type
  required: boolean;             // Whether field is mandatory
  description?: string;          // Helper text for users
}
```

### Standard Template Variables

**Tenant Information:**
- `tenant_full_name` (text, required) - Họ và tên đầy đủ của người thuê
- `tenant_id_card` (text, required) - Số CCCD người thuê
- `tenant_phone` (text, required) - Số điện thoại người thuê
- `tenant_email` (text, optional) - Email người thuê
- `tenant_current_address` (text, required) - Địa chỉ hiện tại người thuê

**Landlord Information:**
- `landlord_name` (text, required) - Tên chủ nhà
- `landlord_id_card` (text, required) - Số CCCD chủ nhà
- `landlord_phone` (text, required) - Số điện thoại chủ nhà

**Property Information:**
- `property_address` (text, required) - Địa chỉ bất động sản

**Financial Information:**
- `monthly_rent` (currency, required) - Tiền thuê hàng tháng
- `deposit` (currency, required) - Tiền đặt cọc
- `payment_date` (number, required) - Ngày thanh toán (1-31)

**Date Information:**
- `contract_date` (date, required) - Ngày ký hợp đồng
- `start_date` (date, required) - Ngày bắt đầu hợp đồng
- `end_date` (date, required) - Ngày kết thúc hợp đồng

## Default Templates

### 1. Residential Lease Agreement (Chuẩn)

**ID:** Auto-generated UUID
**Name:** Hợp đồng thuê nhà dân dụng (Chuẩn)
**Type:** Full residential lease with detailed clauses
**Default:** Yes
**Required Variables:** 15 (all tenant, landlord, property, financial, and date fields)

**Features:**
- Comprehensive residential rental agreement
- 6 main articles covering purpose, duration, payment, rights/obligations
- Suitable for long-term residential rentals
- Includes utilities and service charges clause

### 2. Commercial Property Lease

**ID:** Auto-generated UUID
**Name:** Hợp đồng thuê nhà kinh doanh thương mại
**Type:** Commercial space rental
**Default:** Yes
**Required Variables:** 12

**Features:**
- Commercial property lease agreement
- Focused on business use cases
- 5 main articles for commercial requirements
- Includes fire safety and labor regulations clause
- Suitable for retail, office, warehouse rentals

### 3. Short-term Rental Agreement

**ID:** Auto-generated UUID
**Name:** Hợp đồng thuê ngắn hạn
**Type:** Simplified short-term rental
**Default:** Yes
**Required Variables:** 13

**Features:**
- Simplified short-term rental agreement (guest houses, Airbnb-style)
- 4 main articles with minimal clauses
- All-inclusive pricing (utilities and internet included)
- Quick-to-process agreement

## API Operations

### List Templates

**Endpoint:**
```
Service Method: contractTemplateService.list(params)
```

**Parameters:**

```typescript
interface ContractTemplateListParams {
  page?: number;           // Page number (default: 1)
  pageSize?: number;       // Items per page (default: 10)
  search?: string;         // Search by name or content
  isDefault?: boolean;     // Filter by default status
  sortBy?: 'name' | 'createdAt' | 'updatedAt'; // Sort field
  sortOrder?: 'asc' | 'desc'; // Sort direction
}
```

**Response:**

```typescript
interface ContractTemplateListResponse {
  data: ContractTemplate[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

**Example:**
```javascript
const response = await contractTemplateService.list({
  page: 1,
  pageSize: 10,
  search: 'residential',
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
```

**Notes:**
- Users see their own templates + all default templates
- Search filters by name (ilike) and content (ilike)
- Pagination uses limit/offset under the hood
- Results ordered by creation date descending by default

### Get Template by ID

**Endpoint:**
```
Service Method: contractTemplateService.getById(id)
```

**Parameters:**
- `id` (string, required) - Template UUID

**Response:**
```typescript
ContractTemplate
```

**Example:**
```javascript
const template = await contractTemplateService.getById('550e8400-e29b-41d4-a716-446655440000');
```

**Errors:**
- `PGRST116` - Template not found
- `42501` - RLS policy violation (user doesn't own non-default template)

### Create Template

**Endpoint:**
```
Service Method: contractTemplateService.create(input)
```

**Parameters:**

```typescript
interface CreateContractTemplateInput {
  name: string;              // 1-255 characters, required
  content: string;           // Template content, required
  variables?: TemplateVariable[]; // Variable definitions
  isDefault?: boolean;       // Always false for user-created templates
}
```

**Response:**
```typescript
ContractTemplate
```

**Example:**
```javascript
const newTemplate = await contractTemplateService.create({
  name: 'Custom Residential Lease',
  content: 'HỢP ĐỒNG THUÊ NHÀ\n\nThông tin chủ nhà: {{landlord_name}}...',
  variables: [
    {
      key: 'landlord_name',
      label: 'Tên chủ nhà',
      type: 'text',
      required: true
    }
  ]
});
```

**Validation:**
- `name` must be 1-255 characters
- `content` cannot be empty
- `variables` must be valid TemplateVariable array
- User authentication required (auto-set userId)

**Errors:**
- `400` - Validation failed
- `401` - User not authenticated

### Update Template

**Endpoint:**
```
Service Method: contractTemplateService.update(id, input)
```

**Parameters:**
- `id` (string, required) - Template UUID
- `input` (UpdateContractTemplateInput, required) - Partial update object

```typescript
interface UpdateContractTemplateInput {
  name?: string;
  content?: string;
  variables?: TemplateVariable[];
  isDefault?: boolean;  // Not changeable for user templates
}
```

**Response:**
```typescript
ContractTemplate
```

**Example:**
```javascript
const updated = await contractTemplateService.update(
  '550e8400-e29b-41d4-a716-446655440000',
  {
    name: 'Updated Template Name',
    content: 'New content...'
  }
);
```

**Validation:**
- All fields optional (partial update)
- Cannot modify default templates (will fail RLS check)
- Template must be user-owned

**Errors:**
- `404` - Template not found
- `42501` - RLS policy violation (not owner)

### Delete Template

**Endpoint:**
```
Service Method: contractTemplateService.delete(id)
```

**Parameters:**
- `id` (string, required) - Template UUID

**Response:**
```
void (204 No Content)
```

**Example:**
```javascript
await contractTemplateService.delete('550e8400-e29b-41d4-a716-446655440000');
```

**Restrictions:**
- Cannot delete default templates (is_default = true)
- Can only delete own templates

**Errors:**
- `404` - Template not found
- `42501` - RLS policy violation

### Clone Template

**Endpoint:**
```
Service Method: contractTemplateService.clone(id, newName)
```

**Parameters:**
- `id` (string, required) - Source template UUID
- `newName` (string, optional) - Name for cloned template

**Response:**
```typescript
ContractTemplate
```

**Example:**
```javascript
// Clone default template and modify
const cloned = await contractTemplateService.clone(
  'default-residential-uuid',
  'My Custom Residential Template'
);
```

**Features:**
- Copies all template content and variables
- Creates new UUID
- Sets isDefault to false
- Assigns to current user
- If newName omitted, uses "{original.name} (Copy)"

**Notes:**
- Default templates can be cloned without restrictions
- Cloned from user templates require ownership of source
- Useful for creating custom variations of default templates

## Variable Substitution

### Replace Variables in Content

**Method:**
```
Service Method: contractTemplateService.replaceVariables(content, values)
```

**Parameters:**
```typescript
replaceVariables(
  content: string,        // Template content with {{variables}}
  values: Record<string, string | number>  // Variable values
): string
```

**Response:**
```
string - Content with variables replaced
```

**Example:**
```javascript
const content = 'Hợp đồng thuê giữa {{landlord_name}} và {{tenant_full_name}}';
const filled = contractTemplateService.replaceVariables(content, {
  landlord_name: 'Nguyễn Văn A',
  tenant_full_name: 'Trần Thị B'
});
// Result: 'Hợp đồng thuê giữa Nguyễn Văn A và Trần Thị B'
```

**Security:**
- HTML entity escaping applied:
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#039;`
- Prevents XSS injection in replacement values
- Regex-safe placeholder handling

### Extract Variables from Content

**Method:**
```
Service Method: contractTemplateService.extractVariables(content)
```

**Parameters:**
- `content` (string, required) - Template content

**Response:**
```typescript
string[] // Array of variable keys found
```

**Example:**
```javascript
const content = 'Hello {{landlord_name}}, {{tenant_full_name}}';
const variables = contractTemplateService.extractVariables(content);
// Result: ['landlord_name', 'tenant_full_name']
```

**Regex Pattern:**
```
/\{\{([a-z_]+)\}\}/g
```

**Notes:**
- Case-sensitive matching
- Returns unique variables (no duplicates)
- Useful for validation and UI field generation

## Error Handling

### Common HTTP Status Codes

| Code | Meaning | Cause |
|------|---------|-------|
| 200 | Success | Operation completed successfully |
| 201 | Created | New template created |
| 204 | No Content | Delete successful |
| 400 | Bad Request | Validation error or malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 404 | Not Found | Template doesn't exist |
| 42501 | Permission Denied | RLS policy violation |

### Validation Errors

**Name validation:**
- Empty string: "Template name required"
- > 255 chars: "Template name too long"

**Content validation:**
- Empty string: "Template content required"

**Variable validation:**
- Invalid type: Must be one of [text, number, date, currency]
- Duplicate keys: Variable keys must be unique

## Security Considerations

### Row Level Security (RLS)

**SELECT Policy:**
```sql
(auth.uid() = user_id OR is_default = true OR user_id IS NULL)
```
- Users see only their own templates + all defaults

**INSERT Policy:**
```sql
(auth.uid() = user_id)
```
- New templates assigned to current user only

**UPDATE Policy:**
```sql
(auth.uid() = user_id AND is_default = false)
```
- Users can only update their own non-default templates

**DELETE Policy:**
```sql
(auth.uid() = user_id AND is_default = false)
```
- Users cannot delete default templates

### XSS Protection

Variable replacement applies HTML entity escaping:
- User-supplied values are escaped
- Prevents injection of malicious scripts
- Safe for HTML rendering
- Does NOT apply to template content itself

### Input Validation

- Template name: 1-255 characters, required
- Template content: Non-empty string, required
- Variable definitions: Valid JSON array
- Search queries: SQL injection protected via parameterized LIKE

## Usage Examples

### Complete Workflow: Create and Use Template

```javascript
// 1. Clone a default template
const customTemplate = await contractTemplateService.clone(
  defaultTemplateId,
  'My Residential Lease'
);

// 2. Prepare variable values
const values = {
  landlord_name: 'Nguyễn Văn A',
  landlord_id_card: '123456789012',
  landlord_phone: '0912345678',
  tenant_full_name: 'Trần Thị B',
  tenant_id_card: '987654321098',
  tenant_phone: '0898765432',
  tenant_email: 'tran@example.com',
  tenant_current_address: 'Hà Nội',
  property_address: '123 Nguyễn Huệ, Hà Nội',
  monthly_rent: '5000000',
  deposit: '10000000',
  start_date: '2025-01-01',
  end_date: '2026-01-01',
  contract_date: '2024-12-26',
  payment_date: '1'
};

// 3. Replace variables with actual values
const filledContent = contractTemplateService.replaceVariables(
  customTemplate.content,
  values
);

// 4. Save contract (Phase 5)
const contract = await createContract({
  templateId: customTemplate.id,
  tenantId: tenantId,
  generatedContent: filledContent,
  // ... snapshot data
});
```

### List and Search Templates

```javascript
// Get default templates
const defaultTemplates = await contractTemplateService.list({
  isDefault: true,
  pageSize: 10
});

// Search user's templates
const userTemplates = await contractTemplateService.list({
  search: 'residential',
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// Paginate through templates
const page2 = await contractTemplateService.list({
  page: 2,
  pageSize: 10
});
```

## Related Documentation

- [Project Overview & PDR](./project-overview-pdr.md)
- [System Architecture](./system-architecture.md)
- [Tenant Management API](./api-tenant-management.md)
- [Code Standards](./code-standards.md)

## Change Log

**Version 1.0.0 (2025-12-26):**
- Initial API documentation for contract templates
- Full CRUD operations documented
- 3 default templates documented
- Variable substitution explained
- Security and validation rules detailed
