import { pb } from "@/lib/pb/client";
import { WatchlistItemsCreate } from "@/lib/pb/types/pb-types";
import {
  WatchlistCreate,
  WatchlistCreateSchema,
  WatchlistItemsCreateSchema,
  WatchlistUpdate,
  WatchlistUpdateSchema,
} from "@/lib/pb/types/pb-zod";
import { createPromise } from "@/utils/promise";
import { mutationOptions } from "@tanstack/react-query";
import { z } from "zod";

// Props for modifying items in a watchlist
interface CreateWatchlistItemsMutationProps {
  watchlistId: string;
  watchlistItem: WatchlistItemsCreate;
}

export async function createWatchList(payload: CreateWatchlistItemsMutationProps) {
  try {
    const inputs = z
      .object({
        watchlistId: z.string().nonempty("Watchlist ID is required"),
        watchlistItem: WatchlistItemsCreateSchema,
      })
      .parse(payload);
    // Cast to any to allow multi-relation update operator
    await pb
      .from("watchlist_items")
      .create(inputs.watchlistItem)
      .catch((error) => {
        const items_exists = error.data?.data?.tmdb_id?.code === "validation_not_unique";
        if (items_exists) {
          console.warn("Item already exists in watchlist items , adding directly to watchlist");
          return pb
            .from("watchlist")
            .update(inputs.watchlistId, { "items+": [inputs.watchlistItem.id] } as any);
        }
        throw error;
      });
    return await pb
      .from("watchlist")
      .update(inputs.watchlistId, { "items+": [inputs.watchlistItem.id] } as any);
  } catch (error) {
    console.log("Error creating watchlist item:", error);
    throw error;
  }
}

const fakePocketbasePromise = createPromise<string>((resolve) => {
  setTimeout(() => {
    resolve("This is a fake promise");
  }, 10_000);
});

interface CreateWatchlistMutationPorps {
  payload: WatchlistCreate;
}

export function createWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: async (vars: CreateWatchlistMutationPorps) => {
      const inputs = WatchlistCreateSchema.parse(vars.payload);
      // return await pb.from("watchlist").create(inputs);
      return await fakePocketbasePromise; // Simulating a PocketBase call
    },
  });
}

interface updateWatchlistMutationPorps {
  payload: WatchlistUpdate;
}
export function updateWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: async (vars: updateWatchlistMutationPorps) => {
      const inputs = WatchlistUpdateSchema.extend({
        id: z.string().nonempty("ID is required"),
      }).parse(vars.payload);
      return await pb.from("watchlist").update(inputs.id, inputs);
    },
  });
}

/**
 * Delete an entire watchlist
 */
export function deleteWatchlistMutationOptions() {
  return mutationOptions({
    mutationFn: async (vars: { watchlistId: string }) => {
      const inputs = z
        .object({
          watchlistId: z.string().nonempty("Watchlist ID is required"),
        })
        .parse(vars);
      return await pb.from("watchlist").delete(inputs.watchlistId);
    },
  });
}

/**
 * Add an item to a watchlist (PocketBase multi-relation field)
 */
export function addItemToWatchlistMutationOptions() {
  return mutationOptions({
    mutationFn: async (payload: CreateWatchlistItemsMutationProps) => {
      return await createWatchList(payload);
    },
  });
}

interface RemoveWatchlistItemsMutationProps {
  payload: {
    watchlistId: string;
    itemId: string;
  };
}

/**
 * Remove an item from a watchlist (PocketBase multi-relation field)
 */
export function removeItemFromWatchlistMutationOptions() {
  return mutationOptions({
    mutationFn: async (vars: RemoveWatchlistItemsMutationProps) => {
      const inputs = z
        .object({
          watchlistId: z.string().nonempty("Watchlist ID is required"),
          itemId: z.string().nonempty("Item ID is required"),
        })
        .parse(vars.payload);
      // Cast to any to allow multi-relation remove operator
      return await pb
        .from("watchlist")
        .update(inputs.watchlistId, { "items-": [inputs.itemId] } as any);
    },
  });
}
