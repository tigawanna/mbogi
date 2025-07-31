import { pb } from "@/lib/pb/client";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient } from "@/lib/tanstack/query/client";
import { CACHETIME } from "@/lib/tanstack/query/external-dev-tools";
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
    queryKey: ["watchlist", userId],
    queryFn: () => getUserwatchlist(userId),
    staleTime: CACHETIME,
    gcTime: CACHETIME
  });
  return response;
}

// Normal collection from the items array in the watchlist
export const myWatchlistCollection = (qc: QueryClient) => {
  const userId = pb.authStore.record?.id;
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", userId, "collection"],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const response = await getUserWatchListFromQueryClient(qc, userId);
        return await response;
      },
      queryClient: queryClient,
      enabled: !!userId,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};

export const myWatchlistItemsCollection = (qc: QueryClient) => {
  const userId = pb.authStore.record?.id;
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", userId, "items", "collection"],
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



// Function to get a single watchlist with expanded items
async function getWatchlistById(watchlistId: string) {
  const response = await pb.from("watchlist").getOne(watchlistId, {
    select: {
      expand: {
        user_id: true,
        items: true,
      },
    },
  });
  return response;
}

// Collection for a single watchlist with items
export const watchlistByIdCollection = (watchlistId: string) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "details", watchlistId],
      queryFn: async () => {
        if (!watchlistId) {
          throw new Error("Watchlist ID is required");
        }
        const response = await getWatchlistById(watchlistId);
        return [response]; // Return as array for collection compatibility
      },
      queryClient: queryClient,
      enabled: !!watchlistId,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};
