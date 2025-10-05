import { api } from '@/api';

export interface IMarketLeadersEl {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  icon?: string;
}

export const MainPageService = {
  async marketLeadersGrowth(country: string, limit?: number) {
    const resp = await api.get<IMarketLeadersEl[]>(
      `stocks/parsed/market-leaders-growth/${country}/${limit ? `?limit=${limit}` : ''}`,
    );
    return resp.data;
  },
  async marketLeadersVolume(country: string, limit?: number) {
    const resp = await api.get<IMarketLeadersEl[]>(
      `stocks/parsed/market-leaders-volume/${country}/${limit ? `?limit=${limit}` : ''}`,
    );
    return resp.data;
  },
  async marketLeadersVolatile(country: string, limit?: number) {
    const resp = await api.get<IMarketLeadersEl[]>(
      `stocks/parsed/market-leaders-volatile/${country}/${limit ? `?limit=${limit}` : ''}`,
    );
    return resp.data;
  },
  async marketLeadersLosers(country: string, limit?: number) {
    const resp = await api.get<IMarketLeadersEl[]>(
      `stocks/parsed//market-losers/${country}/${limit ? `?limit=${limit}` : ''}`,
    );
    return resp.data;
  },
};
