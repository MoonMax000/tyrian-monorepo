import { getCookie } from '@/utilts/cookie';
import { createApi } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError } from 'axios';
import { env } from 'process';

export type TMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface PaginationRequest {
  page?: number;
  page_size?: number;
}
interface PaginationResponse {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}
export interface ILastMessage {
  id: string;
  chat_id: string;
  sender: string;
  recipient: string;
  message: string;
  comment: string;
  flag_comments: boolean;
  label: string;
  links: string[];
  timestamp: string;
}

export interface PrivateChat {
  id: string;
  user_id: string;
  chat_avatar_url: string;
  created: string;
  last_message: ILastMessage;
  last_timestamp: number;
  name: string;
  new_messages_count: number;
  type: 'private';
  private_chat_contact_user_id: string;
}

export interface GroupChat {
  id: string;
  user_id: string;
  chat_avatar_url: string;
  created: string;
  last_message: ILastMessage;
  last_timestamp: number;
  name: string;
  new_messages_count: number;
  type: 'groupchat';
  private_chat_contact_user_id?: string;
}

export type ChatItem = PrivateChat | GroupChat;

interface ChatListResponse {
  status: string;
  data: ChatItem[];
  pagination: PaginationResponse;
}

export interface IUserChat {
  avatar_url?: string;
  cover_url?: string;
  description?: string;
  donation_url?: string;
  id: string;
  roles?: string[];
  username: string;
}

interface IMessage {
  message: string;
  status: string;
}
interface ApiError extends IMessage {
  error?: string;
}

interface PaginationRequest {
  page?: number;
  page_size?: number;
}

interface GetUsersParams {
  userName?: string;
}

interface GetHistoryParams {
  limit?: number;
  chat_with?: string;
}

export interface GetHistoryPrivate {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  timestamp: string;
  label: string;
  chat_id: string;
  comment: string;
  links: string[];
  flag_comments: boolean;
}
interface GetHistoryPublicParams {
  chatID: string;
  limit?: number;
}

interface CreateChatResponse {
  message: string;
  status: string;
}
interface CreateChatParams {
  type: string;
  body: {
    description?: string;
    name: string;
    user_list?: {
      default: string[];
      moderator?: string[];
    };
  };
}

export interface GroupInfoResponse {
  description: string;
  name: string;
  avatar: string;
  user_count: string;
}

export interface GroupUpdateParams {
  chatId: string;
  description: string;
  name: string;
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
      baseURL:
        env.NEXT_PUBLIC_BACKEND_CHAT_API || 'https://socialweb-chat-api.tyriantrade.com/api/v1/',
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

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQuery,
  tagTypes: [
    'chatList',
    'users',
    'createChat',
    'getHistoryPrivate',
    'getHistoryPublic',
    'getChatInfo',
  ],
  endpoints: (builder) => ({
    getChatList: builder.query<ChatListResponse, PaginationRequest>({
      query: (params) => ({
        url: '/chat',
        method: 'GET',
        params: {
          page: params.page ?? 1,
          page_size: params.page_size ?? 100,
        },
      }),
      providesTags: ['chatList'],
    }),
    getUsers: builder.query<IUserChat[], GetUsersParams>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params: {
          userName: params.userName,
        },
      }),
      providesTags: ['users'],
    }),
    createChat: builder.query<IMessage[], GetUsersParams>({
      query: (params) => ({
        url: '/chat/',
        method: 'GET',
        params: {
          userName: params.userName,
        },
      }),
      providesTags: ['users'],
    }),
    getHistoryPrivate: builder.query<GetHistoryPrivate[], GetHistoryParams>({
      query: (params) => ({
        url: '/history/private',
        method: 'GET',
        params: {
          limit: params.limit,
          chat_with: params.chat_with,
        },
      }),
      providesTags: ['getHistoryPrivate'],
    }),
    getHistoryPublic: builder.query<GetHistoryPrivate[], GetHistoryPublicParams>({
      query: (params) => ({
        url: '/history/public',
        method: 'GET',
        params: {
          chatID: params.chatID,
          limit: params.limit ?? 1000,
        },
      }),
      providesTags: ['getHistoryPublic'],
    }),
    createNewChat: builder.mutation<CreateChatResponse, CreateChatParams>({
      query: ({ type, body }) => ({
        url: '/chat/create',
        method: 'POST',
        params: {
          type,
        },
        body: body,
      }),
    }),

    getGroupById: builder.query<GroupInfoResponse, string>({
      query: (chatId) => ({
        url: 'chat/info/group',
        params: {
          chat_id: chatId,
        },
        method: 'GET',
      }),
      providesTags: ['getChatInfo'],
    }),
    updateGroupInfo: builder.mutation<IMessage, GroupUpdateParams>({
      query: (params) => ({
        url: 'chat/update/group',
        body: {
          chat_id: params.chatId,
          description: params.description,
          name: params.name,
        },
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetChatListQuery,
  useGetUsersQuery,
  useGetHistoryPrivateQuery,
  useGetHistoryPublicQuery,
  useCreateNewChatMutation,
  useGetGroupByIdQuery,
  useUpdateGroupInfoMutation,
} = chatApi;
