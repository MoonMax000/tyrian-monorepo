import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useAssets(userId: string | null, portfolioId?: string, category?: string) {
  return useQuery({
    queryKey: ['assets', userId, portfolioId, category],
    queryFn: () => api.assets.list(userId!, portfolioId, category),
    enabled: !!userId
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.assets.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });
}

export function useUpdateAssetPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, price, source }: { id: string; price: number; source?: string }) =>
      api.assets.updatePrice(id, price, source),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => api.assets.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });
}
