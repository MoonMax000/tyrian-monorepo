import { api, authApi } from '@/api';

export interface RegistrationResponse {
  email: string;
  id: number;
  password: string;
}

export const AuthorizationService = {
  logout() {
    return authApi.post('/accounts/logout/');
  },
  profile() {
    return authApi.get('/accounts/me/');
  },
  registration(body: { email: string; password: string }) {
    return api.post<RegistrationResponse>('/auth/users/', body);
  },

  login(body: { email: string; password: string }) {
    return api.post('/auth/jwt/create/', body);
  },

  activateUser(body: { uid: string; token: string }) {
    return api.post<{ uid: string; token: string }>('/auth/users/activation/', body);
  },
  requestResetPassword(body: { email: string }) {
    return api.post<{ email: string }>('auth/users/reset_password/', body);
  },
  resetPassword(body: { uid: string; token: string; new_password: string }) {
    return api.post<{ uid: string; token: string; new_password: string }>(
      'auth/users/reset_password_confirm/',
      body,
    );
  },
};
