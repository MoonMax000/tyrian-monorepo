import { api, authApi } from '@/api';

export interface RegistrationResponse {
  email: string;
  id: number;
  password: string;
}

export interface RegistrationBody {
  confirmPassword: string;
  email: string;
  password: string;
  username: string;
}

export interface LoginResponse {
  data: {
    token: string;
  };
  status: string;
}

export interface CheckProfileResponse {
  id: number;
  is_active: boolean;
  is_staff: boolean;
}

export const AuthorizationService = {
  logout() {
    return authApi.post('/accounts/logout/');
  },
  profile() {
    return authApi.get<string, { data: CheckProfileResponse }>('/accounts/me/');
  },
  registration(body: RegistrationBody) {
    return api.post<RegistrationResponse>('/auth/register', body);
  },

  login(body: { identity: string; password: string }) {
    return api.post<LoginResponse>('/auth/login', body);
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
