// chatgpt
import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response: any) => response,
  (error: { response: { status: number } }) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ------------------ this interceptor does not work-------------------
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof document !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (token) {
      // Ensure headers is not undefined
      if (!config.headers) {
        config.headers = {} as any; // Initialize if undefined
      }

      // Use Axios' set method if available (AxiosHeaders) or fallback
      if ("set" in config.headers) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    }
  }
  return config;
});
