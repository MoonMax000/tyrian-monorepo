import { Platform } from './platform';
import { Quote } from './quote';

export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number | null;
  circulating_supply: number;
  total_supply: number;
  platform: Platform;
  is_active: number;
  infinite_supply: boolean;
  cmc_rank: number;
  is_fiat: number;
  self_reported_circulating_supply: number;
  self_reported_market_cap: number;
  tvl_ratio: number | null;
  last_updated: string;
  quote: Quote;
  logo: string;
  fdv: number;
  volume_market_cap: number;
}
