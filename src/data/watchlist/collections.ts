import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/lib/tanstack/query/client";
import z from "zod";
import { pb } from "@/lib/pb/client";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { and, eq, like, or } from "@tigawanna/typed-pocketbase";
import { id } from "zod/v4/locales";
import { queryOptions } from "@tanstack/react-query";

export const myWatchlistCollection = () => {
  const userId = pb.authStore.record?.id;
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User not authenticated");
        }
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
        return await response;
      },
      queryClient: queryClient,
      enabled: !!userId,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};



interface CommunityWatchlistCollectionProps {
  keyword?: string;
  page?: number;
}
export const communityWatchlistqueryoptions = ({
  keyword,
  page = 1,
}: CommunityWatchlistCollectionProps) => {
return queryOptions({
  queryKey: ["watchlist", "community", keyword, page],
  queryFn: async () => {
    const response = await pb.from("watchlist").getList(page, 50, {
      filter: and(
        or(
          like("title", `%${keyword ?? ""}%`),
          like("overview", `%${keyword ?? ""}%`),
          like("user_id.username", `%${keyword ?? ""}%`)
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
    return response
  },
  select(data) {
    return data.items;
  },
});
}
export const communityWatchlistCollection = ({
  keyword,
  page = 1,
}: CommunityWatchlistCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "community", keyword, page],
      queryFn: async () => {
        const response = await pb.from("watchlist").getList(page, 50, {
          filter: and(
            or(like("title", `%${keyword ?? ""}%`),
             like("overview", `%${keyword ?? ""}%`),
              like("user_id.username", `%${keyword ?? ""}%`)
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
        return response.items;
      },
      queryClient: queryClient,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};
