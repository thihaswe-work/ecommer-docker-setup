import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/api/client";
import { useError } from "@/context/errorContext";
import { useAuthStore } from "@/store/authStore";

interface UseApiOptions<T> {
  endpoint: string; // API path, e.g., '/users'
  fetchParams?: any; // optional params
  transform?: (data: any) => T[]; // optional transform
}

export const useApi = <T>({
  endpoint,
  fetchParams,
  transform,
}: UseApiOptions<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const { setError } = useError(); // use global error
  const { setUser } = useAuthStore();

  const fetchData = useCallback(
    async (params?: any) => {
      // allow optional override
      setLoading(true);
      try {
        const res = await apiClient.get(endpoint, {
          params: params || fetchParams, // override if provided
        });
        setData(transform ? transform(res.data) : res.data);
      } catch (err: any) {
        setError({
          status: err.response?.status || 500,
          message: err.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    },
    [endpoint, fetchParams]
  );

  const removeItem = useCallback(
    async (id: string | number, newendpoint?: string) => {
      // if (!confirm("Are you sure?")) return;
      try {
        await apiClient.delete(`${newendpoint ?? endpoint}/${id}`);
        setData((prev) => prev.filter((item: any) => item.id !== id));
      } catch (err: any) {
        setError({
          status: err.response?.status || 500,
          message: err.response?.data?.message || "Something went wrong",
        });
      }
    },
    [endpoint]
  );

  const createItem = useCallback(
    async (payload: Partial<T>) => {
      try {
        const res = await apiClient.post(endpoint, payload);
        setData((prev) => [...prev, res.data]);
        return res.data;
      } catch (err: any) {
        setError({
          status: err.response?.status || 500,
          message: err.response?.data?.message || "Something went wrong",
        });
      }
    },
    [endpoint]
  );

  const updateItem = useCallback(
    async (
      id: string | number | undefined,
      payload: Partial<T>,
      newendpoint?: string
    ) => {
      try {
        const res = await apiClient.put(
          `${newendpoint ?? endpoint}/${id ? id : ""}`,
          payload
        );
        setData((prev) =>
          prev.map((item: any) => (item.id === id ? res.data : item))
        );
        return res.data;
      } catch (err: any) {
        setError({
          status: err.response?.status || 500,
          message: err.response?.data?.message || "Something went wrong",
        });
      }
    },
    [endpoint]
  );

  const updateProfile = useCallback(
    async (payload: Partial<T>, newendpoint?: string) => {
      try {
        const res = await apiClient.put(`${newendpoint ?? endpoint}`, payload);
        setUser(res.data);
        return res.data;
      } catch (err: any) {
        setError({
          status: err.response?.status || 500,
          message: err.response?.data?.message || "Something went wrong",
        });
      }
    },
    [endpoint]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    updateProfile,
    fetchData,
    removeItem,
    createItem,
    updateItem,
  };
};
