import { api } from '@/api';
import { authApi } from '@/api/authApi';

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

export const AuthorizationService = {
  logout() {
    return authApi.post('/accounts/logout/');
  },
  profileCheck() {
    return authApi.get('/accounts/me/');
  },
  registration(body: RegistrationBody) {
    return api.post<RegistrationResponse>('/auth/register', body);
  },
  login(body: { email: string; password: string }) {
    return api.post('/auth/login/', body);
  },
  activateUser(token: string) {
    return api.get<{ uid: string; token: string }>(`/auth/email/confirm?token=${token}`);
  },
  requestResetPassword(body: { email: string }) {
    return api.post<{ email: string }>('auth/password/reset', body);
  },
  resetPassword(body: { new_password: string; new_password_confirm: string; token: string }) {
    return api.post<{ uid: string; token: string; new_password: string }>(
      'auth/password/reset/confirm',
      body,
    );
  },
};
