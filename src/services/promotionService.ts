import apiClient from './index';

// Định nghĩa interface cho Promotion
export interface Promotion {
  id?: number;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}

// Promotion Service
export const promotionService = {
  // Tạo promotion mới
  create: async (promotionData: Promotion): Promise<Promotion> => {
    return apiClient.post('/promotions/create', promotionData);
  },

  // Lấy tất cả promotions
  getAll: async (): Promise<Promotion[]> => {
    return apiClient.get('/promotions/all');
  },
};

export default promotionService;
