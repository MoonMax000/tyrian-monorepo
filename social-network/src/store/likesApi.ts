import { api } from './api';
import { Post } from './postsApi';

export interface PaginatedResponse {
  data: Post[];
  pagination: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
  status: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: string;
}

interface GetLikedPostsParams {
  page?: number;
  page_size?: number;
  sort_type?: 'latest' | 'recommended';
  post_type?: 'ideas' | 'video' | 'script' | 'all';
}

export const postsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLikedPosts: builder.query<PaginatedResponse, GetLikedPostsParams>({
      query: (params) => ({
        url: '/like',
        method: 'GET',
        params,
      }),
    }),

    likePost: builder.mutation<{ status: string }, string>({
      query: (postId) => ({
        url: `/like/${postId}`,
        method: 'PUT',
      }),
    }),

    unlikePost: builder.mutation<{ status: string }, string>({
      query: (postId) => ({
        url: `/like/${postId}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetLikedPostsQuery, useLikePostMutation, useUnlikePostMutation } = postsApi;
