import apiClient from './index';

// Định nghĩa interface cho Product
export interface Product {
  id?: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
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

// Product Service
export const productService = {
  // Tạo product mới
  create: async (productData: Product): Promise<Product> => {
    return apiClient.post('/products/create', productData);
  },

  // Cập nhật product
  update: async (productData: Partial<Product> & { id: number }): Promise<Product> => {
    return apiClient.put('/products/update', productData);
  },

  // Lấy tất cả products
  getAll: async (): Promise<Product[]> => {
    return apiClient.get('/products/all');
  },

  // Tìm kiếm products với phân trang
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<Product>> => {
    return apiClient.post('/products/search', searchRequest);
  },

  // Xóa product theo ID
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/products/${id}`);
  },
};

export default productService;
