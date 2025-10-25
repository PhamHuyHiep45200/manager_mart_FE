import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, User, SearchRequest } from '../services/userService';

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
      // Invalidate tất cả user queries để đảm bảo refetch
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Hook để cập nhật user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User> & { id: number }) => userService.update(userData),
    onSuccess: (_, variables) => {
      // Invalidate tất cả user queries để đảm bảo refetch
      queryClient.invalidateQueries({ queryKey: userKeys.all });
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
      // Invalidate tất cả user queries để đảm bảo refetch
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Hook để cập nhật danh sách users
export const useUpdateUsersList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (usersData: Array<Partial<User> & { id: number }>) => userService.updateList(usersData),
    onSuccess: () => {
      // Invalidate tất cả user queries để đảm bảo refetch
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Hook để xóa user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteById(id),
    onSuccess: () => {
      // Invalidate tất cả user queries để đảm bảo refetch
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Hook để lấy users theo role (employees hoặc customers) - luôn fetch data mới nhất
export const useUsersByRole = (role: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER', searchRequest: SearchRequest) => {
  return useQuery({
    queryKey: [...userKeys.list(searchRequest), 'role', role],
    queryFn: async () => {
      // Tạo search request với role filter
      const roleSearchRequest: SearchRequest = {
        ...searchRequest,
        lsCondition: [
          ...(searchRequest.lsCondition || []),
          {
            property: 'role',
            propertyType: 'string',
            operator: 'EQUAL',
            value: role
          }
        ],
        sortField: searchRequest.sortField || [
          {
            fieldName: 'createdDate',
            sort: 'DESC'
          }
        ]
      };
      
      return await userService.search(roleSearchRequest);
    },
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
