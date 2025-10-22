import apiClient from './index';

// Định nghĩa interface cho Inventory Log
export interface InventoryLog {
  id?: number;
  productId: number;
  userId: number;
  actionType: 'IMPORT' | 'EXPORT';
  quantity: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Định nghĩa interface cho Pagination Request
export interface PaginationRequest {
  page: number;
  size: number;
  sort?: string;
}

// Định nghĩa interface cho Pagination Response
export interface PaginationResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Định nghĩa interface cho Search Request
export interface SearchRequest {
  page: number;
  size: number;
  sorts?: Array<{
    field: string;
    direction: 'ASC' | 'DESC';
  }>;
  filters?: Array<{
    field: string;
    operator: 'EQUAL' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN';
    value: string | number;
  }>;
}

// Định nghĩa interface cho Search Response
export interface SearchResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Inventory Service
export const inventoryService = {
  // Lấy tất cả inventory logs - sử dụng BaseController
  getAll: async (): Promise<InventoryLog[]> => {
    return apiClient.get('/api/inventory-logs/all');
  },

  // Tìm kiếm inventory logs với filters và sorts - sử dụng BaseController
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<InventoryLog>> => {
    return apiClient.post('/api/inventory-logs/search', searchRequest);
  },

  // Lấy inventory logs dropdown - sử dụng BaseController
  getDropdown: async (searchRequest: Omit<SearchRequest, 'page' | 'size'>): Promise<InventoryLog[]> => {
    return apiClient.post('/api/inventory-logs/dropdown', searchRequest);
  },

  // Lấy inventory log theo ID - sử dụng BaseController
  getById: async (id: number): Promise<InventoryLog> => {
    return apiClient.get(`/api/inventory-logs/${id}`);
  },

  // Tạo inventory log mới - sử dụng BaseController
  create: async (inventoryData: InventoryLog): Promise<InventoryLog> => {
    return apiClient.post('/api/inventory-logs/create', inventoryData);
  },

  // Tạo nhiều inventory logs - sử dụng BaseController
  createList: async (inventoryData: InventoryLog[]): Promise<InventoryLog[]> => {
    return apiClient.post('/api/inventory-logs/createList', inventoryData);
  },

  // Cập nhật inventory log - sử dụng BaseController
  update: async (inventoryData: Partial<InventoryLog> & { id: number }): Promise<InventoryLog> => {
    return apiClient.put('/api/inventory-logs/update', inventoryData);
  },

  // Lưu inventory log (create hoặc update) - sử dụng BaseController
  save: async (inventoryData: InventoryLog): Promise<InventoryLog> => {
    return apiClient.post('/api/inventory-logs/save', inventoryData);
  },

  // Xóa inventory log theo ID - sử dụng BaseController
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/inventory-logs/${id}`);
  },

  // Xóa nhiều inventory logs theo IDs - sử dụng BaseController
  deleteByIds: async (ids: number[]): Promise<void> => {
    return apiClient.delete('/api/inventory-logs/deleteByIds', { data: ids });
  },
};

export default inventoryService;
