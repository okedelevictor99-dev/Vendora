import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const client = axios.create({
  baseURL,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const REFRESH_TOKEN_KEY = "refreshToken";

export const setRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/verify-email",
  "/auth/resend-verification-token",
  "/auth/forgot-password",
  "/auth/resend-forgot-password-token",
  "/auth/reset-password",
];

const isPublicAuthRequest = (url?: string) =>
  !!url && PUBLIC_AUTH_PATHS.some((path) => url.includes(path));

let isRefreshing = false;

let pendingQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

client.interceptors.response.use(
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

    const isRefreshCall = originalRequest.url?.includes("/auth/refresh-token");

    const isPublicAuth = isPublicAuthRequest(originalRequest.url);

    /*
     * For normal errors (400, 404, 409, 500, etc.), or for auth
     * edge cases we don't want to attempt a refresh on, just pass
     * the original AxiosError through. Components read the backend
     * message themselves via error.response?.data?.message.
     */
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
        pendingQueue.push({
          resolve: (value) => resolve(value),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const { data } = await client.post("/auth/refresh-token", {
        refreshToken,
      });

      setAccessToken(data.data.accessToken);

      // Save the rotated refresh token returned by the backend
      setRefreshToken(data.data.refreshToken);

      pendingQueue.forEach(({ resolve }) => resolve(client(originalRequest)));

      pendingQueue = [];

      return client(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      setRefreshToken(null);

      pendingQueue.forEach(({ reject }) => reject(refreshError));

      pendingQueue = [];

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);