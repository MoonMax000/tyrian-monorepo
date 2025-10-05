import { api, TPostType } from './api';

interface File {
  ext: string;
  file_size: number;
  id: string;
  name: string;
  type: string;
  user_name: string;
  url: string;
}

export interface CreateCommentParams {
  postId: string;
  parentId?: string;
  content: string;
}

export interface Tag {
  id: string;
  name: string;
}

interface GetFavoritePostsResponse {
  status: string;
  data: Post[];
  pagination: Pagination;
}

export interface ContentBlock {
  content: string;
  files: File[];
  id: string;
  media_url: string;
  next_block_id: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  blocks: ContentBlock[];
  type: TPostType;
  user_id: string;
  user_email: string;
  media_url: string;
  like_count: number;
  liked: string;
  files: File[];
  tags: Tag[];
  created: string;
  user_name: string;
  payment: number;
  need_payment: boolean;
  author_avatar: string;
}

export interface CommentData {
  avatar_url: string;
  user_email?: string;
  children: CommentData[];
  content: string;
  created_at: number;
  id: string;
  is_deleted: true;
  post_id: string;
  updated_at: number;
  user_id: string;
  username: string;
  level: number;
  likes_count: number;
  is_liked: boolean;
}

export interface UpdateCommentParams {
  id: string;
  content: string;
}
export interface Pagination {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}

export interface GetPostsResponse {
  data: Post[];
  pagination: Pagination;
  status: string;
}

interface GetPostsParams {
  page?: number;
  page_size?: number;
  userId?: string | null;

  filter?: 'ForYou' | 'Popular' | 'Following';
  sort_type?: 'latest' | 'recommended';
  type?: 'ideas' | 'videos' | 'opinions' | 'analytics' | 'softwares';
  tags?: string;
}

interface SubscribePostResponse {
  status: string;
  message: string;
}

interface IGetFavoritePostsParams {
  page?: number;
  page_size?: number;
  sort_type?: string;
}

// Коментарии лайки
interface CommentLikeResponse {
  message: string;
  status: string;
}

export type CommentSortBy = 'created_at' | 'likes_count';

interface GetPostCommentsParams {
  post_id: string;
  sort_by?: CommentSortBy;
}

export const postsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, GetPostsParams>({
      query: (params) => ({
        url: 'posts',
        method: 'GET',
        params,
      }),
    }),
    getFavoritePosts: builder.query<GetFavoritePostsResponse, IGetFavoritePostsParams>({
      query: (params) => ({
        url: 'favorite/',
        method: 'GET',
        params,
      }),
      providesTags: (result, error, arg) => [
        { type: 'FavoritePosts', id: 'FAVORITE_LIST' },
        { type: 'FavoritePosts', id: arg.page ?? 1 },
      ],
    }),

    addFavoritePost: builder.mutation<{ status: string }, string>({
      query: (postId) => ({
        url: `favorite/${postId}`,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'FavoritePosts', id: 'FAVORITE_LIST' }],
    }),

    removeFavoritePost: builder.mutation<{ status: string }, string>({
      query: (postId) => ({
        url: `favorite/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'FavoritePosts', id: 'FAVORITE_LIST' }],
    }),
    deletePost: builder.mutation<{ status: string; message: string }, string>({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: 'DELETE',
      }),
    }),
    subscribeToPost: builder.mutation<SubscribePostResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/subscribe`,
        method: 'POST',
      }),
    }),
    getPostById: builder.query<{ status: string; data: Post }, string>({
      query: (queryString) => ({
        url: `posts/${queryString}`,
        method: 'GET',
      }),
    }),
    getPostComments: builder.query<CommentData[], GetPostCommentsParams>({
      query: ({ post_id, sort_by }) => ({
        url: `/comments`,
        method: 'GET',
        params: { post_id: post_id, sort_by: sort_by },
      }),
      providesTags: ['Comments'],
    }),
    createNewComment: builder.mutation<CommentData, CreateCommentParams>({
      query: (params) => ({
        url: `comments`,
        body: {
          content: params.content,
          post_id: params.postId,
          parent_id: params.parentId,
        },
        method: 'POST',
      }),
      invalidatesTags: ['Comments'],
    }),
    removeComment: builder.mutation<string, string>({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
    }),
    updateComment: builder.mutation<CommentData, UpdateCommentParams>({
      query: (params) => ({
        url: `comments/${params.id}`,
        method: 'PATCH',
        body: {
          content: params.content,
        },
      }),
      invalidatesTags: ['Comments'],
    }),

    likeComment: builder.mutation<CommentLikeResponse, string>({
      query: (commentId) => ({
        url: `comments/${commentId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Comments'],
    }),

    unlikeComment: builder.mutation<CommentLikeResponse, string>({
      query: (commentId) => ({
        url: `comments/${commentId}/unlike`,
        method: 'POST',
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetFavoritePostsQuery,
  useAddFavoritePostMutation,
  useRemoveFavoritePostMutation,
  useDeletePostMutation,
  useSubscribeToPostMutation,
  useGetPostCommentsQuery,
  useCreateNewCommentMutation,
  useRemoveCommentMutation,
  useUpdateCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
} = postsApi;
