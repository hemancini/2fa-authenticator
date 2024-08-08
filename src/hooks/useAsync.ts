import { useCallback, useState } from "react";

interface UseAsyncResult<T, P extends unknown[]> {
  execute: (...params: P) => Promise<T | undefined>;
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAsync<T, P extends unknown[]>(asyncFunction: (...params: P) => Promise<T>): UseAsyncResult<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...params: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...params);
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  return { execute, data, isLoading, error };
}
