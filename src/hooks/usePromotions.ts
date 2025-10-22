import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionService, Promotion, SearchRequest } from '../services/promotionService';

// Query keys cho promotion API
export const promotionKeys = {
  all: ['promotions'] as const,
  lists: () => [...promotionKeys.all, 'list'] as const,
  list: (filters: SearchRequest) => [...promotionKeys.lists(), filters] as const,
  details: () => [...promotionKeys.all, 'detail'] as const,
  detail: (id: number) => [...promotionKeys.details(), id] as const,
};

// Hook để lấy promotions với search và pagination - luôn fetch data mới nhất
export const usePromotions = (searchRequest: SearchRequest) => {
  return useQuery({
    queryKey: promotionKeys.list(searchRequest),
    queryFn: () => promotionService.search(searchRequest),
    staleTime: 0, // Luôn fetch data mới nhất cho admin
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook để tạo promotion mới
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promotionData: Promotion) => promotionService.create(promotionData),
    onSuccess: () => {
      // Invalidate và refetch promotion lists
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
    },
  });
};

// Hook để cập nhật promotion (nếu có API update)
export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promotionData: Partial<Promotion> & { id: number }) => {
      // TODO: Implement update API when available
      throw new Error('Update API not implemented yet');
    },
    onSuccess: (_, variables) => {
      // Invalidate và refetch promotion lists
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      // Invalidate promotion detail nếu có
      queryClient.invalidateQueries({ queryKey: promotionKeys.detail(variables.id) });
    },
  });
};

// Hook để xóa promotion (nếu có API delete)
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      // TODO: Implement delete API when available
      throw new Error('Delete API not implemented yet');
    },
    onSuccess: () => {
      // Invalidate và refetch promotion lists
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
    },
  });
};
