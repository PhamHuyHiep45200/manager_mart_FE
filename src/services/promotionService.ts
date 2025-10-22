import apiClient from './index';

// Định nghĩa interface cho Promotion
export interface Promotion {
  pageNumber?: number | null;
  pageSize?: number | null;
  sortFields?: any | null;
  id?: number;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
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

// Promotion Service
export const promotionService = {
  // Lấy tất cả promotions - sử dụng BaseController
  getAll: async (): Promise<Promotion[]> => {
    return apiClient.get('/api/promotions/all');
  },

  // Tìm kiếm promotions với filters và sorts - sử dụng BaseController
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<Promotion>> => {
    return apiClient.post('/api/promotions/search', searchRequest);
  },

  // Lấy promotions dropdown - sử dụng BaseController
  getDropdown: async (searchRequest: Omit<SearchRequest, 'page' | 'size'>): Promise<Promotion[]> => {
    return apiClient.post('/api/promotions/dropdown', searchRequest);
  },

  // Lấy promotion theo ID - sử dụng BaseController
  getById: async (id: number): Promise<Promotion> => {
    return apiClient.get(`/api/promotions/${id}`);
  },

  // Tạo promotion mới - sử dụng BaseController
  create: async (promotionData: Promotion): Promise<Promotion> => {
    return apiClient.post('/api/promotions/create', promotionData);
  },

  // Tạo nhiều promotions - sử dụng BaseController
  createList: async (promotionsData: Promotion[]): Promise<Promotion[]> => {
    return apiClient.post('/api/promotions/createList', promotionsData);
  },

  // Cập nhật promotion - sử dụng BaseController
  update: async (promotionData: Partial<Promotion> & { id: number }): Promise<Promotion> => {
    return apiClient.put('/api/promotions/update', promotionData);
  },

  // Lưu promotion (create hoặc update) - sử dụng BaseController
  save: async (promotionData: Promotion): Promise<Promotion> => {
    return apiClient.post('/api/promotions/save', promotionData);
  },

  // Xóa promotion theo ID - sử dụng BaseController
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/promotions/${id}`);
  },

  // Xóa nhiều promotions theo IDs - sử dụng BaseController
  deleteByIds: async (ids: number[]): Promise<void> => {
    return apiClient.delete('/api/promotions/deleteByIds', { data: ids });
  },
};

export default promotionService;
