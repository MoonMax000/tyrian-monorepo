import { api } from './client';

export type CoinInfo = {
  id: number;
  name: string;
  symbol: string;
  category: string;
  description: string;
  slug: string;
  subreddit: string;
};

export async function getCoinInfo(slug: string): Promise<CoinInfo> {
  const response = await api.get(`/cmc/info/`, {
    params: {
      slug,
      skip_invalid: false,
      aux: 'description,tags'
    }
  });

  return Object.values(response.data)?.at(0) as CoinInfo;
}