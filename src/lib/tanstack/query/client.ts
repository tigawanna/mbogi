import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryClient } from "@tanstack/react-query";


export const queryKeyPrefixes = {
  viewer: "viewer",
  auth: "auth",
  trakt_tokens_state: "trakt_tokens_state",
  trakt: "trakt",
  watchlist: "watchlist",
  userWatchlist: "user-watchlist",
  watchlistItem: "watchlistItem",
  tmdb: "tmdb",
  user: "user",
  testId: "testId",
  watchListItems: "watchlist-items",
  watchedList: "watched-list",
  watchlistItems: "watchlist-items",
} as const;


type QueryKey = [
  (typeof queryKeyPrefixes)[keyof typeof queryKeyPrefixes],
  ...(readonly unknown[])
];

interface MyMeta extends Record<string, unknown> {
  invalidates?: [QueryKey[0], ...(readonly unknown[])][];
  [key: string]: unknown;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey;
    mutationKey: QueryKey;
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
  }
}
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const TSQ_CACHE_TIME = __DEV__ ? 1000 : 1000 * 60 * 60 * 72; // 1 sec in dev, 72 hours in production

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (_, __, ___, mutation) => {
      if (Array.isArray(mutation.meta?.invalidates)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        mutation.meta?.invalidates.forEach((queryKey) => {
          return queryClient.invalidateQueries({
            queryKey,
          });
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: TSQ_CACHE_TIME,
      gcTime: TSQ_CACHE_TIME,
    },
  },
});



