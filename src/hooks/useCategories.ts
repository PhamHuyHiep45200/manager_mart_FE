import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, Category, SearchRequest } from '../services/categoryService';

// Query keys cho category API
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: SearchRequest) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  roots: () => [...categoryKeys.all, 'roots'] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  children: (id: number) => [...categoryKeys.all, 'children', id] as const,
};

// Hook để lấy danh sách categories với search và pagination - luôn fetch data mới nhất
export const useCategories = (searchRequest: SearchRequest) => {
  return useQuery({
    queryKey: categoryKeys.list(searchRequest),
    queryFn: () => categoryService.search(searchRequest),
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook để lấy tất cả root categories - luôn fetch data mới nhất
export const useRootCategories = () => {
  return useQuery({
    queryKey: categoryKeys.roots(),
    queryFn: () => categoryService.getRoots(),
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook để lấy category tree - luôn fetch data mới nhất
export const useCategoryTree = () => {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => categoryService.getTree(),
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook để lấy children của một category - luôn fetch data mới nhất
export const useCategoryChildren = (id: number) => {
  return useQuery({
    queryKey: categoryKeys.children(id),
    queryFn: () => categoryService.getChildren(id),
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !!id, // Chỉ fetch khi có id
  });
};

// Hook để tạo category mới
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: Category) => categoryService.create(categoryData),
    onSuccess: () => {
      // Invalidate và refetch tất cả category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

// Hook để cập nhật category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: Partial<Category> & { id: number }) => categoryService.update(categoryData),
    onSuccess: (_, variables) => {
      // Invalidate và refetch tất cả category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      // Invalidate category detail nếu có
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
};

// Hook để xóa category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: () => {
      // Invalidate và refetch tất cả category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

// Hook để lấy categories theo parentId (để hiển thị children)
export const useCategoriesByParent = (parentId: number | null, searchRequest: SearchRequest) => {
  return useQuery({
    queryKey: [...categoryKeys.list(searchRequest), 'parent', parentId],
    queryFn: async () => {
      if (parentId === null) {
        // Lấy root categories
        return categoryService.getRoots();
      } else {
        // Lấy children của parent category
        return categoryService.getChildren(parentId);
      }
    },
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
