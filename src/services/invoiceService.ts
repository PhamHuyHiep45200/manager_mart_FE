import apiClient from './index';

// Định nghĩa interface cho Invoice
export interface Invoice {
  id?: number;
  userId: number;
  customerName: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
}

// Định nghĩa interface cho Search Request
export interface SearchRequest {
  page: number;
  size: number;
  sorts: any[];
  filters: any[];
}

// Định nghĩa interface cho Search Response
export interface SearchResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Invoice Service
export const invoiceService = {
  // Tạo invoice mới
  create: async (invoiceData: Invoice): Promise<Invoice> => {
    return apiClient.post('/invoices/create', invoiceData);
  },

  // Lấy tất cả invoices
  getAll: async (): Promise<Invoice[]> => {
    return apiClient.get('/invoices/all');
  },

  // Tìm kiếm invoices với phân trang
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<Invoice>> => {
    return apiClient.post('/invoices/search', searchRequest);
  },
};

export default invoiceService;
