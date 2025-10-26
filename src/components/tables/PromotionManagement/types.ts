// Interface cho Promotion dựa trên API schema
export interface Promotion {
  promo_id: number;
  code: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  selected_product_id?: number | null; // ID sản phẩm đã chọn (single)
  created_at?: string;
  updated_at?: string;
}

// Interface cho form data (với optional fields)
export interface PromotionFormData {
  promo_id?: number;
  code: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  selected_product_id?: number | null; // ID sản phẩm đã chọn (single)
  created_at?: string;
  updated_at?: string;
}
