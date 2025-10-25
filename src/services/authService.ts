import apiClient from './index';

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
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
}

// Định nghĩa interface cho Auth Response
export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: number;
      fullName: string;
      email: string;
      phone: string;
      address: string;
      role: string;
    };
  };
  message?: string;
}

// Định nghĩa interface cho User Profile
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  points?: number;
}

// Auth Service
export const authService = {
  // Đăng nhập
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/users/login', loginData);
  },

  // Đăng ký
  register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/auth/register', registerData);
  },

  // Lấy thông tin user hiện tại từ token
  getMe: async (): Promise<UserProfile> => {
    return apiClient.get('/api/users/me');
  },

  // Đăng xuất (có thể thêm logic xóa token ở frontend)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth-storage');
    window.location.href = '/signin';
  },

  // Kiểm tra token có hợp lệ không
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Lấy token từ localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Lưu token vào localStorage
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },
};

export default authService;
