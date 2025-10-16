import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, User, SearchRequest, SearchResponse } from '../services/userService';

// Query keys cho user API
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: SearchRequest) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Hook để lấy danh sách users với search và pagination - luôn fetch data mới nhất
export const useUsers = (searchRequest: SearchRequest) => {
  return useQuery({
    queryKey: userKeys.list(searchRequest),
    queryFn: () => userService.search(searchRequest),
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook để lấy tất cả users (không phân trang) - luôn fetch data mới nhất
export const useAllUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userService.getAll(),
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook để tạo user mới
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: User) => userService.create(userData),
    onSuccess: () => {
      // Invalidate và refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Hook để cập nhật user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User> & { id: number }) => userService.update(userData),
    onSuccess: (_, variables) => {
      // Invalidate và refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Invalidate user detail nếu có
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};

// Hook để lưu user (create hoặc update)
export const useSaveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: User) => userService.save(userData),
    onSuccess: () => {
      // Invalidate và refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Hook để cập nhật danh sách users
export const useUpdateUsersList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (usersData: Array<Partial<User> & { id: number }>) => userService.updateList(usersData),
    onSuccess: () => {
      // Invalidate và refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Hook để xóa user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteById(id),
    onSuccess: () => {
      // Invalidate và refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Hook để lấy users theo role (employees hoặc customers) - luôn fetch data mới nhất
export const useUsersByRole = (role: 'ADMIN' | 'STAFF' | 'CUSTOMER', searchRequest: SearchRequest) => {
  return useQuery({
    queryKey: [...userKeys.list(searchRequest), 'role', role],
    queryFn: async () => {
      const response = await userService.search(searchRequest);
      // Filter users by role
      const filteredUsers = response.content.filter(user => user.role === role);
      return {
        ...response,
        content: filteredUsers,
        totalElements: filteredUsers.length,
      } as SearchResponse<User>;
    },
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
