export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define tenant row type separately to avoid circular references
interface TenantRow {
  id: string;
  user_id: string;
  full_name: string;
  id_card: string | null;
  phone: string;
  email: string | null;
  current_address: string | null;
  permanent_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: TenantRow;
        Insert: Omit<TenantRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TenantRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      contract_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contract_templates']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contract_templates']['Insert']>;
      };
      contracts: {
        Row: {
          id: string;
          user_id: string;
          tenant_id: string;
          template_id: string;
          tenant_snapshot: Json;
          template_snapshot: Json;
          generated_content: string;
          generated_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contracts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contracts']['Insert']>;
      };
    };
  };
}
