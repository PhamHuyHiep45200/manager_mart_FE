import apiClient from './index';

// Định nghĩa interface cho User
export interface User {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  address: string;
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
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

// User Service
export const userService = {
  // Tạo user mới
  create: async (userData: User): Promise<User> => {
    return apiClient.post('/users/create', userData);
  },

  // Cập nhật user
  update: async (userData: Partial<User> & { id: number }): Promise<User> => {
    return apiClient.put('/users/update', userData);
  },

  // Lưu user (tạo mới hoặc cập nhật)
  save: async (userData: User): Promise<User> => {
    return apiClient.post('/users/save', userData);
  },

  // Cập nhật danh sách users
  updateList: async (usersData: Array<Partial<User> & { id: number }>): Promise<User[]> => {
    return apiClient.put('/users/updateList', usersData);
  },

  // Lấy tất cả users
  getAll: async (): Promise<User[]> => {
    return apiClient.get('/users/all');
  },

  // Tìm kiếm users với phân trang
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<User>> => {
    return apiClient.post('/users/search', searchRequest);
  },

  // Xóa user theo ID
  deleteById: async (id: number): Promise<void> => {
    return apiClient.delete(`/users/${id}`);
  },
};

export default userService;
