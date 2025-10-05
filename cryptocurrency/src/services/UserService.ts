import { api } from '@/api';

export interface ACtiveUser {
  id: number;
  email: string;
}

export const UserService = {
  getActiveUser() {
    return api.get<ACtiveUser>('/auth/get-me');
  },
};
