import { api } from '@/api';

export interface MarketLeader {
  symbol: string;
  companyName: string;
  marketCap: number;
  sector: string;
  industry: string;
  beta: number;
  price: number;
  lastAnnualDividend: number;
  volume: number;
  exchange: string;
  exchangeShortName: string;
  country: string;
  isEtf: boolean;
  isFund: boolean;
  isActivelyTrading: boolean;
  change_percent_1h: number | null;
  change_percent_24h: number;
  change_percent_7d: number;
  icon: string;
}

export interface GetMarketLeadersParams {
  limit?: number;
  sector?: string;
  sort_by?:
    | 'change_percent_1h'
    | 'change_percent_24h'
    | 'change_percent_7d'
    | 'volume_24h'
    | 'market_cap'
    | 'name';
  sort_direction?: 'asc' | 'desc';
  country: string;
}

export interface GetMarketLeadersTypeParams extends GetMarketLeadersParams {
  type?: 'gainers' | 'losers';
}

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

export interface IPaperResponse {
  icon: string;
  price: number;
  changesPercentage: number;
  symbol: string;
  name: string;
  exchange: string;
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

export interface CashFlowResponse {
  date: string;
  netCashProvidedByOperatingActivities: number;
  netCashUsedForInvestingActivites: number;
  netCashUsedProvidedByFinancingActivities: number;
  reportedCurrency: string;
}

export interface DebtsAssetsResponse {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  totalDebt: number;
  netDebt: number;
  reportedCurrency: string;
}

export interface IncomeAndRevenueHistoryResponse {
  date: string;
  revenue: number;
  grossProfit: number;
  netIncome: number;
  reportedCurrency: string;
}

export interface FundamentalAnalysisResponse {
  peRatio: { company: number; industry: number };
  pbRatio: { company: number; industry: number };
  enterpriseValueOverEBITDA: { company: number; industry: number };
  netDebtToEBITDA: { company: number; industry: number };
  roe: { company: number; industry: number };
  year_price: { min: number; max: number; current: number };
}

export interface RevenueNetProfitResponse {
  date: string;
  revenue: number;
  netIncome: number;
  reportedCurrency: string;
}
interface FinancialAnalysis {
  totalNonCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  totalNonCurrentAssets: number;
  totalCurrentAssets: number;
}
interface IDepbtsAndCoverage {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  cashAndCashEquivalents: number;
  reportedCurrency: string;
}
export interface IFinancicalStabilityResponse {
  depbts_and_coverage: IDepbtsAndCoverage[];
  financial_analysis: FinancialAnalysis;
}
interface IHoldersTopResponse {
  holder: string;
  shares: number;
  sharesPercent: number;
  change: number;
}

export interface QuotationChartResponse {
  date: string;
  revenue: number;
  ebitda: number;
  netIncome: number;
  netIncomeRatio: number;
  freeCashFlow: number;
  totalLiabilities: number;
}

export interface IHoldersTableEl {
  holder: string;
  shares: number;
  sharesPercent: number;
  value: number;
  holderType: string;
}

interface Platform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
}

interface Quote {
  fully_diluted_market_cap: number;
  last_updated: string;
  market_cap: number;
  market_cap_dominance: number;
  percent_change_1h: number;
  percent_change_7d: number;
  percent_change_24h: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  price?: number | null;
  tvl: null | string;
  volume_24h: number;
  volume_change_24h: number;
}

type Tag =
  | 'collectibles-nfts'
  | 'memes'
  | 'solana-ecosystem'
  | 'animal-memes'
  | 'ip-memes'
  | 'made-in-america'
  | 'binance-hodler-airdrops'
  | 'binance-ecosystem'
  | 'binance-listing';

export interface CryptoResponse {
  circulating_supply: number;
  cmc_rank: number;
  date_added: string;
  id: number;
  infinite_supply: boolean;
  is_active: number;
  is_fiat: number;
  last_updated: string;
  logo: string;
  max_supply: null | number;
  name: string;
  num_market_pairs: number;
  platform: Platform;
  quote: { USD: Quote };
  self_reported_circulating_supply: string;
  self_reported_market_cap: string;
  slug: string;
  symbol: string;
  tags: Tag[];
  total_supply: number;
  tvl_ratio: null | number;
}

