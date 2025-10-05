import { getCookie } from '@/utilts/cookie';
import { createApi } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
}

export interface SubscribeResponse {
  message: string;
  status: string;
}

export interface SubscribersResponse {
  status: string;
  data: Array<{ id: string; username: string }>;
  pagination: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
}

export interface SubscriptionsResponse {
  status: string;
  data: string[];
}

export interface UserResponse {
  id: string;
  username: string;
  description: string;
  avatar_url: string;
  cover_url: string;
  is_subscribed: boolean | null;
  subscriber_count: number;
}

const socialWebBaseURL = 'https://socialweb-api.tyriantrade.com/api/v1/';

const baseQuery = async (args: {
  url: string;
  method: 'GET' | 'POST';
  body?: { user_id: string } | null;
  params?: Record<string, string | number>;
}) => {
  try {
    const accessToken = getCookie('access-token');

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const { data } = await axios({
      url: args.url,
      method: args.method,
      data: args.body,
      params: args.params,
      baseURL: socialWebBaseURL,
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

export const socialWebApi = createApi({
  reducerPath: 'socialWebApi',
  baseQuery,
  endpoints: (builder) => ({
    subscribeToUser: builder.mutation<SubscribeResponse, { user_id: string }>({
      query: ({ user_id }) => ({
        url: 'users/me/follow',
        method: 'POST',
        body: { user_id },
      }),
    }),

    unsubscribeFromUser: builder.mutation<SubscribeResponse, { user_id: string }>({
      query: ({ user_id }) => ({
        url: 'users/me/unfollow',
        method: 'POST',
        body: { user_id },
      }),
    }),

    getSubscribers: builder.query<
      SubscribersResponse,
      { page?: number; pageSize?: number; sortBy?: string; sortDir?: string }
    >({
      query: ({ page = 1, pageSize = 10, sortBy = 'username', sortDir = 'asc' }) => ({
        url: 'users/me/followers',
        method: 'GET',
        params: { page, page_size: pageSize, sort_by: sortBy, sort_dir: sortDir },
      }),
    }),

    getSubscriptions: builder.query<SubscriptionsResponse, void>({
      query: () => ({
        url: 'users/me/followed',
        method: 'GET',
      }),
    }),
    getUserById: builder.query<UserResponse, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: { status: string; data: UserResponse }) => response.data,
    }),
  }),
});

export const {
  useSubscribeToUserMutation,
  useGetSubscribersQuery,
  useGetSubscriptionsQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUnsubscribeFromUserMutation,
} = socialWebApi;
