import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import * as Sentry from "@sentry/react-native";

const API_URL = "https://zing-3jsj.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting Clerk token:", error);
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // log api errors to sentry dashboard
        if (error.response) {
          Sentry.logger.error(
            Sentry.logger.fmt`API request failed: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
            {
              status: error.response.status,
              endpoint: error.config?.url,
              method: error.config?.method,
            }
          );
        } else if (error.request) {
          Sentry.logger.warn("API request failed - no response", {
            endpoint: error.config?.url,
            method: error.config?.method,
          })
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: remove interceptors when components unmounts
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.request.eject(responseInterceptor);
    };
  }, [getToken]);

  return api;
};
