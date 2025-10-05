import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

interface UseMarketAssetsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useMarketAssets(params?: UseMarketAssetsParams) {
  return useQuery({
    queryKey: ["market-assets", params],
    queryFn: () => api.marketAssets.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Auto-refetch every 10 minutes
  });
}

export function useMarketAsset(symbolOrId: string | null) {
  return useQuery({
    queryKey: ["market-asset", symbolOrId],
    queryFn: () => api.marketAssets.get(symbolOrId!),
    enabled: !!symbolOrId,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePriceHistory(symbolOrId: string | null, days: number = 30) {
  return useQuery({
    queryKey: ["price-history", symbolOrId, days],
    queryFn: () => api.marketAssets.getHistory(symbolOrId!, days),
    enabled: !!symbolOrId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useSyncStatus() {
  return useQuery({
    queryKey: ["sync-status"],
    queryFn: () => api.marketAssets.getSyncStatus(),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

export function useTriggerSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (source: string) => api.marketAssets.triggerSync(source),
    onSuccess: () => {
      // Invalidate all market assets queries
      queryClient.invalidateQueries({ queryKey: ["market-assets"] });
      queryClient.invalidateQueries({ queryKey: ["sync-status"] });
    },
  });
}
