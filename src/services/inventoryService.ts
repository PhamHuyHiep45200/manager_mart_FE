import apiClient from './index';

// Định nghĩa interface cho Inventory Log
export interface InventoryLog {
  id?: number;
  productId: number;
  userId: number;
  actionType: 'IMPORT' | 'EXPORT' | 'ADJUSTMENT';
  quantity: number;
  note?: string;
}

// Inventory Service
export const inventoryService = {
  // Tạo inventory log mới
  create: async (inventoryData: InventoryLog): Promise<InventoryLog> => {
    return apiClient.post('/inventory-logs/create', inventoryData);
  },

  // Lấy tất cả inventory logs
  getAll: async (): Promise<InventoryLog[]> => {
    return apiClient.get('/inventory-logs/all');
  },
};

export default inventoryService;
