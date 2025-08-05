import { pb } from "@/lib/pb/client";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient, TSQ_CACHE_TIME } from "@/lib/tanstack/query/client";

import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { QueryClient } from "@tanstack/react-query";
import { and, eq } from "@tigawanna/typed-pocketbase";
import { viewerQueryOptions } from "../viewer/query-options";
import {
  addItemToWatchlist,
  collectionMetadataSchema,
  createWatchlist,
  deleteWatchlist,
  removeItemFromWatchlist,
  updateWatchlist,
} from "./watchlist-mutions";

/*
================================================================================
UTILITY FUNCTIONS
================================================================================
*/

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
    queryKey: ["watchlist", "mine"],
    queryFn: () => getUserwatchlist(userId),
    staleTime: TSQ_CACHE_TIME,
    gcTime: TSQ_CACHE_TIME,
  });
  return response;
}

/*
================================================================================
MY WATCHLISTS COLLECTION (Main user watchlists with caching)
================================================================================
*/

// Function that creates a new my watchlists collection instance
function createMyWatchlistsCollection(qc: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "mine", "collection"],
      queryFn: async () => {
        const user = await queryClient.fetchQuery(viewerQueryOptions());
        const userId = user?.record?.id;
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const response = await getUserWatchListFromQueryClient(qc, userId);
        return response;
      },
      queryClient: queryClient,
      getKey: (item) => item.id,
      onInsert: async ({ transaction }) => {
        const { modified, metadata } = transaction.mutations[0];
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const forceRefetch = !!parsedMetadata && parsedMetadata.force_refetch;
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: forceRefetch };
        }
        await createWatchlist(modified);
          return { refetch: forceRefetch };
      },
      onUpdate: async ({ transaction }) => {
        const { modified, metadata } = transaction.mutations[0];
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const forceRefetch = !!parsedMetadata && parsedMetadata.force_refetch;
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: forceRefetch };
        }
        await updateWatchlist(modified);
          return { refetch: forceRefetch };
      },
      onDelete: async ({ transaction }) => {
        const { original, metadata } = transaction.mutations[0];
        await deleteWatchlist(original.id);
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const forceRefetch = !!parsedMetadata && parsedMetadata.force_refetch;
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: forceRefetch };
        }
          return { refetch: forceRefetch };
      },
    })
  );
}

// Type for the my watchlists collection return type
type MyWatchlistsCollection = ReturnType<typeof createMyWatchlistsCollection>;

// Cache to memoize my watchlists collections per QueryClient
const myWatchlistsCache: WeakMap<QueryClient, MyWatchlistsCollection> = new WeakMap();

export const myWatchlistsCollection = (qc: QueryClient) => {
  // Return existing collection if present
  if (myWatchlistsCache.has(qc)) {
    return myWatchlistsCache.get(qc)!;
  }
  // Otherwise, create and cache a new collection
  const collection = createMyWatchlistsCollection(qc);
  myWatchlistsCache.set(qc, collection);
  return collection;
};

/*
================================================================================
MY WATCHLIST ITEMS COLLECTION (All items across all user watchlists)
================================================================================
*/

// Function that creates a new my watchlist items collection instance
function createMyWatchlistItemsCollection(qc: QueryClient) {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "mine", "collection", "items"],
      queryFn: async () => {
        const user = await queryClient.fetchQuery(viewerQueryOptions());
        const userId = user?.record?.id;
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
        return watchListItems;
      },
      queryClient: queryClient,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
}

// Type for the my watchlist items collection return type
type MyWatchlistItemsCollection = ReturnType<typeof createMyWatchlistItemsCollection>;

// Cache to memoize my watchlist items collections per QueryClient
const myWatchlistItemsCache: WeakMap<QueryClient, MyWatchlistItemsCollection> = new WeakMap();

export const myWatchlistItemsCollection = (qc: QueryClient) => {
  // Return existing collection if present
  if (myWatchlistItemsCache.has(qc)) {
    return myWatchlistItemsCache.get(qc)!;
  }
  // Otherwise, create and cache a new collection
  const collection = createMyWatchlistItemsCollection(qc);
  myWatchlistItemsCache.set(qc, collection);
  return collection;
};

/*
================================================================================
SINGLE WATCHLIST ITEMS COLLECTION (Items within a specific user watchlist)
================================================================================
*/

interface SingleWatchlistItemsCollectionProps {
  qc: QueryClient;
  watchlistId: string;
}

// Function that creates a new single watchlist items collection instance
function createSingleWatchlistItemsCollection({
  qc,
  watchlistId,
}: SingleWatchlistItemsCollectionProps) {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "mine", "collection", "details", watchlistId],
      queryFn: async () => {
        const user = await queryClient.fetchQuery(viewerQueryOptions());
        const userId = user?.record?.id;
        if (!userId) {
          throw new Error("User not authenticated");
        }
        if (!watchlistId) {
          throw new Error("Watchlist ID is required");
        }
        const response = await getUserWatchListFromQueryClient(qc, userId);
        const singleWatchlist = response.find((item) => item.id === watchlistId);
        return singleWatchlist?.expand?.items || [];
      },
      queryClient: queryClient,
      enabled: !!watchlistId,
      getKey: (item) => item.id,
      onInsert: async ({ transaction }) => {
        const { modified, metadata } = transaction.mutations[0];
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const forceRefetch = !!parsedMetadata && parsedMetadata.force_refetch;
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: forceRefetch };
        }
        await addItemToWatchlist({
          watchlistId: watchlistId,
          watchlistItem: modified,
        });
        return { refetch: forceRefetch };
      },
      onDelete: async ({ transaction }) => {
        const { original, metadata } = transaction.mutations[0];
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const forceRefetch = !!parsedMetadata && parsedMetadata.force_refetch;
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: forceRefetch };
        }

        await removeItemFromWatchlist({
          itemId: original.id,
          watchlistId: watchlistId,
        });
        return { refetch: forceRefetch };
      },
    })
  );
}

// Type for the single watchlist items collection return type
type SingleWatchlistItemsCollection = ReturnType<typeof createSingleWatchlistItemsCollection>;

// Cache to memoize single watchlist items collections per QueryClient and watchlistId
const singleWatchlistItemsCache: WeakMap<
  QueryClient,
  Map<string, SingleWatchlistItemsCollection>
> = new WeakMap();

export const mySingleWatchlistItemsCollection = (qc: QueryClient, watchlistId: string) => {
  // Use QueryClient as weak key to store per-client cache
  let clientCache = singleWatchlistItemsCache.get(qc);
  if (!clientCache) {
    clientCache = new Map();
    singleWatchlistItemsCache.set(qc, clientCache);
  }
  // Return existing collection if present
  if (clientCache.has(watchlistId)) {
    return clientCache.get(watchlistId)!;
  }
  // Otherwise, create and cache a new collection
  const collection = createSingleWatchlistItemsCollection({ qc, watchlistId });
  clientCache.set(watchlistId, collection);
  return collection;
};
