import apiClient from './index';

// Định nghĩa interface cho Category từ API response
export interface Category {
  id: number;
  name: string;
  description: string;
  parentId?: number;
  parentName?: string;
  children?: Category[];
}

// Định nghĩa interface cho API Response
export interface CategoryApiResponse {
  code: string;
  message: string | null;
  data: Category[];
}

// Định nghĩa interface cho Pagination Request
export interface PaginationRequest {
  page: number;
  size: number;
  sort?: string;
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
    operator: 'EQUAL' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IS_NULL';
    value: string | number | null;
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

// Category Service
export const categoryService = {
  // Lấy tất cả root categories (categories không có parent)
  getRoots: async (): Promise<Category[]> => {
    const response: CategoryApiResponse = await apiClient.get('/api/categories/roots');
    return response.data;
  },

  // Lấy category tree (cây phân cấp đầy đủ)
  getTree: async (): Promise<Category[]> => {
    const response: CategoryApiResponse = await apiClient.get('/api/categories/tree');
    return response.data;
  },

  // Lấy children của một category cụ thể
  getChildren: async (parentId: number): Promise<Category[]> => {
    const response: CategoryApiResponse = await apiClient.get(`/api/categories/${parentId}/children`);
    return response.data;
  },

  // Lấy tất cả categories - sử dụng BaseController
  getAll: async (): Promise<Category[]> => {
    const response: CategoryApiResponse = await apiClient.get('/api/categories/all');
    return response.data;
  },

  // Tìm kiếm categories với filters và sorts - sử dụng BaseController
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<Category>> => {
    return apiClient.post('/api/categories/search', searchRequest);
  },

  // Lấy category theo ID - sử dụng BaseController
  getById: async (id: number): Promise<Category> => {
    const response: CategoryApiResponse = await apiClient.get(`/api/categories/${id}`);
    return response.data[0];
  },

  // Tạo category mới - sử dụng BaseController
  create: async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    const response: CategoryApiResponse = await apiClient.post('/api/categories/create', categoryData);
    return response.data[0];
  },

  // Cập nhật category - sử dụng BaseController
  update: async (categoryData: Partial<Category> & { id: number }): Promise<Category> => {
    const response: CategoryApiResponse = await apiClient.put('/api/categories/update', categoryData);
    return response.data[0];
  },

  // Lưu category (create hoặc update) - sử dụng BaseController
  save: async (categoryData: Category): Promise<Category> => {
    const response: CategoryApiResponse = await apiClient.post('/api/categories/save', categoryData);
    return response.data[0];
  },

  // Xóa category theo ID - sử dụng BaseController
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`);
  },
};

export default categoryService;
