import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const adminClient = axios.create({
  baseURL,
});

let adminAccessToken: string | null = null;

export const setAdminAccessToken = (token: string | null) => {
  adminAccessToken = token;
};

export const getAdminAccessToken = () => adminAccessToken;

const ADMIN_REFRESH_TOKEN_KEY = "adminRefreshToken";

export const setAdminRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  }
};

export const getAdminRefreshToken = () => {
  return localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
};

adminClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (adminAccessToken) {
    config.headers.Authorization = `Bearer ${adminAccessToken}`;
  }

  return config;
});

const PUBLIC_ADMIN_AUTH_PATHS = [
  "/admin/login",
  "/admin/signup",
  "/admin/reset-password",
];

const isPublicAdminAuthRequest = (url?: string) =>
  !!url && PUBLIC_ADMIN_AUTH_PATHS.some((path) => url.includes(path));

let isRefreshing = false;

let pendingQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

adminClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;

    const isRefreshCall = originalRequest.url?.includes(
      "/admin/refresh-token"
    );

    const isPublicAuth = isPublicAdminAuthRequest(originalRequest.url);

    if (
      !isUnauthorized ||
      isRefreshCall ||
      isPublicAuth ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = getAdminRefreshToken();

      if (!refreshToken) {
        throw new Error("No admin refresh token available");
      }

      const { data } = await adminClient.post("/admin/refresh-token", {
        refreshToken,
      });

      setAdminAccessToken(data.data.accessToken);
      setAdminRefreshToken(data.data.refreshToken);

      pendingQueue.forEach(({ resolve }) =>
        resolve(adminClient(originalRequest))
      );

      pendingQueue = [];

      return adminClient(originalRequest);
    } catch (refreshError) {
      setAdminAccessToken(null);
      setAdminRefreshToken(null);

      pendingQueue.forEach(({ reject }) => reject(refreshError));

      pendingQueue = [];

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);