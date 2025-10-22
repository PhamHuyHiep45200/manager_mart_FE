// Interface cho Category dựa trên API response structure
export interface Category {
  categoryId: number;
  name: string;
  description: string;
  parentId?: number; // ID của category cha (null nếu là root category)
  parentName?: string; // Tên của category cha
  children?: Category[]; // Danh sách category con
  level?: number; // Cấp độ (0 = root, 1 = child, 2 = grandchild...)
}

// Interface cho form data (với optional fields)
export interface CategoryFormData {
  categoryId?: number;
  name: string;
  description: string;
  parentId?: number; // ID của category cha
}

// Interface cho Category với UI state
export interface CategoryWithUI extends Category {
  isExpanded?: boolean; // Trạng thái mở rộng cho tree view
  isSelected?: boolean; // Trạng thái được chọn
}
