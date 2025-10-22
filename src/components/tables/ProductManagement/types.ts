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
  parent_category_id?: number; // Thêm field để chọn parent category
  category_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface cho Category (để dropdown) - đồng bộ với categoryService
export interface Category {
  categoryId: number;
  name: string;
  description: string;
  parentId?: number;
  parentName?: string;
  children?: Category[];
}
