import { pb } from "@/lib/pb/client";
import { WatchlistItemsCreate } from "@/lib/pb/types/pb-types";
import {
  WatchlistCreate,
  WatchlistCreateSchema,
  WatchlistItemsCreateSchema,
  WatchlistUpdate,
  WatchlistUpdateSchema,
} from "@/lib/pb/types/pb-zod";
import { mutationOptions } from "@tanstack/react-query";
import { z } from "zod";

pb.autoCancellation(false);

export async function createWatchlist(payload: WatchlistCreate) {
  try {
    const inputs = WatchlistCreateSchema.parse(payload);
    return await pb.from("watchlist").create(inputs);
  } catch (error) {
    console.log("Error creating watchlist:", error);
    throw error;
  }
}

export function createWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: WatchlistCreate) => createWatchlist(payload),
  });
}

export async function updateWatchlist(payload: WatchlistUpdate) {
  try {
    const inputs = WatchlistUpdateSchema.extend({
      id: z.string().nonempty("Watchlist ID is required"),
    }).parse(payload);
    return await pb.from("watchlist").update(inputs.id, inputs);
  } catch (error) {
    console.log("Error updating watchlist:", error);
    throw error;
  }
}
export function updateWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: async (payload: WatchlistUpdate) => updateWatchlist(payload),
  });
}

/**
 * Delete an entire watchlist
 */
export async function deleteWatchlist(watchlistId: string) {
  if (!watchlistId) {
    throw new Error("Watchlist ID is required");
  }
  return await pb.from("watchlist").delete(watchlistId);
}
export function deleteWatchlistMutationOptions() {
  return mutationOptions({
    mutationFn: async (vars: { watchlistId: string }) => deleteWatchlist(vars.watchlistId),
  });
}

//  WATCHLIST ITEMS MUTATIONS

// Props for modifying items in a watchlist
interface AddToWatchlistItemsMutationProps {
  watchlistId: string;
  watchlistItem: WatchlistItemsCreate;
}

export async function addItemToWatchlist(payload: AddToWatchlistItemsMutationProps) {
  try {
    const inputs = z
      .object({
        watchlistId: z.string().nonempty("Watchlist ID is required"),
        watchlistItem: WatchlistItemsCreateSchema,
      })
      .parse(payload);
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

/**
 * Add an item to a watchlist (PocketBase multi-relation field)
 */
export function addItemToWatchlistMutationOptions() {
  return mutationOptions({
    mutationFn: async (payload: AddToWatchlistItemsMutationProps) => {
      return await addItemToWatchlist(payload);
    },
  });
}

interface RemoveWatchlistItemsMutationProps {
  watchlistId: string;
  itemId: string;
}

export async function removeItemFromWatchlist(payload: RemoveWatchlistItemsMutationProps) {
  const inputs = z
    .object({
      watchlistId: z.string().nonempty("Watchlist ID is required"),
      itemId: z.string().nonempty("Item ID is required"),
    })
    .parse(payload);
  // Cast to any to allow multi-relation remove operator
  return await pb
    .from("watchlist")
    .update(inputs.watchlistId, { "items-": [inputs.itemId] } as any);
}

/**
 * Remove an item from a watchlist (PocketBase multi-relation field)
 */
export function removeItemFromWatchlistMutationOptions() {
  return mutationOptions({
    mutationFn: async (payload: RemoveWatchlistItemsMutationProps) =>
      removeItemFromWatchlist(payload),
  });
}


export const collectionMetadataSchema = z.object({
  update_type:z.enum(["local","both"]).optional(),
  force_refetch:z.boolean().optional().default(false)
}).optional()
