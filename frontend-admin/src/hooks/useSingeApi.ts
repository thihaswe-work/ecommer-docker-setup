// @ts-nocheck
import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";

interface UseFetchSingleOptions<T> {
  endpoint: string; // e.g., `/orders/1`
  autoFetch?: boolean; // default true
}

const useFetchSingle = <T>({
  endpoint,
  autoFetch = true,
}: UseFetchSingleOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<T>(endpoint);
      setData(res.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unexpected error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) fetchData();
  }, [endpoint]); // re-fetch if endpoint changes

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetchSingle;
