import apiClient from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    const form = new URLSearchParams();
    form.append('username', payload.email);
    form.append('password', payload.password);
    const res = await apiClient.post<AuthTokens>('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<UserProfile> => {
    const res = await apiClient.post<UserProfile>('/auth/register', payload);
    return res.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await apiClient.get<UserProfile>('/auth/me');
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const res = await apiClient.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return res.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const res = await apiClient.post<{ message: string }>('/auth/verify-email', { token });
    return res.data;
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const res = await apiClient.post<{ message: string }>('/auth/resend-verification', { email });
    return res.data;
  },
};
