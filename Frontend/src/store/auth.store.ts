import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '../types';
import { authApi, RegisterDto, LoginDto, UpdateProfileDto } from '../api/auth.api';
import { clearAuthHeader } from '../api/client';
import { useCartStore } from './cart.store';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (dto: LoginDto) => Promise<AuthResponse>;
  register: (dto: RegisterDto) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  fetchMe: () => Promise<User | null>;
  fetchProfile: () => Promise<User | null>;
  updateProfile: (dto: UpdateProfileDto) => Promise<User>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (dto: LoginDto) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(dto);
          set({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          // Sync any dishes added as visitor to the authenticated account
          try {
            await useCartStore.getState().syncGuestCartToServer();
          } catch {
            // non-blocking
          }
          return res;
        } catch (err: any) {
          const message =
            err.response?.data?.error ||
            err.message ||
            'Erreur lors de la connexion';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      register: async (dto: RegisterDto) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(dto);
          set({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          // Sync any dishes added as visitor to the registered account
          try {
            await useCartStore.getState().syncGuestCartToServer();
          } catch {
            // non-blocking
          }
          return res;
        } catch (err: any) {
          const message =
            err.response?.data?.error ||
            err.message ||
            "Erreur lors de l'inscription";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          useCartStore.getState().resetLocalCart();
        } catch {
          // ignore
        }

        try {
          // cleanup client-side auth header and call authApi cleanup
          clearAuthHeader();
          await authApi.logout();
        } catch {
          // le frontend doit toujours se nettoyer même si le backend répond mal
        }

        try {
          useAuthStore.persist?.clearStorage();
        } catch {
          // ignore
        }

        try {
          localStorage.removeItem('auth-storage');
        } catch {
          // ignore
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set((state) => ({
          accessToken,
          refreshToken,
          isAuthenticated: !!state.user && !!accessToken,
        }));
      },

      fetchMe: async () => {
        try {
          const user = await authApi.getProfile();
          set({ user, isAuthenticated: !!user });
          return user;
        } catch {
          set({ user: null, isAuthenticated: false });
          return null;
        }
      },

      fetchProfile: async () => {
        try {
          const user = await authApi.getProfile();
          set({ user, isAuthenticated: !!user });
          return user;
        } catch {
          set({ user: null, isAuthenticated: false });
          return null;
        }
      },

      updateProfile: async (dto: UpdateProfileDto) => {
        set({ isLoading: true, error: null });
        try {
          const updated = await authApi.updateMe(dto);
          set({ user: updated, isLoading: false, isAuthenticated: !!updated });
          return updated;
        } catch (err: any) {
          const message =
            err.response?.data?.error ||
            'Impossible de mettre à jour le profil';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
