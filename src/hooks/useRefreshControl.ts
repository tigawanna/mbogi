// Updated import to correctly import hooks and support promise-based refresh
import { useCallback, useState } from "react";

/**
 * Custom hook for pull-to-refresh control.
 * @param refreshFn Optional function that returns a promise to perform on refresh
 * @param delayMs Optional fallback delay in milliseconds (default: 5000ms)
 */
export function useRefreshControl(
  refreshFn?: () => Promise<any>,
  delayMs: number = 5000
) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const result = refreshFn
      ? refreshFn()
      : new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    Promise.resolve(result)
      .finally(() => {
        setRefreshing(false);
      });
  }, [refreshFn, delayMs]);

  return { refreshing, onRefresh };
}
