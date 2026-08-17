import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const client = axios.create({
  baseURL,
  withCredentials: true,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

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
let pendingQueue: Array<() => void> = [];

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall = originalRequest.url?.includes("/auth/refresh-token");
    const isPublicAuth = isPublicAuthRequest(originalRequest.url);

    if (!isUnauthorized || isRefreshCall || isPublicAuth || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push(() => resolve(client(originalRequest)));
      });
    }

    isRefreshing = true;

    try {
      const { data } = await client.post("/auth/refresh-token");
      setAccessToken(data.data.accessToken);

      pendingQueue.forEach((retry) => retry());
      pendingQueue = [];

      return client(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      pendingQueue = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);