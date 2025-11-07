// import axios from "axios";

// export const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000
//   withCredentials: true, // send cookies if using HttpOnly cookie auth
// });

// // optionally add interceptors for auth
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // clear user state if needed
//       localStorage.removeItem("user");

//       // redirect to login
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// apiClient.interceptors.request.use((config) => {
//   console.log("request interceptor", document);
//   const token = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("adminToken="))
//     ?.split("=")[1];
//   if (token) {
//     // merge with existing headers safely
//     config.headers = {
//       ...config.headers,
//       Authorization: `Bearer ${token}`,
//     } as any; // <-- cast to any to satisfy TS
//   }

//   return config;
// });import axios from "axios";

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
