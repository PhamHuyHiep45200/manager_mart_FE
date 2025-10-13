// Interface cho Product dựa trên database schema
export interface Product {
  product_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  // Thêm thông tin category để hiển thị
  category_name?: string;
}

// Interface cho form data (với optional fields)
export interface ProductFormData {
  product_id?: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface cho Category (để dropdown)
export interface Category {
  category_id: number;
  name: string;
}
