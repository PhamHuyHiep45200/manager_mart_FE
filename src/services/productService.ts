import apiClient from './index';

// Định nghĩa interface cho Product
export interface Product {
  pageNumber?: number | null;
  pageSize?: number | null;
  sortFields?: string | null;
  id?: number;
  productId?: number | null; // For getAll API response
  categoryId?: number | null;
  categoryParentId?: number | null; // ID của parent category
  categoryName?: string | null;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string;
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

// Định nghĩa interface cho GetAll Response (return array trực tiếp)
export interface GetAllResponse<T> {
  code: string;
  message: string | null;
  data: T[];
}

// Product Service
export const productService = {
  // Lấy tất cả products (trả về array trực tiếp)
  getAll: async (): Promise<GetAllResponse<Product>> => {
    return apiClient.get('/api/products/all');
  },

  // Tìm kiếm products với filters và sorts
  search: async (searchRequest: SearchRequest): Promise<SearchResponse<Product>> => {
    return apiClient.post('/api/products/search', searchRequest);
  },

  // Lấy product theo ID
  getById: async (id: number): Promise<Product> => {
    return apiClient.get(`/api/products/${id}`);
  },

  // Tạo product mới
  create: async (productData: Product): Promise<Product> => {
    return apiClient.post('/api/products/create', productData);
  },

  // Cập nhật product
  update: async (id: number, productData: Partial<Product>): Promise<Product> => {
    return apiClient.put(`/api/products/update`, productData);
  },

  // Xóa product theo ID
  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`/api/products/${id}`);
  },
};

export default productService;
