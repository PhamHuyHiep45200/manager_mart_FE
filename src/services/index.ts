import axios from 'axios';

// Cấu hình axios instance
const apiClient = axios.create({
  baseURL: 'http://172.188.81.232:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token nếu có
apiClient.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có trong localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response?.status === 401) {
      // Token hết hạn, redirect về login
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Export tất cả services
export { authService } from './authService';
export { userService } from './userService';
export { categoryService } from './categoryService';
export { productService } from './productService';
export { invoiceService } from './invoiceService';
export { paymentService } from './paymentService';
export { promotionService } from './promotionService';
export { inventoryService } from './inventoryService';
export { uploadService } from './uploadService';

// Export types
export type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserProfile 
} from './authService';
export type { 
  User, 
  PaginationRequest, 
  PaginationResponse 
} from './userService';
export type { 
  Category 
} from './categoryService';
export type { 
  Product 
} from './productService';
export type { 
  Invoice, 
  InvoiceItem 
} from './invoiceService';
export type { 
  Payment 
} from './paymentService';
export type { 
  Promotion 
} from './promotionService';
export type { 
  InventoryLog 
} from './inventoryService';
export type { 
  UploadRequest, 
  UploadResponse, 
  FileInfo 
} from './uploadService';

export default apiClient;
