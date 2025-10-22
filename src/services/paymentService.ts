import apiClient from './index';

// Định nghĩa interface cho Payment
export interface Payment {
  id?: number;
  invoiceId: number;
  amount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'QR_CODE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  transactionId?: string;
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

// Payment Service
export const paymentService = {
  // Lấy tất cả payments với phân trang
  getAll: async (pagination?: PaginationRequest): Promise<PaginationResponse<Payment>> => {
    const params = pagination ? {
      page: pagination.page,
      size: pagination.size,
      sort: pagination.sort || 'createdAt,desc'
    } : {};
    return apiClient.get('/api/payments', { params });
  },

  // Lấy payment theo ID
  getById: async (id: number): Promise<Payment> => {
    return apiClient.get(`/api/payments/${id}`);
  },

  // Tạo payment mới
  create: async (paymentData: Payment): Promise<Payment> => {
    return apiClient.post('/api/payments', paymentData);
  },

  // Cập nhật payment
  update: async (id: number, paymentData: Partial<Payment>): Promise<Payment> => {
    return apiClient.put(`/api/payments/${id}`, paymentData);
  },

  // Xóa payment theo ID
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/payments/${id}`);
  },
};

export default paymentService;
