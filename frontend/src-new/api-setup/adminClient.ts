import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const adminClient = axios.create({
  baseURL,
  withCredentials: true,
});

let adminAccessToken: string | null = null;

export const setAdminAccessToken = (token: string | null) => {
  adminAccessToken = token;
};

export const getAdminAccessToken = () => adminAccessToken;

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
let pendingQueue: Array<() => void> = [];

adminClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall = originalRequest.url?.includes("/admin/refresh-token");
    const isPublicAuth = isPublicAdminAuthRequest(originalRequest.url);

    if (!isUnauthorized || isRefreshCall || isPublicAuth || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push(() => resolve(adminClient(originalRequest)));
      });
    }

    isRefreshing = true;

    try {
      const { data } = await adminClient.post("/admin/refresh-token");
      setAdminAccessToken(data.data.accessToken);

      pendingQueue.forEach((retry) => retry());
      pendingQueue = [];

      return adminClient(originalRequest);
    } catch (refreshError) {
      setAdminAccessToken(null);
      pendingQueue = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);