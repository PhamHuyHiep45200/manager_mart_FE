import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type LoginRequest, type RegisterRequest, type UserProfile } from '../services';

// Auth Store Interface
interface AuthState {
  // State
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  getMe: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login(credentials);
          
          if (response.success && response.data) {
            const { accessToken, user } = response.data;
            
            // Save token to localStorage
            authService.setToken(accessToken);
            
            set({
              user,
              token: accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      // Register action
      register: async (userData: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.register(userData);
          
          if (response.success && response.data) {
            const { accessToken, user } = response.data;
            
            // Save token to localStorage
            authService.setToken(accessToken);
            
            set({
              user,
              token: accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Get current user profile
      getMe: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const user = await authService.getMe();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get user profile';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          // Clear token if getMe fails
          authService.logout();
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Set user
      setUser: (user: UserProfile | null) => {
        set({ user });
      },

      // Set token
      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });
      },

      // Set authentication status
      setIsAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for better performance
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  getMe: state.getMe,
  clearError: state.clearError,
  setLoading: state.setLoading,
  setUser: state.setUser,
  setToken: state.setToken,
  setIsAuthenticated: state.setIsAuthenticated,
}));
