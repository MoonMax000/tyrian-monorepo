import { getCookie } from '@/utilts/cookie';
import { createApi } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError } from 'axios';
import { env } from 'process';
import { TMethods } from './chatApi';
import { ApiError } from './socialWebApi';

export interface UserByEmail {
  avatar?: string;
  bio?: string;
  email?: string;
  username?: string;
}

const baseQuery = async (args: {
  url: string;
  method: TMethods;
  body?: unknown;
  params?: Record<string, unknown>;
}) => {
  try {
    const accessToken = getCookie('access-token');

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const { data } = await axios({
      url: args.url.startsWith('/') ? args.url.slice(1) : args.url,
      method: args.method,
      data: args.body,
      params: args.params,
      baseURL: env.NEXT_PUBLIC_BACKEND_AUTH_API || 'https://authservice.tyriantrade.com/api',
      headers,
      withCredentials: true,
    });
    return { data };
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    return {
      error: axiosError.response ? axiosError.response.data : { message: axiosError.message },
    };
  }
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  tagTypes: ['profile'],
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: () => ({
        url: '/accounts/logout/',
        method: 'POST',
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: '/accounts/me/',
        method: 'GET',
      }),
      providesTags: [{ type: 'profile', id: 'me' }],
    }),
    getUserByEmail: builder.query<UserByEmail, string>({
      query: (email) => ({
        url: `/accounts/user/by-email/?email=${email}`,
        method: 'GET',
      }),
    }),
  }),
});
export const { useLogoutMutation, useGetProfileQuery, useGetUserByEmailQuery } = authApi;