export interface Bond {
  agents_eng: string;
  agents_rus: string;
  announced_volume_new: null | string;
  auction_type_id: null | string;
  auction_type_name_eng: string;
  auction_type_name_rus: string;
  bbgid: string;
  bbgid_144a: string;
  bbgid_composite: null | string;
  bbgid_ticker: string;
  bbgid_ticker_144a: null | string;
  bond_issue_form: string;
  bond_issue_form_name_eng: string;
  bond_issue_form_name_rus: string;
  bond_rank: string;
  bond_rank_name_eng: string;
  bond_rank_name_rus: string;
  bond_type: string;
  book_closing_date: null;
  book_opening_date: null | string;
  business_day_convention_id: null | string;
  business_day_convention_name_eng: null | string;
  cbrf_listing_lombard_last_date_date: null | string;
  cdo_bond: string;
  cfi_code: string;
  cfi_code_144a: string;
  coco_bond: string;
  common_code: string;
  common_code_144a: string;
  convert_cond_eng: string;
  convert_cond_rus: string;
  convertable: string;
  coupon_type_id: string;
  coupon_type_name_eng: string;
  coupon_type_name_rus: string;
  cup: null | string;
  cupon_eng: string;
  cupon_period: string;
  cupon_rus: string;
  curr_coupon_date: string;
  curr_coupon_rate: string;
  curr_coupon_sum: string;
  currency_id: string;
  currency_name: string;
  cusip_144a: string;
  cusip_regs: string;
  date_of_end_placing: string;
  date_of_start_circulation: null | string;
  date_of_start_placing: null | string;
  dcc_code: string;
  dcc_code_144a: string;
  document_eng: string;
  document_ita: string;
  document_pol: string;
  document_rus: string;
  dual_currency_bond: string;
  early_redemption_date: null | string;
  emission_cbr_code: string;
  emission_coupon_rate: string;
  emission_cupon_basis_id: string;
  emission_cupon_basis_title: string;
  emission_emitent_id: string;
  emission_wkn_code: string;
  emission_wkn_code_144a: string;
  emitent_branch_id: string;
  emitent_branch_name_eng: string;
  emitent_branch_name_rus: string;
  emitent_country: string;
  emitent_country_name_eng: string;
  emitent_country_name_rus: string;
  emitent_country_region_id: string;
  emitent_country_subregion_id: string;
  emitent_full_name_eng: string;
  emitent_full_name_rus: string;
  emitent_id: string;
  emitent_inn: string;
  emitent_name_eng: string;
  emitent_name_rus: string;
  emitent_reg_form_id: string;
  emitent_reg_form_name_eng: string;
  emitent_reg_form_name_rus: string;
  emitent_type: string;
  emitent_type_name_eng: string;
  emitent_type_name_rus: string;
  eurobonds_nominal: null | string;
  exchanged_from: string;
  exchanged_to: string;
  first_coupon_end: string;
  floating_rate: string;
  floating_rates_day: null | string;
  floor: null | string;
  for_qualified_investors: string;
  foreign_bond: string;
  formal_emitent_branch_id: null | string;
  formal_emitent_country: null | string;
  formal_emitent_id: null | string;
  formal_emitent_name_rus: null | string;
  formal_emitent_reg_form_id: null | string;
  formal_emitent_type: null | string;
  green_bonds: string;
  guaranteed_bonds: string;
  guarantor_id: null;
  guarantor_name_eng: null | string;
  guarantor_name_rus: null | string;
  has_default: string;
  has_tap_issue: string;
  has_unsettled_default: string;
  id: string;
  income_of_primary_placing: string;
  indexation_eng: string;
  indexation_rus: string;
  indexation_type: null | string;
  indexation_type_name_eng: null | string;
  indexation_type_name_rus: null | string;
  initial_nominal_price: string;
  initial_placement_volume: null;
  integral_multiple: string;
  investment_bond: string;
  isin_code: string;
  isin_code_3: string;
  isin_code_144a: string;
  issue_form_id: null;
  issue_form_name_eng: string;
  issue_form_name_rus: string;
  kind_id: string;
  kind_name_eng: string;
  kind_name_ita: string;
  kind_name_pol: string;
  kind_name_rus: string;
  margin: null;
  maturity_date: string;
  micex_shortname: string;
  more_eng: string;
  more_rus: string;
  mortgage_bonds: string;
  ndc_code: string;
  next_replacing_amount: null | string;
  next_replacing_date: null | string;
  nkd_calc_types_id: string;
  nkd_calc_types_name_eng: string;
  nkd_calc_types_name_rus: string;
  nominal_price: string;
  non_complex_financial_instrument: string;
  number_of_emission: string;
  number_of_emission_eng: string;
  number_of_trades_on_issue_date: null | string;
  offert_date: null | string;
  offert_date_call: null | string;
  offert_date_put: null | string;
  offert_eng: string;
  offert_rus: string;
  order_book: null | string;
  outstanding_nominal_price: string;
  outstanding_volume: string;
  payment_currency_id: string;
  payment_currency_name: string;
  perpetual: string;
  pik: string;
  placed_volume_new: string;
  placing_type_id: null | string;
  placing_type_name_eng: string;
  placing_type_name_rus: string;
  price_of_primary_placing: string;
  private_issue: string;
  private_offering_id: string;
  private_offering_name_eng: string;
  private_offering_name_rus: string;
  redemption_linked: string;
  redemption_price: string;
  reference_rate_id: null | string;
  reference_rate_name_eng: string;
  reference_rate_name_rus: string;
  reg_s: string;
  registration_date: null | string;
  remaining_outstand_amount: string;
  restructing: string;
  restructing_date: null | string;
  retail_bond: string;
  secured_debt: string;
  securitisation: string;
  serial_of_emission: string;
  settlement_date: string;
  settlement_duration: string;
  social_bond: string;
  spread_us_treasures: null | string;
  ss_current_trading_grounds: string;
  ss_trading_grounds: null | string;
  state_reg_number: string;
  status_id: string;
  status_name_eng: string;
  status_name_rus: string;
  structured_note: string;
  subkind_id: string;
  subkind_name_eng: string;
  subkind_name_rus: string;
  subordinated_debt: string;
  sukuk_bond: string;
  sustainability_bond: string;
  sustainability_linked_bond: string;
  trace_eligible_securites: string;
  transition_bond: string;
  underlying_class_id: null | string;
  underlying_class_name_eng: null | string;
  update_time: string;
  updating_date: string;
  usd_volume: string;
  variable_rate_type_id: null | string;
  vid_id: string;
  vid_name_eng: string;
  vid_name_rus: string;
}

