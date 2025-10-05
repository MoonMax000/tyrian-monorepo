import { api, streamApi } from '@/api';

export interface ProfileResponse {
  avatar_url: string;
  cover_url: string;
  description: string;
  donation_url: string;
  email: string;
  id: string;
  name: string;
  roles: string[];
  username: string;
}

export type TStreamerRequesStatus = 'created' | 'rejected' | 'approved';
interface StreamerRequesStatusResponse {
  id: string;
  status: TStreamerRequesStatus;
}

export interface BecomeStreamerBody {
  additional_text: string;
  email: string;
}

export interface patchUserDataType {
  description?: string;
  username?: string;
  donation_url?: string;
}

export const UserService = {
  getProfile() {
    return api
      .get<ProfileResponse>('/profile/me')
      .then((response) => response.data);
  },

  patchProfile(userData: patchUserDataType) {
    return api.patch<ProfileResponse>('/profile/me', userData);
  },
  changeAvatar(uploadFile: File) {
    const formData = new FormData();
    formData.append('file', uploadFile);
    return api.put('profile/me/set-avatar', formData);
  },
  changeBanner(uploadFile: File) {
    const formData = new FormData();
    formData.append('file', uploadFile);
    return api.put('profile/me/set-cover', formData);
  },

  getKey() {
    return streamApi.get<{ key: string }>('stream-keys/new');
  },
  becomeStreamer(body: BecomeStreamerBody) {
    return streamApi.post('profile/me/become-streamer-request', body);
  },
  getStreamerRequesStatus() {
    return streamApi.get<StreamerRequesStatusResponse>(
      'profile/me/status-streamer-request',
    );
  },
};
