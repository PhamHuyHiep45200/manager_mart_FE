// Interface cho Promotion dựa trên database schema
export interface Promotion {
  promo_id: number;
  code: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'EXPIRED';
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
  status: 'ACTIVE' | 'EXPIRED';
  created_at?: string;
  updated_at?: string;
}
