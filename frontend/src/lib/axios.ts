import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        `[API Error] ${error.response.status} - ${error.config?.url}`,
        error.response.data
      );
    } else if (error.request) {
      console.error("[API Error] No response received from server:", error.message);
    } else {
      console.error("[API Error] Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);
