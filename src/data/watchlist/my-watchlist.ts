import { pb } from "@/lib/pb/client";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient, TSQ_CACHE_TIME } from "@/lib/tanstack/query/client";

import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { QueryClient } from "@tanstack/react-query";
import { and, eq } from "@tigawanna/typed-pocketbase";
import { createWatchlist, deleteWatchlist, updateWatchlist } from "./watchlist-muttions";
import { router } from "expo-router";
import { viewerQueryOptions } from "../viewer/query-options";

//  watchlist data fetching helpers

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
    queryKey: ["watchlist", "minerals", userId],
    queryFn: () => getUserwatchlist(userId),
    staleTime: TSQ_CACHE_TIME,
    gcTime: TSQ_CACHE_TIME,
  });
  return response;
}

// Normal collection from the items array in the watchlist
export const makeMyWatchlistsCollection = () => {

  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "mine"],
      queryFn: async () => {
        const user = await queryClient.fetchQuery(viewerQueryOptions());
        const userId = user?.record?.id;
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const response = await getUserwatchlist(userId);
        return response;
      },
      queryClient: queryClient, //the globally defined queryclient
      // enabled: !!userId,
      getKey: (item) => item.id,
      // schema: WatchlistResponseSchema,
      onInsert: async ({ transaction }) => {
        const { original, modified } = transaction.mutations[0];
        await createWatchlist(modified);
        queryClient.invalidateQueries({
          queryKey: ["watchlist", "community"],
        });
      },
      onUpdate: async ({ transaction }) => {
        const { original, modified } = transaction.mutations[0];
        await updateWatchlist(modified);
        queryClient.invalidateQueries({
          queryKey: ["watchlist", "community"],
        });
      },
      onDelete: async ({ transaction }) => {
        const { original } = transaction.mutations[0];
        await deleteWatchlist(original.id);
        queryClient.invalidateQueries({
          queryKey: ["watchlist", "community"],
        });
      },
    })
  );
};

export const myWatchlistsCollection = makeMyWatchlistsCollection();

export const myWatchlistItemsCollection = (qc: QueryClient) => {
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
      queryKey: ["watchlist", "mine", userId, "collection", "details", watchlistId],
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
