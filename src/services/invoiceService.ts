import apiClient from './index';

// Định nghĩa interface cho Invoice Item
export interface InvoiceItem {
  productId: number;
  quantity: number;
  price: number;
}

// Định nghĩa interface cho Invoice
export interface Invoice {
  id?: number;
  userId: number;
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  items: InvoiceItem[];
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

// Invoice Service
export const invoiceService = {
  // Lấy tất cả invoices - sử dụng BaseController
  getAll: async (): Promise<Invoice[]> => {
    return apiClient.get('/api/invoices/all');
  },

  // Tìm kiếm invoices với filters và sorts - sử dụng BaseController
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<Invoice>> => {
    return apiClient.post('/api/invoices/search', searchRequest);
  },

  // Lấy invoice theo ID - sử dụng BaseController
  getById: async (id: number): Promise<Invoice> => {
    return apiClient.get(`/api/invoices/${id}`);
  },

  // Tạo invoice mới - sử dụng BaseController
  create: async (invoiceData: Invoice): Promise<Invoice> => {
    return apiClient.post('/api/invoices/create', invoiceData);
  },

  // Tạo nhiều invoices - sử dụng BaseController
  createList: async (invoicesData: Invoice[]): Promise<Invoice[]> => {
    return apiClient.post('/api/invoices/createList', invoicesData);
  },

  // Cập nhật invoice - sử dụng BaseController
  update: async (invoiceData: Partial<Invoice> & { id: number }): Promise<Invoice> => {
    return apiClient.put('/api/invoices/update', invoiceData);
  },

  // Lưu invoice (create hoặc update) - sử dụng BaseController
  save: async (invoiceData: Invoice): Promise<Invoice> => {
    return apiClient.post('/api/invoices/save', invoiceData);
  },

  // Xóa invoice theo ID - sử dụng BaseController
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/invoices/${id}`);
  },

  // Xóa nhiều invoices theo IDs - sử dụng BaseController
  deleteByIds: async (ids: number[]): Promise<void> => {
    return apiClient.delete('/api/invoices/deleteByIds', { data: ids });
  },
};

export default invoiceService;
