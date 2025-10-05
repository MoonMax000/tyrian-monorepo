import { authApi } from '@/api';

export interface RegistrationBody {
  confirmPassword: string;
  email: string;
  password: string;
  username: string;
}

export interface CheckProfileResponse {
  id: number;
  email: string;
  is_active: boolean;
  is_to_2fa: boolean;
  avatar: string;
  background_image: string;
  name: string;
  username: string;
  location: string;
  website: string;
  role: number;
  sectors: number[];
  bio: string;
  backup_email: string;
  phone: string;
  backup_phone: string;
  is_2fa_enabled: boolean;
  is_deleted: boolean;
  verification_method: string;
  date_joined: string;
  last_login: string;
}

export type UpdateProfilePayload = {
  avatar?: File | string;
  background_image?: File | string;
  name?: string;
  username?: string;
  is_2fa_enabled?: boolean;
  location?: string;
  website?: string;
  role?: number;
  sector?: number[];
  bio?: string;
};

export interface UserRole {
  id: number;
  name: string;
}
export interface ConfirmRemoveAccountParams {
  token: string;
  code: string;
}

export interface ChangePasswordParams {
  old_password: string;
  new_password: string;
}

export type Sector = { id: number; name: string };

export interface ChangeFieldsVerificationParams {
  email?: string;
  fields_to_change: string[];
}

export interface ChangeFieldsVerificationConfirmParams {
  token: string;
  code: string;
  new_values: {
    [key: string]: string;
  };
}

export interface UserSession {
  id: number;
  session_id: string;
  created_at: string;
  expires_at: string;
  ip_address: string;
  fingerprint: string;
  status: 'active' | 'inactive';
}

export interface BulkDeleteSessionsPayload {
  session_ids?: number[] | null;
}

export interface EmailChangeVerificationParams {
  current_email: string;
  new_email: string;
}

export interface EmailChangeConfirmParams {
  token: string;
  code: string;
}

export interface EmailChangeParams {
  code: string;
}

export const AuthService = {
  logout() {
    return authApi.post('/accounts/logout/');
  },
  async getProfile() {
    return (
      await authApi.get<string, { data: CheckProfileResponse }>('/accounts/me/')
    ).data;
  },

  async getUserRoles() {
    return (
      await authApi.get<string, { data: UserRole[] }>('/accounts/user-roles/')
    ).data;
  },

  async getSectors() {
    return (await authApi.get<string, { data: Sector[] }>('/accounts/sectors/'))
      .data;
  },

  async updateProfile(data: UpdateProfilePayload) {
    const hasFiles =
      data.avatar instanceof File || data.background_image instanceof File;

    const json = {
      name: data.name,
      is_2fa_enabled: data.is_2fa_enabled,
      username: data.username,
      location: data.location,
      website: data.website,
      role: data.role,
      sectors: Array.isArray(data.sector) ? data.sector : undefined,
      bio: data.bio,
    };

    if (!hasFiles) {
      return authApi.patch('/accounts/profile/update/', json);
    }

    const formData = new FormData();
    if (data.avatar instanceof File) formData.append('avatar', data.avatar);
    if (data.background_image instanceof File)
      formData.append('background_image', data.background_image);
    if (data.is_2fa_enabled)
      formData.append('is_2fa_enabled', data.is_2fa_enabled.toString());
    if (data.name) formData.append('name', data.name);
    if (data.username) formData.append('username', data.username);
    if (data.location) formData.append('location', data.location);
    if (data.website) formData.append('website', data.website);
    if (data.role != null) formData.append('role', String(data.role));
    if (Array.isArray(data.sector)) {
      if (data.sector.length > 0) {
        data.sector.forEach((id) => formData.append('sectors', String(id)));
      } else {
        formData.append('sectors', '');
      }
    }
    if (data.bio) formData.append('bio', data.bio);

    return authApi.patch('/accounts/profile/update/', formData);
  },
  deleteVerification() {
    return authApi.delete<unknown, { data: { token: string } }>(
      '/accounts/profile/delete/verification/',
    );
  },
  removeAccountConfirmation(body: ConfirmRemoveAccountParams) {
    return authApi.post('/accounts/profile/delete/confirm/', body);
  },
  restoreAccount() {
    return authApi.post('/accounts/profile/restore/');
  },
  restorePassword(email: string) {
    return authApi.post('/accounts/password-reset/', { email: email });
  },
  changePassword(body: ChangePasswordParams) {
    return authApi.post('/accounts/password-change/', body);
  },
  changeFieldsVerification(body: ChangeFieldsVerificationParams) {
    return authApi.post('/accounts/profile/verification/', body);
  },
  changeFieldsVerificationConfirm(body: ChangeFieldsVerificationConfirmParams) {
    return authApi.post('/accounts/profile/verification/confirm/', body);
  },
  emailChangeVerification(body: EmailChangeVerificationParams) {
    return authApi.post('/accounts/profile/email-change/verification/', body);
  },
  emailChangeConfirm(body: EmailChangeConfirmParams) {
    return authApi.post('/accounts/profile/email-change/confirm/', body);
  },
  emailChange(body: EmailChangeParams) {
    return authApi.post('/accounts/profile/email-change/', body);
  },
  async getSessions() {
    const res = await authApi.get<UserSession[]>('/accounts/sessions/');
    return res.data;
  },
  async getSessionById(session_id: number) {
    const res = await authApi.get<UserSession>(
      `/accounts/sessions/${session_id}/`,
    );
    return res.data;
  },
  deleteSession(session_id: number) {
    return authApi.delete(`/accounts/sessions/${session_id}/delete/`);
  },
  bulkDeleteSessions(body: BulkDeleteSessionsPayload) {
    return authApi.delete('/accounts/sessions/bulk-delete/', {
      data: body,
    });
  },
};
