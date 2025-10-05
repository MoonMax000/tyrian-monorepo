import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useTrades(
  userId: string | null,
  params?: {
    portfolioId?: string;
    assetCode?: string;
    operation?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  return useQuery({
    queryKey: ['trades', userId, params],
    queryFn: () => api.trades.list(userId!, params),
    enabled: !!userId
  });
}

export function useCreateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.trades.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });
}

export function useUpdateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId, data }: { id: string; userId: string; data: any }) =>
      api.trades.update(id, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    }
  });
}

export function useDeleteTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => api.trades.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    }
  });
}
