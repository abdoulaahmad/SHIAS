import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/store";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // In Sprint 1, we use an in-memory token from Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data; // The API returns { success, message, data }
  },
  (error: AxiosError) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      // Only redirect if we are in the browser
      if (typeof window !== "undefined" && !window.location.pathname.startsWith('/login')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);
