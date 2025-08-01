import { pb } from "@/lib/pb/client";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient } from "@/lib/tanstack/query/client";
import { TSQ_CACHE_TIME } from "@/lib/tanstack/query/external-dev-tools";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { QueryClient } from "@tanstack/react-query";
import { and, eq } from "@tigawanna/typed-pocketbase";

async function getUserwatchlist(userId: string) {
  const response = await pb.from("watchlist").getFullList({
    filter: and(eq("user_id", userId)),
    sort: "-created",
    select: {
      expand: {
        user_id: true,
        items: true,
      },
    },
  });

  return response;
}

export async function getUserWatchListFromQueryClient(qc: QueryClient, userId: string) {
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const response = await qc.fetchQuery({
    queryKey: ["watchlist", "mine", userId],
    queryFn: () => getUserwatchlist(userId),
    staleTime: TSQ_CACHE_TIME,
    gcTime: TSQ_CACHE_TIME,
  });
  return response;
}

// Normal collection from the items array in the watchlist
export const myWatchlistCollection = (qc: QueryClient) => {
  const userId = pb.authStore.record?.id;
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "mine", userId, "collection"],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const response = await getUserWatchListFromQueryClient(qc, userId);
        return await response;
      },
      queryClient: queryClient, //the globally defined queryclient
      enabled: !!userId,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};

export const myWatchlistsItemsCollection = (qc: QueryClient) => {
  const userId = pb.authStore.record?.id;
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "mine", userId, "collection", "items"],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const response = await getUserWatchListFromQueryClient(qc, userId);
        const watchListItems = response.flatMap((item) => {
          return (
            item.items.map((i) => {
              return {
                id: Number(i),
                watchlistId: item.id,
                watchlistTitle: item.title,
              };
            }) || []
          );
        });
        return await watchListItems;
      },
      queryClient: queryClient,
      enabled: !!userId,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};

// Collection for a single watchlist with items
export const mySingleWatchlistItemsCollection = (qc: QueryClient, watchlistId: string) => {
  const userId = pb.authStore.record?.id;
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "mine", userId, "details", watchlistId],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User not authenticated");
        }
        if (!watchlistId) {
          throw new Error("Watchlist ID is required");
        }
        // Reuse React Query cache for watchlist details
        const response = await getUserWatchListFromQueryClient(qc, userId);
        const singleWatchlist = response.find((item) => item.id === watchlistId);
        return singleWatchlist?.expand?.items || [];
      },
      queryClient: queryClient,
      enabled: !!watchlistId,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};
