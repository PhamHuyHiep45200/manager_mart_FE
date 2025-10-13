// Interface cho Category dựa trên database schema
export interface Category {
  category_id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

// Interface cho form data (với optional fields)
export interface CategoryFormData {
  category_id?: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}
