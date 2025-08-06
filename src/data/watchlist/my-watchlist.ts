import { pb } from "@/lib/pb/client";
import { queryClient, TSQ_CACHE_TIME } from "@/lib/tanstack/query/client";

import { logger } from "@/utils/logger";
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
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: true };
        }
        await createWatchlist(modified);
        return { refetch: true };
      },
      onUpdate: async ({ transaction }) => {
        const { modified, metadata } = transaction.mutations[0];
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: true };
        }
        await updateWatchlist(modified);
        return { refetch: true };
      },
      onDelete: async ({ transaction }) => {
        const { original, metadata } = transaction.mutations[0];
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: true };
        }
        await deleteWatchlist(original.id);
        return { refetch: true };
      },
    })
  );
}

// Type for the my watchlists collection return type
type MyWatchlistsCollection = ReturnType<typeof createMyWatchlistsCollection>;

// Cache key object for my watchlists
const myWatchlistsCacheKey = { type: "my-watchlists" };

// Cache to memoize my watchlists collections using WeakMap
const myWatchlistsCache = new WeakMap<object, MyWatchlistsCollection>();

export const myWatchlistsCollection = (qc: QueryClient) => {
  // Return existing collection if present
  if (myWatchlistsCache.has(myWatchlistsCacheKey)) {
    return myWatchlistsCache.get(myWatchlistsCacheKey)!;
  }
  // Otherwise, create and cache a new collection
  const collection = createMyWatchlistsCollection(qc);
  myWatchlistsCache.set(myWatchlistsCacheKey, collection);
  return collection;
};



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
        const watchListItems = singleWatchlist?.expand?.items || [];
        return watchListItems;  
      },
      queryClient: queryClient,
      enabled: !!watchlistId,
      getKey: (item) => item.id,
      onInsert: async ({ transaction }) => {
        const { modified, metadata } = transaction.mutations[0];
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: true };
        }
        await addItemToWatchlist({
          watchlistId: watchlistId,
          watchlistItem: modified,
        });
        return { refetch: true };
      },

      onDelete: async ({ transaction }) => {
        const { original, metadata } = transaction.mutations[0];
        console.log("Deleting item from watchlist:", original.id);
        const parsedMetadata = collectionMetadataSchema.parse(metadata);
        const localOnlyUpdate = parsedMetadata && parsedMetadata.update_type === "local";
        if (localOnlyUpdate) {
          return { refetch: true };
        }

        await removeItemFromWatchlist({
          itemId: original.id,
          watchlistId: watchlistId,
        });
        return { refetch: true };
      },
    })
  );
}

export class MySingleWatchlistItemsKey {
  constructor(
    public readonly qc: QueryClient,
    public readonly watchlistId: string
  ) {}

  // Override toString for debugging purposes
  toString() {
    return `MySingleWatchlistItemsKey(watchlistId: ${this.watchlistId})`;
  }
}

// Type for the single watchlist items collection return type
type SingleWatchlistItemsCollection = ReturnType<typeof createSingleWatchlistItemsCollection>;

// Cache to store key instances by watchlistId to ensure object identity
const cacheKeyStore = new Map<string, MySingleWatchlistItemsKey>();

// Cache to memoize single watchlist items collections per watchlistId using WeakMap
const singleWatchlistItemsCache = new WeakMap<MySingleWatchlistItemsKey, SingleWatchlistItemsCollection>();

export const mySingleWatchlistItemsCollection = (qc: QueryClient, watchlistId: string) => {
  // Get or create a stable key instance for this watchlistId
  let cacheKey = cacheKeyStore.get(watchlistId);
  if (!cacheKey) {
    cacheKey = new MySingleWatchlistItemsKey(qc, watchlistId);
    cacheKeyStore.set(watchlistId, cacheKey);
  }
  
  // Return existing collection if present
  if (singleWatchlistItemsCache.has(cacheKey)) {
    console.log("\n\n cache hit", cacheKey.toString(), "\n");
    return singleWatchlistItemsCache.get(cacheKey)!;
  }
  console.log("\n\n cache miss", cacheKey.toString(), "\n");
  
  // Otherwise, create and cache a new collection
  const collection = createSingleWatchlistItemsCollection({ qc, watchlistId });
  singleWatchlistItemsCache.set(cacheKey, collection);
  return collection;
};
