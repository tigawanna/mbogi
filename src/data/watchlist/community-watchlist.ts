import { pb } from "@/lib/pb/client";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { and, eq, like, or } from "@tigawanna/typed-pocketbase";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient } from "@/lib/tanstack/query/client";

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
    staleTime: 1000 * 60 * 60 * 72, // 72 hours (3 days)
    gcTime: 1000 * 60 * 60 * 72, // 72 hours (3 days)
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
    queryFn: () => getCommunityWatchListFromQueryClient({ keyword, page, qc }),
    staleTime: 1000 * 60 * 60 * 72, // 72 hours (3 days)
    gcTime: 1000 * 60 * 60 * 72, // 72 hours (3 days)
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
        return response.items;
      },
      queryClient: queryClient,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};
