import { api } from '@/api';

export interface PeperDetailsResponse {
  [key: string]: string;
  ticker: string;
  last_price: string;
  trades_number: string;
  today_volume: string;
  trading_regime: string;
  full_name: string;
  reg_number: string;
  issue_size: string;
  currency_id: string;
  settlement_date: string;
  prev_date: string;
  instrument_id: string;
  low_price: string;
  high_price: string;
  last_change: string;
  last_change_percents: string;
  capitalization: string;
}

interface AssetAyieldItem {
  market_title: string;
  trade_date: string;
  trades_number: number;
  value: number;
  volume: number;
  updated_at: string;
}

interface AssetAyieldResponse {
  data: AssetAyieldItem[];
  total_volume: number;
  total_trades: number;
  total_amount: number;
  total_volume_without_repo: number;
  total_trades_without_repo: number;
  total_amount_without_repo: number;
}

interface IndicesResponse {
  code: string;
  shortname: string;
  from_date: string;
  till_date: string;
  current_value: number;
  last_change_percents: number;
  last_change: number;
}

export interface historyResponce {
  close_price: number;
  date: string;
  high_price: number;
  low_price: number;
  num_trades: number;
  open_price: number;
  value: number;
  volume: number;
}

export interface NewsResponse {
  title: string;
  published_at: string;
  modified_at: string;
}

export const StocksService = {
  peperDetails(ticket: string) {
    return api.get<PeperDetailsResponse>(`/stocks/stocks/${ticket}`);
  },
  assetAyield(ticket: string) {
    return api.get<AssetAyieldResponse>(`stocks/stocks/${ticket}/aggregated-market-data/`);
  },
  indices(ticket: string) {
    return api.get<IndicesResponse[]>(`stocks/stocks/${ticket}/indices/`);
  },

  history(ticket: string, dateRange: string) {
    return api.get<historyResponce[]>(`stocks/stocks/${ticket}/prices-history/?${dateRange}`);
  },
  news() {
    return api.get<NewsResponse[]>(`/stocks/news/`);
  },
};
