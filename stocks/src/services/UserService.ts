import { api } from '@/api';

export interface IActiveUserRsponce {
  id: number;
  email: string;
}

export const UserService = {
  getActiveUser() {
    return api.get<IActiveUserRsponce>('/auth/users/me/');
  },
};
