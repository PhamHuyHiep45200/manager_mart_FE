import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, Product, SearchRequest } from '../services/productService';

// Query keys cho product API
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: SearchRequest) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// Hook để lấy products với search và pagination - luôn fetch data mới nhất
export const useProducts = (searchRequest: SearchRequest) => {
  return useQuery({
    queryKey: productKeys.list(searchRequest),
    queryFn: () => productService.search(searchRequest),
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook để tạo product mới
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Product) => productService.create(productData),
    onSuccess: () => {
      // Invalidate và refetch product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Hook để cập nhật product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Partial<Product> & { id: number }) => productService.update(productData.id!, productData),
    onSuccess: (_, variables) => {
      // Invalidate và refetch product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Invalidate product detail nếu có
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
};

// Hook để xóa product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      // Invalidate và refetch product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

