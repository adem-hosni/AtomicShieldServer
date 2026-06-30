import { useState, useEffect, useCallback, useRef } from "react";
import { ApiResponse } from "@shared/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  dependencies?: any[];
}

/**
 * Custom hook for API data fetching with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {},
) {
  const { immediate = true, dependencies = [] } = options;
  const hasFetchedRef = useRef(false);

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, [apiCall]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }
  }, [immediate, fetchData]);

  // Reset fetch flag when dependencies change
  useEffect(() => {
    hasFetchedRef.current = false;
  }, dependencies);

  return {
    ...state,
    refetch,
  };
}

/**
 * Hook for API mutations (POST, PUT, DELETE)
 */
export function useApiMutation<T, TVariables = void>(
  apiCall: (variables: TVariables) => Promise<ApiResponse<T>>,
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall(variables);

        if (response.success) {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
          });
          return response;
        } else {
          setState({
            data: null,
            loading: false,
            error: response.error || "Unknown error occurred",
          });
          throw new Error(response.error || "Unknown error occurred");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [apiCall],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

/**
 * Hook for paginated API data
 */
export function usePaginatedApi<T>(
  apiCall: (params: any) => Promise<ApiResponse<T>>,
  initialParams: any = {},
  options: UseApiOptions = {},
) {
  const [params, setParams] = useState(initialParams);

  const apiCallWithParams = useCallback(
    () => apiCall(params),
    [apiCall, params],
  );

  const { data, loading, error, refetch } = useApi(apiCallWithParams, {
    ...options,
    dependencies: [params],
  });

  const updateParams = useCallback((newParams: Partial<typeof params>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(initialParams);
  }, [initialParams]);

  return {
    data,
    loading,
    error,
    params,
    updateParams,
    resetParams,
    refetch,
  };
}
