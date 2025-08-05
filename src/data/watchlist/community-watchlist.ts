import { pb } from "@/lib/pb/client";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient, TSQ_CACHE_TIME } from "@/lib/tanstack/query/client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { and, eq, like, or } from "@tigawanna/typed-pocketbase";
import {
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addItemToWatchlist,
  removeItemFromWatchlist,
  collectionMetadataSchema,
} from "./watchlist-mutions";

/*
================================================================================
UTILITY FUNCTIONS
================================================================================
*/

interface GetCommunitywatchlistProps {
  keyword?: string;
  page: number;
}

async function getCommunitywatchlist({ keyword, page = 1 }: GetCommunitywatchlistProps) {
  const response = await pb.from("watchlist").getList(page, 50, {
    filter: and(
      or(
        like("title", `%${keyword ?? ""}%`),
        like("overview", `%${keyword ?? ""}%`),
        like("user_id.name", `%${keyword ?? ""}%`)
      ),
      eq("visibility", "public")
    ),
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

interface CommunityWatchlistCollectionProps {
  keyword?: string;
  page?: number;
  qc: QueryClient;
}

export async function getCommunityWatchListFromQueryClient({
  qc,
  keyword,
  page = 1,
}: CommunityWatchlistCollectionProps) {
  const response = await qc.fetchQuery({
    queryKey: ["watchlist", "community", keyword, page],
    queryFn: () => getCommunitywatchlist({ keyword, page }),
    staleTime: TSQ_CACHE_TIME,
    gcTime: TSQ_CACHE_TIME,
  });
  return response;
}

export function getCommunityWatchlistPageOptionsQueryOptions({
  qc,
  keyword,
  page,
}: CommunityWatchlistCollectionProps) {
  return queryOptions({
    queryKey: ["watchlist", "community", keyword, page, "page-options"],
    queryFn: async () => {
      const response = await getCommunityWatchListFromQueryClient({ keyword, page, qc });
      return {
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.page,
        perPage: response.perPage,
      };
    },
    staleTime: TSQ_CACHE_TIME,
    gcTime: TSQ_CACHE_TIME,
  });
}

/*
================================================================================
COMMUNITY WATCHLISTS COLLECTION (Main collection with caching)
================================================================================
*/

// Function that creates a new collection instance
function createCommunityWatchlistCollection({
  keyword,
  page = 1,
  qc,
}: CommunityWatchlistCollectionProps) {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "community", keyword, page, "collection"],
      queryFn: async () => {
        const response = await getCommunityWatchListFromQueryClient({ keyword, page, qc });
        return response.items ?? [];
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

// Type for the collection return type
type CommunityWatchlistCollection = ReturnType<typeof createCommunityWatchlistCollection>;

// Cache to memoize collections per QueryClient and filters
const communityWatchlistCache: WeakMap<
  QueryClient,
  Map<string, CommunityWatchlistCollection>
> = new WeakMap();

export const communityWatchlistsCollection = ({
  keyword,
  page = 1,
  qc,
}: CommunityWatchlistCollectionProps) => {
  // Use QueryClient as weak key to store per-client cache
  let clientCache = communityWatchlistCache.get(qc);
  if (!clientCache) {
    clientCache = new Map();
    communityWatchlistCache.set(qc, clientCache);
  }
  // Derive cache key from filters
  const cacheKey = `${keyword ?? ""}:${page}`;
  // Return existing collection if present
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }
  // Otherwise, create and cache a new collection
  const collection = createCommunityWatchlistCollection({ keyword, page, qc });
  clientCache.set(cacheKey, collection);
  return collection;
};

/*
================================================================================
COMMUNITY WATCHLIST ITEMS COLLECTION (Items within a specific watchlist)
================================================================================
*/

interface CommunityWatchlistItemsCollectionProps {
  keyword?: string;
  page?: number;
  qc: QueryClient;
  watchlistId: string;
}

// Function that creates a new items collection instance
function createCommunityWatchlistItemsCollection({
  keyword,
  page = 1,
  qc,
  watchlistId,
}: CommunityWatchlistItemsCollectionProps) {
  return createCollection(
    queryCollectionOptions({
      // Key for items of a specific community watchlist
      queryKey: ["watchlist", "community", keyword, page, "details", watchlistId],
      queryFn: async () => {
        const response = await getCommunityWatchListFromQueryClient({ keyword, page, qc });
        const singleWatchlist = response.items.filter((item) => {
          return item.id === watchlistId;
        });
        return singleWatchlist[0]?.expand?.items ?? [];
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
        await addItemToWatchlist({
          watchlistId: watchlistId,
          watchlistItem: modified,
        });
        return { refetch: true };
      },
      onDelete: async ({ transaction }) => {
        const { original, metadata } = transaction.mutations[0];
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

// Type for the items collection return type
type CommunityWatchlistItemsCollection = ReturnType<typeof createCommunityWatchlistItemsCollection>;

// Cache to memoize items collections per QueryClient and filters
const communityWatchlistItemsCache: WeakMap<
  QueryClient,
  Map<string, CommunityWatchlistItemsCollection>
> = new WeakMap();

export const communityWatchlistItemsCollection = ({
  keyword,
  page = 1,
  qc,
  watchlistId,
}: CommunityWatchlistItemsCollectionProps) => {
  // Use QueryClient as weak key to store per-client cache
  let clientCache = communityWatchlistItemsCache.get(qc);
  if (!clientCache) {
    clientCache = new Map();
    communityWatchlistItemsCache.set(qc, clientCache);
  }
  // Derive cache key from filters and watchlistId
  const cacheKey = `${keyword ?? ""}:${page}:${watchlistId}`;
  // Return existing collection if present
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }
  // Otherwise, create and cache a new collection
  const collection = createCommunityWatchlistItemsCollection({ keyword, page, qc, watchlistId });
  clientCache.set(cacheKey, collection);
  return collection;
};

/*
================================================================================
ZUSTAND STORE (Commented out - moved to separate file)
================================================================================
*/

// interface CommunityWatchlistFilters {
//   keyword: string;
//   page: number;
//   setKeyword: (keyword: string) => void;
//   setPage: (page: number) => void;
//   resetFilters: () => void;
// }

// export const useCommunityFiltersStore = create<CommunityWatchlistFilters>()(
//   devtools(
//     persist(
//       (set) => ({
//         keyword: "",
//         page: 1,
//         setKeyword: (keyword: string) => set({ keyword, page: 1 }),
//         setPage: (page: number) => set({ page }),
//         resetFilters: () => set({ keyword: "", page: 1 }),
//       }),
//       {
//         name: "community-watchlist-filters",
//       }
//     )
//   )
// );
