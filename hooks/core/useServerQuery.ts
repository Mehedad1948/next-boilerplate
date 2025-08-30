// hooks/use-server-query.ts
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

type ActionReturn<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export function useServerQuery<T extends (...args: any[]) => Promise<any>>(
  action: T,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<ActionReturn<T>['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [refetchCounter, setRefetchCounter] = useState(0);

  const fetchData = useCallback(
    async (...args: Parameters<T>) => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        const res: ActionReturn<T> = await action(...args);
        
        if (res.success) {
          setData(res.data);
        } else {
          setIsError(true);
          toast.error(res.message);
        }
      } catch (err) {
        setIsError(true);
        toast.error(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [action]
  );

  useEffect(() => {
    fetchData(...(dependencies as Parameters<T>));
  }, [fetchData, refetchCounter, ...dependencies]);

  const refetch = useCallback(() => {
    setRefetchCounter(prev => prev + 1);
  }, []);

  return { data, isLoading, isError, refetch };
}