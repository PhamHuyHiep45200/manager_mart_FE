// Interface cho Category dựa trên database schema với parent-child support
export interface Category {
  category_id: number;
  name: string;
  description: string;
  parent_id?: number; // ID của category cha (null nếu là root category)
  created_at?: string;
  updated_at?: string;
  children?: Category[]; // Danh sách category con
  level?: number; // Cấp độ (0 = root, 1 = child, 2 = grandchild...)
}

// Interface cho form data (với optional fields)
export interface CategoryFormData {
  category_id?: number;
  name: string;
  description: string;
  parent_id?: number; // ID của category cha
  created_at?: string;
  updated_at?: string;
}

// Interface cho Category với UI state
export interface CategoryWithUI extends Category {
  isExpanded?: boolean; // Trạng thái mở rộng cho tree view
  isSelected?: boolean; // Trạng thái được chọn
}
