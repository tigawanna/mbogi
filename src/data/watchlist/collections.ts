import { pb } from "@/lib/pb/client";
import { WatchlistResponseSchema } from "@/lib/pb/types/pb-zod";
import { queryClient } from "@/lib/tanstack/query/client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { and, eq, like, or } from "@tigawanna/typed-pocketbase";
import { useCommunityWatchListPageoptionsStore } from "./watchlist-stores";



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



// Normal collection from the items array in the watchlist
export const myWatchlistCollection = () => {
  const userId = pb.authStore.record?.id;
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const response = await getUserwatchlist(userId);
        return await response
      },
      queryClient: queryClient,
      enabled: !!userId,
      getKey: (item) => item.id,
      schema: WatchlistResponseSchema,
    })
  );
};



export const myWatchlistItemsCollection = () => {
  const userId = pb.authStore.record?.id;
  return createCollection(
    queryCollectionOptions({
      queryKey: ["watchlist", "items", userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const response = await getUserwatchlist(userId);
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


interface CommunityWatchlistCollectionProps {
  keyword?: string;
  page?: number;
}
// export const communityWatchlistqueryoptions = ({
//   keyword,
//   page = 1,
// }: CommunityWatchlistCollectionProps) => {
// return queryOptions({
//   queryKey: ["watchlist", "community", keyword, page],
//   queryFn: async () => {
//     const response = await pb.from("watchlist").getList(page, 50, {
//       filter: and(
//         or(
//           like("title", `%${keyword ?? ""}%`),
//           like("overview", `%${keyword ?? ""}%`),
//           like("user_id.username", `%${keyword ?? ""}%`)
//         ),
//         eq("visibility", "public")
//       ),
//       sort: "-created",
//       select: {
//         expand: {
//           user_id: true,
//           items: true,
//         },
//       },
//     });
//     return response
//   },
//   select(data) {
//     return data.items;
//   },
// });
// }
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
        useCommunityWatchListPageoptionsStore.getState().setOptions({
          page: response.page,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        });
        return response.items;
      },
      queryClient: queryClient,
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
