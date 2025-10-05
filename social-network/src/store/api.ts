import { createApi } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError } from 'axios';
import { env } from 'process';
import { ContentBlock, Post, Tag } from './postsApi';

interface ApiError {
  message: string;
}

export type TSortPost = 'title' | 'content' | 'type' | 'created' | 'popular' | '';
export type TPostType = 'ideas' | 'videos' | 'opinions' | 'analytics' | 'softwares' | '';

export const isPostType = (value: string | undefined): value is TPostType => {
  if (!value) return false;
  return ['ideas', 'videos', 'opinions', 'analytics', 'softwares'].includes(value);
};

interface IUser {
  avatar_url: string;
  cover_url: string;
  donation_url: string;
  id: string;
  username: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GetUserPostsResponse {
  status: string;
  data: Post[] | Tag[];
  pagination: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
}
export const isPost = (item: Post | Tag): item is Post => {
  return 'user_name' in item;
};

export interface GetUsersSerchResponse {
  status: string;
  data: IUser[];
  pagination: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
}

export interface PostsSearchRequest {
  userId?: string;
  q?: string;
  sort?: TSortPost;
  type?: TPostType;
  page?: number;
  page_size?: number;
  sort_type?: string;
  tags?: string;
  filter?: TPostType;
}

export interface UsersSearchRequest {
  q?: string;
  page?: number;
  page_size?: number;
  sort_type?: string;
}

export interface RegisterResponse {
  status: string;
  data: {
    token: string;
  };
}

export interface AuthRequest {
  identity: string;
  password: string;
}

export interface GetMeResponse {
  email: string;
  id: string;
}

export interface EmailConfirmResponse {
  message: string;
  status: string;
}

export interface CreatePostRequest {
  content: string;
  media_url?: string;
  title: string;
  type: string;
}

export interface CreatePostResponse {
  status: string;
  data: {
    id: string;
    first_block_id?: string;
    blocks?: ContentBlock[];
    content?: string;
  };
}

export interface UserResponse {
  id: string;
  username: string;
  description: string;
  avatar_url: string;
  cover_url: string;
  is_subscribed: boolean;
  followed_count: number;
  follower_count: number;
  post_count: number;
  created: string;
}

export interface GetFollowingResponse {
  status: string;
  data: Follower[];
  pagination: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
}

export interface Follower {
  id: string;
  username: string;
  avatar_url: string;
  follower_count: number;
  is_subscribed: false;
}

export interface GetFollowersResponse {
  status: string;
  data: Follower[];
  pagination: {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
}

interface NotificationSettings {
  desktop_notifications: boolean;
  enable_notifications: boolean;
  notification_sound: boolean;
  suspicious_attempts_to_logon: boolean;
  when_idea_update_email: boolean;
  when_idea_update_ws: boolean;
  when_script_update_email: boolean;
  when_script_update_ws: boolean;
  when_someone_comments_you_idea_email: boolean;
  when_someone_comments_you_idea_ws: boolean;
  when_someone_follows_you_email: boolean;
  when_someone_follows_you_ws: boolean;
  when_someone_likes_you_idea_email: boolean;
  when_someone_likes_you_idea_ws: boolean;
  when_someone_mentions_you_in_idea_comment_ws: boolean;
  when_someone_mentions_you_in_idea_comments_ws: boolean;
  when_someone_mentions_you_in_opinion_email: boolean;
  when_someone_mentions_you_in_opinion_ws: boolean;
  when_someone_mentions_you_while_you_offline_email: boolean;
  when_someone_mentions_you_while_you_offline_ws: boolean;
  when_they_publish_new_idea_email: boolean;
  when_they_publish_new_idea_ws: boolean;
  when_they_publish_new_opinion_email: boolean;
  when_they_publish_new_opinion_ws: boolean;
}

export interface GetProfileMeResponse {
  avatar_url: string;
  cover_url: string;
  description: string;
  donation_url: string;
  email: string;
  email_confirmed: boolean;
  id: string;
  notification_settings: NotificationSettings;
  username?: string;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateAvatarResponse {
  url: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ChangePasswordResponse {
  message: string;
  status: string;
}

export interface File {
  ext: string;
  file_size: number;
  id: string;
  name: string;
  type: string;
  url: string;
  user_name: string;
}

export interface CreatePostBlockParams {
  id?: string;
  prevBlockId?: string;
  body: FormData;
}

export interface PostData {
  content: string;
  created: string;
  files: File[];
  id: string;
  media_url: string;
  next_block: string;
  post_id: string;
  prev_block: string;
}

const baseQuery = async (args: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  params?: Record<string, any>;
}) => {
  try {
    const { data } = await axios({
      url: args.url.startsWith('/') ? args.url.slice(1) : args.url,
      method: args.method,
      data: args.body,
      params: args.params,
      baseURL: env.NEXT_PUBLIC_BACKEND_API || 'https://socialweb-api.tyriantrade.com/api/v1/',
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

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Profile', 'Comments', 'FavoritePosts'],
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (registerData) => ({
        url: 'auth/register',
        method: 'POST',
        body: registerData,
      }),
    }),
    auth: builder.mutation<RegisterResponse, AuthRequest>({
      query: (authData) => ({
        url: 'auth/login',
        method: 'POST',
        body: authData,
      }),
    }),

    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: 'auth/get-me',
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.id) {
            localStorage.setItem('uid', data.id);
          }
        } catch (error) {
          console.log('GET ME ERROR:', error);
        }
      },
    }),
    getProfileMe: builder.query<GetProfileMeResponse, void>({
      query: () => ({
        url: 'profile/me',
        method: 'GET',
      }),
      providesTags: [{ type: 'Profile', id: 'ME' }],
    }),
    updateAvatar: builder.mutation<UpdateAvatarResponse, FormData>({
      query: (formData) => ({
        url: 'profile/me/set-avatar',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Profile', id: 'ME' }],
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: 'auth/password/change',
        method: 'POST',
        body: passwordData,
      }),
    }),
    confirmEmail: builder.mutation<EmailConfirmResponse, string>({
      queryFn: async (token) => {
        try {
          const response = await axios.get(
            `${
              env.NEXT_PUBLIC_BACKEND_API || 'https://socialweb-api.tyriantrade.com/api/v1/'
            }auth/email/confirm?token=${token}`,
            {
              validateStatus: () => true,
              maxRedirects: 0,
            },
          );

          if (response.status === 302) {
            return { data: { message: 'Redirect success', status: 'ok' } };
          }

          return { data: response.data };
        } catch (error) {
          console.log('AXIOS ERROR:', error);
          return { error: { message: 'Ошибка при подтверждении email' } };
        }
      },
    }),
    createPost: builder.mutation<CreatePostResponse, FormData>({
      query: (formData) => ({
        url: 'posts/create',
        method: 'POST',
        body: formData,
      }),
    }),
    createPostBlock: builder.mutation<PostData, CreatePostBlockParams>({
      query: (params) => ({
        url: `posts/create/${params.id}/block`,
        method: 'POST',
        params: {
          prev_block: params.prevBlockId,
        },
        body: params.body,
      }),
    }),
    updatePost: builder.mutation<
      PostData,
      { id: string | null; body: { title: string; type: string | null } }
    >({
      query: (params) => ({
        url: `posts/${params?.id}`,
        method: 'PUT',
        body: params.body,
      }),
    }),
    getUserPosts: builder.query<
      GetUserPostsResponse,
      { userId: string; page?: number; page_size?: number; sort_type?: string }
    >({
      query: ({ userId, page = 1, page_size = 10, sort_type = 'normal' }) => ({
        url: `posts/user/${userId}`,
        method: 'GET',
        params: { page, page_size, sort_type },
      }),
      transformResponse: (response: GetUserPostsResponse) => response,
    }),
    getUserById: builder.query<UserResponse, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: { status: string; data: UserResponse }) => response.data,
    }),

    getFollowing: builder.query<GetFollowingResponse, void>({
      query: () => ({
        url: 'users/me/followed',
        method: 'GET',
      }),
    }),
    getUserFollowing: builder.query<GetFollowingResponse, string>({
      query: (id) => ({
        url: `users/${id}/followed`,
        method: 'GET',
      }),
    }),
    getFollowers: builder.query<GetFollowersResponse, void>({
      query: () => ({
        url: 'users/me/followers',
        method: 'GET',
      }),
    }),
    getUserFollowers: builder.query<GetFollowersResponse, string>({
      query: (id) => ({
        url: `users/${id}/followers`,
        method: 'GET',
      }),
    }),
    getPostSearch: builder.mutation<GetUserPostsResponse, PostsSearchRequest>({
      query: ({ userId, q, sort, page = 1, page_size = 20, sort_type, tags, filter, type }) => ({
        url: `posts/search${filter ? '/' + filter : ''}`,
        method: 'GET',
        params: {
          userId,
          q,
          sort: sort,
          page: page,
          page_size: page_size,
          sort_type,
          tags,
          type,
        },
      }),
    }),
    getUsersSearch: builder.mutation<GetUsersSerchResponse, UsersSearchRequest>({
      query: ({ q, page = 1, page_size = 20, sort_type }) => ({
        url: `users/search`,
        method: 'GET',
        params: {
          q,
          page: page,
          page_size: page_size,
          sort_type,
        },
      }),
      transformResponse: (response: GetUsersSerchResponse) => response,
    }),
  }),
});

export const {
  useRegisterMutation,
  useCreatePostBlockMutation,
  useUpdatePostMutation,
  useAuthMutation,
  useLazyGetMeQuery,
  useGetProfileMeQuery,
  useConfirmEmailMutation,
  useCreatePostMutation,
  useGetUserByIdQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useGetUserPostsQuery,
  useLazyGetUserPostsQuery,
  useUpdateAvatarMutation,
  useChangePasswordMutation,
  useGetPostSearchMutation,
  useGetUsersSearchMutation,
  useGetUserFollowingQuery,
  useGetUserFollowersQuery,
} = api;
