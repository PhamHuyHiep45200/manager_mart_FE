import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { showToast } from '../utils/toast';
import { authService } from '../services/authService';
import type { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '../services';

// Query keys for React Query
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Hook để đăng nhập với React Query
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken, setIsAuthenticated } = useAuthStore();
  
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      return authService.login(data);
    },
    onSuccess: (response) => {
      console.log('Login successful:', response);
      if (response.data) {
        const { accessToken, user } = response.data;
        
        // Save token to localStorage
        authService.setToken(accessToken);
        
        // Update auth store
        setUser(user);
        setToken(accessToken);
        setIsAuthenticated(true);
        
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: authKeys.me() });
        
        showToast.success('Login successful!');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    },
    onError: (error: Error) => {
      showToast.handleApiError(error);
    },
  });
};

// Hook để đăng ký với React Query
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken, setIsAuthenticated } = useAuthStore();
  
  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      return authService.register(data);
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { accessToken, user } = response.data;
        
        // Save token to localStorage
        authService.setToken(accessToken);
        
        // Update auth store
        setUser(user);
        setToken(accessToken);
        setIsAuthenticated(true);
        
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: authKeys.me() });
        
        showToast.success('Registration successful!');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    },
    onError: (error: Error) => {
      showToast.handleApiError(error);
    },
  });
};

// Hook để đăng xuất với React Query
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken, setIsAuthenticated } = useAuthStore();
  
  return useMutation({
    mutationFn: async () => {
      authService.logout();
    },
    onSuccess: () => {
      // Clear auth store
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // Clear all queries
      queryClient.clear();
      
      showToast.success('Logged out successfully!');
    },
  });
};

// Hook để lấy thông tin user hiện tại với React Query
export const useMe = () => {
  const { token } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<UserProfile> => {
      return authService.getMe();
    },
    enabled: !!token, // Only run query if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: Error) => {
      // Don't retry if it's an authentication error
      if ((error as { response?: { status?: number } })?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook để kiểm tra authentication status
export const useAuth = () => {
  const { user, isAuthenticated, token } = useAuthStore();
  const { data: meData, isLoading, error } = useMe();
  
  return {
    user: user || meData,
    isAuthenticated: isAuthenticated && !!token,
    isLoading,
    error,
  };
};
