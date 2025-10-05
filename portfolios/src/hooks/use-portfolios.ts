import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function usePortfolios(userId: string | null, category?: string) {
  return useQuery({
    queryKey: ['portfolios', userId, category],
    queryFn: () => api.portfolios.list(userId!, category),
    enabled: !!userId
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.portfolios.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    }
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => api.portfolios.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    }
  });
}
