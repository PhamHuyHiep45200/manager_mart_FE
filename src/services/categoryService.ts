import apiClient from './index';

// Định nghĩa interface cho Category
export interface Category {
  id?: number;
  name: string;
  description: string;
  parentId?: number;
  children?: Category[];
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

// Category Service
export const categoryService = {
  // Tạo category mới (root hoặc sub-category)
  create: async (categoryData: Category): Promise<Category> => {
    return apiClient.post('/categories/create', categoryData);
  },

  // Lấy tất cả root categories
  getRoots: async (): Promise<Category[]> => {
    return apiClient.get('/categories/roots');
  },

  // Lấy category tree (cây phân cấp)
  getTree: async (): Promise<Category[]> => {
    return apiClient.get('/categories/tree');
  },

  // Lấy children của một category
  getChildren: async (id: number): Promise<Category[]> => {
    return apiClient.get(`/categories/${id}/children`);
  },

  // Cập nhật category
  update: async (categoryData: Partial<Category> & { id: number }): Promise<Category> => {
    return apiClient.put('/categories/update', categoryData);
  },

  // Lấy tất cả categories
  getAll: async (): Promise<Category[]> => {
    return apiClient.get('/categories/all');
  },

  // Tìm kiếm categories với phân trang
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<Category>> => {
    return apiClient.post('/categories/search', searchRequest);
  },

  // Xóa category theo ID
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/categories/${id}`);
  },
};

export default categoryService;
