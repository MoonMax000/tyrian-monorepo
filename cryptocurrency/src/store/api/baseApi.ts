import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../middleware/axiosMiddleware';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: ['Crypto', 'User'],
});
