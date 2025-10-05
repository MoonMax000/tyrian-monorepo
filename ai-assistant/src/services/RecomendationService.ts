import { recomendationApi } from '@/api';
import { IPagination, IStream } from './constants';

export interface IAllChanelsEl {
  id: string;
  username: string;
  name: string;
  description: string;
  avatar_url: string;
  cover_url: string;
  subscriber_count: number;
  stream?: IStream;
  donation_url: string;
  is_subscribed?: boolean;
  subscribed?: boolean;
}

export interface IGetAllChanelsBody {
  page: number;
  page_size: number;
  sort_type: 'normal' | 'recommended';
}

export interface IGetAllChanelsResponse {
  status: string;
  data: IAllChanelsEl[];
  pagination?: IPagination;
}

export interface IGetById {
  status: string;
  data: IAllChanelsEl;
}

//subscribe

export interface ISubscribeBody {
  channel_id: string;
}
interface ISubscribeResponce {
  message: string;
  status: string;
}

//getSubscriptions
export interface IGetSubscriptions {
  status: string;
  data: string[];
}

//subscribers
export interface IGetSubscribersBody {
  page: number;
  page_size: number;
  sort_by: 'username' | 'subscriber_count';
  sort_dir: 'asc' | 'desc';
}

// categories
export interface ICategory {
  avatar_url: string;
  created: string;
  description: string;
  id: string;
  name: string;
  updated: string;
}

export type IGetCategoriesResponse = ICategory[];

// tags
export type IGetTagsResponse = string[];

export const RecomendationService = {
  getAllChanels(body: IGetAllChanelsBody) {
    const { page, page_size, sort_type } = body;
    return recomendationApi
      .get<IGetAllChanelsResponse>(
        `channels?page=${page}&page_size=${page_size}&sort_type=${sort_type}`,
      )
      .then((response) => response.data);
  },

  getChanelById(id: string) {
    return recomendationApi
      .get<IGetById>(`channels/${id}`)
      .then((response) => response.data);
  },

  subscribe(body: ISubscribeBody) {
    return recomendationApi.post<ISubscribeResponce>(
      'channels/me/subscribe',
      body,
    );
  },
  unsubscribe(body: ISubscribeBody) {
    return recomendationApi.post<ISubscribeResponce>(
      'channels/me/unsubscribe',
      body,
    );
  },
  getSubscribers(body: IGetSubscribersBody) {
    const { page, page_size, sort_by, sort_dir } = body;
    return recomendationApi
      .get<IGetAllChanelsResponse>(
        `channels/me/subscribers?page=${page}&page_size=${page_size}&sort_by=${sort_by}&sort_dir=${sort_dir}`,
      )
      .then((response) => response.data);
  },

  getSgetSubscriptionsID() {
    return recomendationApi.get<IGetSubscriptions>(`channels/me/subscriptions`);
  },

  async getSubscriptions() {
    const subscribeArr = await this.getSgetSubscriptionsID();

    if (subscribeArr.data.status !== 'success')
      console.error('faled to load subscribes');

    const batchBody = {
      channel_ids: subscribeArr.data.data,
    };

    return recomendationApi
      .post<IGetAllChanelsResponse>('channels/batch', batchBody)
      .then((response) => response.data);
  },
  getCategories() {
    return recomendationApi
      .get<IGetCategoriesResponse>('categories')
      .then((response) => response.data);
  },

  getTags() {
    return recomendationApi
      .get<IGetTagsResponse>('tags')
      .then((response) => response.data);
  },
};
