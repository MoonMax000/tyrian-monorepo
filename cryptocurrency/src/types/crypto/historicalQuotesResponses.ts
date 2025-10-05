import { Quote } from './quote';

interface CoinInfo {
  quotes: QuoteWithTimestamp[];
  id: number;
  name: string;
  symbol: string;
  is_active: number;
  is_fiat: number;
}

interface QuoteWithTimestamp {
  timestamp: number;
  quote: Quote;
}

export interface HistoricalQuotesResponse {
  [symbol: string]: CoinInfo[];
}
