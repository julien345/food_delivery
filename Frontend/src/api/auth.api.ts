import { apiClient } from './client';
import { AuthResponse, User } from '../types';
import { cleanPhoneNumber } from '../utils/phone.utils';
import { normalizeUser } from './admin.api';

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const authApi = {
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const cleanedPhone = cleanPhoneNumber(dto.phone);
    const payload = {
      ...dto,
      phone: cleanedPhone,
    };
    const res = await apiClient.post<any>('/API/auth/register', payload);
    const data = res.data?.data || res.data;
    return {
      ...data,
      user: normalizeUser(data.user || data),
    };
  },

  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const res = await apiClient.post<any>('/API/auth/login', dto);
    const data = res.data?.data || res.data;
    return {
      ...data,
      user: normalizeUser(data.user || data),
    };
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const res = await apiClient.post<any>('/API/auth/refresh', {
      refreshToken,
    });
    return res.data?.data || res.data;
  },

  /**
   * Récupère le profil de l'utilisateur connecté via GET /auth/profile
   */
  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<any>('/API/auth/profile');
    const data = res.data?.data || res.data;
    return normalizeUser(data.user || data);
  },

  /** Alias pour compatibilité */
  getMe: async (): Promise<User> => {
    return authApi.getProfile();
  },

  /**
   * Met à jour le profil de l'utilisateur connecté via PATCH /auth/profile
   */
  updateProfile: async (dto: UpdateProfileDto): Promise<User> => {
    const cleanedPhone = cleanPhoneNumber(dto.phone);
    const payload = {
      ...dto,
      phone: cleanedPhone,
    };
    try {
      const res = await apiClient.patch<any>('/API/auth/profile', payload);
      const data = res.data?.data || res.data;
      return normalizeUser(data.user || data);
    } catch (patchErr: any) {
      if (patchErr.response?.status === 404 || patchErr.response?.status === 405) {
        const putRes = await apiClient.put<any>('/API/auth/profile', payload);
        const data = putRes.data?.data || putRes.data;
        return normalizeUser(data.user || data);
      }
      throw patchErr;
    }
  },

  /** Alias pour compatibilité */
  updateMe: async (dto: UpdateProfileDto): Promise<User> => {
    return authApi.updateProfile(dto);
  },
};

