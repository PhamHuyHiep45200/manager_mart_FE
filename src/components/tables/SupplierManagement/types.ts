// Interface cho Supplier dựa trên database schema
export interface Supplier {
  supplier_id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

// Interface cho form data (với optional fields)
export interface SupplierFormData {
  supplier_id?: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}
