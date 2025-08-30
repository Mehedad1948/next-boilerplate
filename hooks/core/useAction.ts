// hooks/use-action.ts
"use client";

import { useState } from "react";
import toast from "react-hot-toast"; // Or any toast library like react-toastify

// The ActionReturn utility type correctly infers the resolved data type
type ActionReturn<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export function useAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  options?: {
    onSuccess?: (data: ActionReturn<T>['data']) => void;
    onError?: (message: string) => void;
  }
) {
  const [data, setData] = useState<ActionReturn<T>['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const execute = async (...args: Parameters<T>) => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Call the Server Action
      const res: ActionReturn<T> = await action(...args);
      
      if (res.success) {
        setData(res.data);
        if (options?.onSuccess) {
          options.onSuccess(res.data);
        }
      } else {
        setIsError(true);
        // Use your toast library to show the error
        toast.error(res.message);
        if (options?.onError) {
          options.onError(res.message);
        }
      }
      return res;

    } catch (err: any) {
      setIsError(true);
      toast.error(err.message || "An unexpected error occurred.");
      if (options?.onError) {
        options.onError(err.message || "An unexpected error occurred.");
      }
      // Return a standard error structure for external handling
      return { success: false, message: err.message, data: null };
      
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, data, isLoading, isError };
}