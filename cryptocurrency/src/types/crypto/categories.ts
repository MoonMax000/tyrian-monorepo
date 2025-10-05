import { CryptoData } from './cryptoData';

export interface Category {
  id: string;
  name: string;
  title: string;
  description: string;
  avgPriceChange: number;
  marketCap: number;
  marketCapChange: number;
  volume: number;
  volume_change: number;
  last_updated: string;
  coin: string;
  maxPercentChange24: number;
  logo: string;
  slug: string;
  dominance: number;
}

export interface CategoryDetails {
  id: string;
  name: string;
  title: string;
  description: string;
  numTokens: number;
  lastUpdated: string;
  avgPriceChange: number;
  market_cap: number;
  market_cap_change: number;
  volume: number;
  volume_change: number;
  coins: CryptoData[];
}