interface Params {
  category?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortDir?: string;
}

export type CryptoFilter = 'gainers' | 'losers';

export const StocksService = {
  getMarketLeadersGrowthFull(params: GetMarketLeadersParams) {
    const { country, ...query } = params;
    return api.get<MarketLeader[]>(`stocks/parsed/market-leaders-growth-full/${country}/`, {
      params: query,
    });
  },

  getMarketLeadersType(params: GetMarketLeadersTypeParams) {
    const { country, ...query } = params;
    return api.get<MarketLeader[]>(`stocks/parsed/market-leaders-type/${country}/`, {
      params: query,
    });
  },

  crypto({ category, limit, page, sortBy, sortDir }: Params) {
    return api.get<string, { data: { data: CryptoResponse[] } }>(
      `/stocks/parsed/crypto/?category=${category ?? 'all'}&limit=${limit ?? 9}&page=${page ?? 1}${sortBy ? `&sort_by=${sortBy}` : ''}${sortDir ? `&sort_direction=${sortDir}` : ''}`,
    );
  },
  gainers_losers(filter: CryptoFilter) {
    return api.get<string, { data: { data: CryptoResponse[] } }>(
      `/stocks/parsed/crypto-gainers-losers/?filter=${filter}`,
    );
  },
  tvlRanking() {
    return api.get<string, { data: { data: CryptoResponse[] } }>(
      `/stocks/parsed/crypto-tvl-ranking/`,
    );
  },
  corporateBonds(kind?: string) {
    return api.get<string, { data: { data: Bond[] } }>(
      `/stocks/parsed/emissions/corporate/?kind=${kind}`,
    );
  },
  governmentBonds(kind?: string) {
    return api.get<string, { data: { data: Bond[] } }>(
      `/stocks/parsed/emissions/goverment/?kind=${kind}`,
    );
  },
  roe(country: string, ticker: string) {
    return api.get(`/stocks/parsed/roe/${country}/${ticker}`);
  },
  dividends(country: string, ticker: string) {
    return api.get(`/stocks/parsed/dividends/${country}/${ticker}/`);
  },
  financials(country: string, ticker: string) {
    return api.get(`/stocks/parsed/finanscial-stability/${country}/${ticker}/`);
  },
  peperDetails(ticket: string) {
    return api.get<PeperDetailsResponse>(`/stocks/stocks/${ticket}`);
  },

  stockInfo(country: string, ticket: string) {
    return api.get<IPaperResponse>(`stocks/parsed/stock-info/${country}/${ticket}/`);
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
  cashFlow(ticker: string) {
    return api.get<string, { data: CashFlowResponse[] }>(`/stocks/parsed/cash-flow/us/${ticker}/`);
  },
  debtsAssets(ticker: string) {
    return api.get<DebtsAssetsResponse[]>(`/stocks/parsed/depbts-assets/us/${ticker}/`);
  },
  incomeAndRevenueHistory(ticker: string) {
    return api.get<IncomeAndRevenueHistoryResponse[]>(
      `/stocks/parsed/revenue-history/us/${ticker}/`,
    );
  },
  fundamentalAnalysis(ticker: string) {
    return api.get<FundamentalAnalysisResponse>(
      `/stocks/parsed/fundamental-analysis/us/${ticker}/`,
    );
  },
  revenueNetProfit(country: string, ticker: string) {
    return api.get<RevenueNetProfitResponse[]>(
      `stocks/parsed/revenue-net-profit/${country}/${ticker}/?limit=5`,
    );
  },
  financialStability(country: string, ticker: string) {
    return api.get<IFinancicalStabilityResponse>(
      `stocks/parsed/financial-stability/${country}/${ticker}/`,
    );
  },
  holdersTop(country: string, ticker: string) {
    return api.get<IHoldersTopResponse[]>(
      `stocks/parsed/holders-structure/${country}/${ticker}/?limit=5`,
    );
  },
  holdersTable(country: string, ticker: string) {
    return api.get<IHoldersTableEl[]>(`stocks/parsed/holders-table/${country}/${ticker}/?limit=10`);
  },
  quotationChart({ ticker, start, end }: { ticker: string; start: string; end: string }) {
    return api.get<QuotationChartResponse[]>(`stocks/parsed/quotation-chart/us/${ticker}`, {
      params: { start, end },
    });
  },
};
