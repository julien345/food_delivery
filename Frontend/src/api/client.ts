import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth.store';

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const custom =
      localStorage.getItem('julien_api_url') ||
      localStorage.getItem('custom_api_url');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }

  const envUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
  'https://juliens-food-api.onrender.com';

  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  return 'https://juliens-food-api.onrender.com';
};

export const setCustomApiUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    const cleaned = (url || '').trim().replace(/\/+$/, '');
    if (cleaned) {
      localStorage.setItem('julien_api_url', cleaned);
    } else {
      localStorage.removeItem('julien_api_url');
      localStorage.removeItem('custom_api_url');
    }
    apiClient.defaults.baseURL = getApiBaseUrl();
  }
};

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attache automatiquement le token et la baseURL dynamique à chaque requête
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const currentBase = getApiBaseUrl();
  if (currentBase) {
    config.baseURL = currentBase;
  }
  try {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Supprime Content-Type si le payload est un FormData pour laisser Axios/navigateur
    // définir automatiquement 'multipart/form-data; boundary=...' avec le délimiteur exact
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
  } catch {
    // pas de session stockée, requête envoyée sans token
  }
  return config;
});

// File d'attente pour éviter plusieurs appels /auth/refresh simultanés
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    const isAuthRoute =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        let res;
        try {
          res = await apiClient.post('/api/auth/refresh', { refreshToken });
        } catch (rErr: any) {
          if (rErr.response?.status === 404) {
            res = await apiClient.post('/auth/refresh', { refreshToken });
          } else {
            throw rErr;
          }
        }
        const tokenData = res.data?.data || res.data;
        const newAccessToken = tokenData.accessToken;
        const newRefreshToken = tokenData.refreshToken || refreshToken;

        // Met à jour l'état en mémoire vive et localStorage proprement via Zustand
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        processQueue(null, newAccessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Déconnexion et nettoyage propre des anciens jetons expirés
        useAuthStore.getState().logout();

        // Ne redirige brutalement vers /login que si l'utilisateur se trouve sur une page protégée
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          const isProtectedRoute =
            path.startsWith('/admin') ||
            path.startsWith('/orders') ||
            path.startsWith('/checkout') ||
            path.startsWith('/profile') ||
            path.startsWith('/delivery') ||
            path.startsWith('/addresses');

          if (isProtectedRoute && !path.startsWith('/login')) {
            window.location.href = `/login?redirect=${encodeURIComponent(
              path
            )}&reason=order_auth_required`;
          }
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Retentative automatique sur les requêtes GET idempotentes en cas de coupure réseau,
    // démarrage à froid (cold start) ou erreurs 502/503/504 du serveur
    if (
      originalRequest &&
      originalRequest.method?.toLowerCase() === 'get' &&
      (!originalRequest._networkRetryCount || originalRequest._networkRetryCount < 2)
    ) {
      const isNetworkOrColdStart =
        !error.response ||
        error.code === 'ECONNABORTED' ||
        (error.response.status >= 502 && error.response.status <= 504);

      if (isNetworkOrColdStart) {
        originalRequest._networkRetryCount = (originalRequest._networkRetryCount || 0) + 1;
        const delay = 1200 * originalRequest._networkRetryCount;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
