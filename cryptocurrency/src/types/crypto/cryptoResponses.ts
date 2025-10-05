export interface TotalCapParams {
    count: number;
    interval: string;
}

export interface TotalCapResponse {
    quotes: Quote[];
}

export interface Quote {
    timestamp: string;
    quote: Record<number | string, CurrencyData>;
    btc_dominance: number;
    eth_dominance: number;
    active_cryptocurrencies: number;
    active_exchanges: number;
    active_market_pairs: number;
}

export interface CurrencyData {
    total_market_cap: number;
    total_volume_24h: number;
    total_volume_24h_reported: number;
    altcoin_market_cap: number;
    altcoin_volume_24h: number;
    altcoin_volume_24h_reported: number;
    timestamp: string;
}

export interface DetailsCapParams {
    range: string;
}

export interface DetailsCapResponse {
    points: MarketCapPoint[];
    historicalValues: HistoricalValues;
    yearlyPerformance: YearlyPerformance;
    thirtyDaysPercentage: number;
}

export interface MarketCapPoint {
    marketCap: number;
    volume: number;
    btcValue: number;
    ethValue: number;
    stableValue: number;
    otherValue: number;
    timestamp: string;
}

export interface HistoricalValues {
    now: { marketCap: number };
    yesterday: { marketCap: number };
    lastWeek: { marketCap: number };
    lastMonth: { marketCap: number };
}

export interface YearlyPerformance {
    high: { marketCap: number; timestamp: string };
    low: { marketCap: number; timestamp: string };
}

export interface FearAndGreedParams {
    limit: number;
}

export type FearAndGreedResponse = FearAndGreed[];

export interface FearAndGreed {
    timestamp: string
    value: number
    value_classification: string
}

export interface CoinInfoParams {
    id: string;
    count: number;
    interval: string;
}

export interface CoinInfoResponse {
    quotes: QuoteEntry[]
    id: number
    name: string
    symbol: string
    is_active: number
    is_fiat: number
}

export interface QuoteData {
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    price: number;
    volume_24h: number;
    market_cap: number;
    total_supply: number;
    circulating_supply: number;
    timestamp: string;
}

export interface QuoteEntry {
    timestamp: string;
    quote: Record<string, QuoteData>;
}
