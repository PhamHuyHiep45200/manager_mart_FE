import apiClient from './index';

// Định nghĩa interface cho User
export interface User {
  pageNumber?: number | null;
  pageSize?: number | null;
  sortFields?: unknown | null;
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  address?: string | null;
  role: 'CUSTOMER' | 'EMPLOYEE';
  points?: number;
}

// Định nghĩa interface cho Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Định nghĩa interface cho Register Request
export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role: 'CUSTOMER' | 'EMPLOYEE';
}

// Định nghĩa interface cho Auth Response
export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
  };
  message?: string;
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
  lsCondition?: Array<{
    property: string;
    propertyType: 'string' | 'number' | 'date' | 'boolean';
    operator: 'EQUAL' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IS_NULL' | 'IS_NOT_NULL';
    value: string | number | null;
  }>;
  sortField?: Array<{
    fieldName: string;
    sort: 'ASC' | 'DESC';
  }>;
}

// Định nghĩa interface cho Search Response
export interface SearchResponse<T> {
  code: string;
  message: string | null;
  data: {
    content: T[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        unsorted: boolean;
        sorted: boolean;
        empty: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    first: boolean;
    empty: boolean;
  };
}

// User Service
export const userService = {
  // Đăng nhập user
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/users/login', loginData);
  },

  // Đăng ký user
  register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/users/register', registerData);
  },

  // Tạo user mới (Admin only) - sử dụng BaseController
  create: async (userData: User): Promise<User> => {
    return apiClient.post('/api/users/create', userData);
  },

  // Lấy thông tin user hiện tại
  getMe: async (): Promise<User> => {
    return apiClient.get('/api/users/me');
  },

  // Lấy tất cả users - sử dụng BaseController
  getAll: async (): Promise<User[]> => {
    return apiClient.get('/api/users/all');
  },

  // Tìm kiếm users với filters và sorts - sử dụng BaseController
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<User>> => {
    return apiClient.post('/api/users/search', searchRequest);
  },

  // Lấy user theo ID - sử dụng BaseController
  getById: async (id: number): Promise<User> => {
    return apiClient.get(`/api/users/${id}`);
  },

  // Cập nhật user - sử dụng BaseController
  update: async (userData: Partial<User> & { id: number }): Promise<User> => {
    return apiClient.put('/api/users/update', userData);
  },

  // Lưu user (create hoặc update) - sử dụng BaseController
  save: async (userData: User): Promise<User> => {
    return apiClient.post('/api/users/save', userData);
  },

  // Cập nhật danh sách users - sử dụng BaseController
  updateList: async (usersData: Array<Partial<User> & { id: number }>): Promise<User[]> => {
    return apiClient.put('/api/users/updateList', usersData);
  },

  // Xóa user theo ID - sử dụng BaseController
  deleteById: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/users/${id}`);
  },

  // Xóa user theo ID (alias)
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/users/${id}`);
  },
};

export default userService;
