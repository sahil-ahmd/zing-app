import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

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
    const requestInterceptors = api.interceptors.request.use(async (config) => {
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

    // Cleanup: remove interceptors when components unmounts
    return () => {
      api.interceptors.request.eject(requestInterceptors);
    };
  }, [getToken]);

  return api;
};
