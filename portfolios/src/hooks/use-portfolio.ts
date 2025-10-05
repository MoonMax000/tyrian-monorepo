import { useQuery } from '@tanstack/react-query';
import { usePortfolios } from './use-portfolios';

export function usePortfolio(userId: string | null, portfolioId: string | null) {
  const { data: investmentsData } = usePortfolios(userId, 'investments');

  return useQuery({
    queryKey: ['portfolio', portfolioId],
    queryFn: () => {
      const portfolio = investmentsData?.items.find(p => p.id === portfolioId);
      if (!portfolio) throw new Error('Portfolio not found');
      return portfolio;
    },
    enabled: !!userId && !!portfolioId && !!investmentsData
  });
}
