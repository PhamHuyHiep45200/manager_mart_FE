import apiClient from './index';

// Định nghĩa interface cho Payment
export interface Payment {
  id?: number;
  invoiceId: number;
  amount: number;
  paymentMethod: 'QR_CODE' | 'CASH' | 'CARD' | 'BANK_TRANSFER';
  qrCodeUrl?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
}

// Payment Service
export const paymentService = {
  // Tạo payment mới
  create: async (paymentData: Payment): Promise<Payment> => {
    return apiClient.post('/payments/create', paymentData);
  },

  // Lấy tất cả payments
  getAll: async (): Promise<Payment[]> => {
    return apiClient.get('/payments/all');
  },
};

export default paymentService;
