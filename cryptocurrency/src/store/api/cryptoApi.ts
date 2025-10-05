import { CryptoData, SortOrder, TimePeriod } from '@/types';
import { baseApi } from './baseApi';
import { LongShortRatio } from '@/types/crypto/longShort';
import {
  DetailsCapResponse,
  DetailsCapParams,
  TotalCapParams,
  TotalCapResponse,
  FearAndGreedParams,
  FearAndGreedResponse,
  CoinInfoParams, CoinInfoResponse,
} from '@/types/crypto/cryptoResponses';
import { Category, CategoryDetails } from '@/types/crypto/categories';
import { HistoricalQuotesResponse } from '@/types/crypto/historicalQuotesResponses';

interface LongShortRatioParams {
  symbol: string;
  period: string;
}

interface CategoriesParams {
  page: number;
  limit: number;
}

interface CategoryDetailsParams {
  id: string;
  page: number;
  limit: number;
}

interface LatestQuotesParams {
  symbol: string;
  time_start: string;
  time_end: string;
  interval: TimePeriod;
  limit?: number;
}

interface ListingLatestParams {
  limit: number;
  page?: number;
  sort?: string;
}

interface GainersLosersParams {
  limit?: number;
  sort_dir?: SortOrder;
}

export const cryptoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLatest: builder.query<any, void>({
      query: () => ({
        url: `/trending/latest`,
        method: 'GET',
      }),
      providesTags: ['Crypto'],
    }),
    getGainersLosers: builder.query<CryptoData[], GainersLosersParams>({
      query: ({ limit = 6, sort_dir = 'desc' }) => ({
        url: `/trending/gainers-losers`,
        params: {
          limit,
          sort_dir,
        },
        method: 'GET',
      }),
      providesTags: ['Crypto'],
    }),
    getLongShortRatio: builder.query<LongShortRatio[], LongShortRatioParams>({
      query: ({ symbol, period }) => ({
        url: `/exchanges/long_short_ratio/binance`,
        params: { symbol, period, limit: 50 },
        method: 'GET',
      }),
      providesTags: ['Crypto'],
    }),
    getListingLatest: builder.query<CryptoData[], ListingLatestParams>({
      query: ({ limit, page, sort }) => ({
        url: `/listings/latest`,
        method: 'GET',
        params: {
          start: page ? (page - 1) * limit + 1 : 1,
          limit,
          sort,
        },
      }),
      providesTags: ['Crypto'],
    }),
    getMostVolatileCoins: builder.query<CryptoData[], void>({
      query: () => ({
        url: `/listings/latest`,
        method: 'GET',
        params: {
          limit: 100,
        },
      }),
      transformResponse: (response: CryptoData[]) => {
        return response
          .slice()
          .sort((a, b) => {
            const volatilityA = Math.abs(a.quote.USD.percent_change_24h);
            const volatilityB = Math.abs(b.quote.USD.percent_change_24h);
            return volatilityB - volatilityA;
          })
          .slice(0, 6);
      },
      providesTags: ['Crypto'],
    }),
    getTotalCap: builder.query<TotalCapResponse, TotalCapParams>({
      query: ({ count, interval }) => ({
        url: `/global-metrics/quotes-historical`,
        method: 'GET',
        params: {
          count,
          interval,
          convert_id: '2781',
        },
      }),
      providesTags: ['Crypto'],
    }),
    getDetailsCap: builder.query<DetailsCapResponse, DetailsCapParams>({
      query: ({ range }) => ({
        url: `/quotes/historical-diagrams`,
        method: 'GET',
        params: {
          range,
          convertId: '2806',
          module: 'marketcap',
        },
      }),
      providesTags: ['Crypto'],
    }),
    getFearAndGreed: builder.query<FearAndGreedResponse, FearAndGreedParams>({
      query: ({ limit }) => ({
        url: `/fear-and-greed/historical`,
        method: 'GET',
        params: {
          limit,
        },
      }),
      providesTags: ['Crypto'],
    }),
    getCategories: builder.query<Category[], CategoriesParams>({
      query: ({ page, limit }) => ({
        url: `/categories`,
        method: 'GET',
        params: {
          start: (page - 1) * limit + 1,
          limit,
        },
      }),
      providesTags: ['Crypto'],
    }),
    getCategoryDetails: builder.query<CategoryDetails, CategoryDetailsParams>({
      query: ({ id, page, limit }) => ({
        url: `/categories/category`,
        method: 'GET',
        params: {
          id,
          start: (page - 1) * limit + 1,
          limit,
        },
      }),
      providesTags: ['Crypto'],
    }),
    getLatestQuote: builder.query<CryptoData, string>({
      query: (slug) => ({
        url: `/quotes/latest`,
        method: 'GET',
        params: {
          slug,
        },
      }),
      transformResponse: (response: CryptoData[]) => {
        return response[0];
      },
      providesTags: ['Crypto'],
    }),
    getLatestHistoricalQuotes: builder.query<HistoricalQuotesResponse, LatestQuotesParams>({
      query: ({ symbol, time_start, time_end, interval, limit }) => ({
        url: `/quotes/historical`,
        method: 'GET',
        params: {
          time_start,
          time_end,
          interval,
          symbol,
          limit,
        },
      }),
      providesTags: ['Crypto'],
    }),
    getCoinInfo: builder.query<CoinInfoResponse, CoinInfoParams>({
      query: ({ count, interval, id }) => ({
        url: `/quotes/historical`,
        method: 'GET',
        params: {
          count,
          interval,
          id,
          convertId: '2806',
        },
      }),
      providesTags: ['Crypto'],
    }),
  }),
});

export const {
  useGetLatestQuery,
  useGetTotalCapQuery,
  useGetDetailsCapQuery,
  useGetFearAndGreedQuery,
  useGetCoinInfoQuery,
  useGetGainersLosersQuery,
  useGetLongShortRatioQuery,
  useGetListingLatestQuery,
  useGetMostVolatileCoinsQuery,
  useGetCategoriesQuery,
  useGetCategoryDetailsQuery,
  useGetLatestQuoteQuery,
  useGetLatestHistoricalQuotesQuery,
} = cryptoApi;
