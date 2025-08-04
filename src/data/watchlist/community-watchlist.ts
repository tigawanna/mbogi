import { pb } from "@/lib/pb/client";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient, TSQ_CACHE_TIME } from "@/lib/tanstack/query/client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { and, eq, like, or } from "@tigawanna/typed-pocketbase";

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

export const communityWatchlistsCollection = ({
  keyword,
  page = 1,
  qc,
}: CommunityWatchlistCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      // Base community watchlists collection key
      queryKey: ["watchlist", "community", keyword, page, "collection"],
      queryFn: async () => {
        const response = await getCommunityWatchListFromQueryClient({ keyword, page, qc });

        return response.items ?? [];
      },
      queryClient: queryClient,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};

interface CommunityWatchlistItemsCollectionProps {
  keyword?: string;
  page?: number;
  qc: QueryClient;
  itemId: string;
}
export const communityWatchlistItemsCollection = ({
  keyword,
  page = 1,
  qc,
  itemId,
}: CommunityWatchlistItemsCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      // Key for items of a specific community watchlist
      queryKey: ["watchlist", "community", keyword, page, "details", itemId],
      queryFn: async () => {
        const response = await getCommunityWatchListFromQueryClient({ keyword, page, qc });
        const singleWatchlist = response.items.filter((item) => {
          return item.id === itemId;
        });
        return singleWatchlist[0]?.expand?.items ?? [];
      },
      queryClient: queryClient,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};
