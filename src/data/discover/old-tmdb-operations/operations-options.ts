import { pb } from "@/lib/pb/client";
import {
  WatchedListUpdate,
  WatchlistCreate,
  WatchlistItemsCreate,
  WatchlistUpdate,
} from "@/lib/pb/types/pb-types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { eq } from "@tigawanna/typed-pocketbase";

export function createWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (newItem: WatchlistCreate) => {
      return pb.from("watchlist").create(newItem, {
        select: {
          expand: {
            items: true,
          },
        },
      });
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
      ],
    },
  });
}

export function updateWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (newItem: WatchlistUpdate) => {
      return pb.from("watchlist").update(newItem.id, newItem, {
        select: {
          expand: {
            items: true,
          },
        },
      });
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
      ],
    },
  });
}

export function deleteWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (id: string) => {
      return pb.from("watchlist").delete(id);
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
        ["watchlist-items"], // Invalidate watchlist items queries
      ],
    },
  });
}

interface GetUserWatchlistQueryOptionsProps {
  keyword?: string;
  userId?: string;
}
export function getUserWatchlistQueryOptions({
  keyword,
  userId,
}: GetUserWatchlistQueryOptionsProps) {
  return queryOptions({
    queryKey: userId ? ["watchlist", userId, keyword] : ["watchlist", "community", keyword],
    queryFn: () => {
      return pb.from("watchlist").getList(1, 25, {
        filter: userId ? `user_id ~ "${userId}"` : undefined,
        sort: "-created",
        select: {
          expand: {
            items: true,
          },
        },
      });
    },
    // enabled: !!userId, // Only run if user is authenticated
  });
}

export function addTowatchListMutationOptions() {
  return mutationOptions({
    mutationFn: async (payload: { watchlistId: string; itemPayload: WatchlistItemsCreate }) => {
      const { watchlistId, itemPayload } = payload;

      // Check if item already exists in watchlist_items
      try {
        const existingItem = await pb
          .from("watchlist_items")
          .getFirstListItem(eq("tmdb_id", itemPayload.tmdb_id));
      console.log("existingItem ===>> ", existingItem);
        // Item exists, just add it to the watchlist
        const updatedWatchlist = await pb.from("watchlist").update(
          watchlistId,
          {
            "items+": existingItem.id,
          } as any, // TypeScript casting needed for relation operations
          {
            select: {
              expand: {
                items: true,
              },
            },
          }
        );
        return updatedWatchlist;
      } catch {
        // Item doesn't exist, create it first then add to watchlist
        const createNewItemPayload = {
          id: String(itemPayload.tmdb_id),
          ...itemPayload,
        };
        console.log("createNewItemPayload ===>> ", createNewItemPayload);
        const newItem = await pb.from("watchlist_items").create(createNewItemPayload);

        const updatedWatchlist = await pb.from("watchlist").update(
          watchlistId,
          {
            "items+": newItem.id,
          } as any, // TODO TypeScript casting needed for relation operations
          {
            select: {
              expand: {
                items: true,
              },
            },
          }
        );
        return updatedWatchlist;
      }
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
        ["watchlist-items"], // Invalidate watchlist items queries
      ],
    },
  });
}

export function removeFromWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: async (payload: { watchlistId: string; itemId: string }) => {
      const { watchlistId, itemId } = payload;
      return pb.from("watchlist").update(
        watchlistId,
        {
          "items-": itemId,
        } as any, // TypeScript casting needed for relation operations
        {
          select: {
            expand: {
              items: true,
            },
          },
        }
      );
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
        ["watchlist-items"], // Invalidate watchlist items queries
      ],
    },
  });
}

export function getUserWatchedlistQueryOptions({ userId }: { userId: string }) {
  return queryOptions({
    queryKey: ["watched-list", userId],
    queryFn: () => {
      return pb.from("watched_list").getList(1, 100, {
        filter: eq("user_id", userId as any),
      });
    },
    select: (data) => {
      // Flatten all watched items from all watched lists
      return data.items.flatMap((watchedList) => {
        return watchedList?.items || [];
      });
    },
  });
}

export function markWachedMutationOptions() {
  const userId = pb.authStore.record?.id;
  return mutationOptions({
    mutationFn: async (payload: { itemId: string; watched: boolean }) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const { itemId, watched } = payload;
      const updatedWatcedStatus = watched
        ? ({
            "items-": itemId,
          } as WatchedListUpdate)
        : ({
            "items+": itemId,
          } as WatchedListUpdate);
      const userrWatchedList = await pb
        .from("watched_list")
        .getFirstListItem(eq("user_id", userId as any));
        console.log("userrWatchedList ===>> ", userrWatchedList);
      if (!userrWatchedList) {
        // Create a new watched list for the user
        await pb.from("watched_list").create({
          user_id: userId,
          items: [itemId],
        });
      }
      return pb.from("watched_list").update(
        userrWatchedList.id,
        updatedWatcedStatus, // TypeScript casting needed for relation operations due to a typed pocketbase bug
        {}
      );
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
        ["watchlist-items"], // Invalidate watchlist items queries
        ["watched-list", userId], // Invalidate watched list queries
      ],
    },
  });
}
