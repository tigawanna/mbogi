import { pb } from "@/lib/pb/client";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { and, eq, like, or } from "@tigawanna/typed-pocketbase";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient } from "@/lib/tanstack/query/client";
import { CACHETIME } from "@/lib/tanstack/query/external-dev-tools";



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
    staleTime: CACHETIME,
    gcTime: CACHETIME
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
    staleTime: CACHETIME,
    gcTime: CACHETIME
  });
}

export const communityWatchlistCollection = ({
  keyword,
  page = 1,
  qc,
}: CommunityWatchlistCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "community", keyword, page, "collection"],
      queryFn: async () => {
        const response = await getCommunityWatchListFromQueryClient({ keyword, page, qc });
        console.log("Community Watchlist Collection Response:", response);
        return response.items ?? [];
      },
      queryClient: queryClient,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};
