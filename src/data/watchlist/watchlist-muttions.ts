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

interface CreateWatchlistMutationPorps {
  payload: WatchlistCreate;
}
export function createWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: async (vars: CreateWatchlistMutationPorps) => {
      const inputs = WatchlistCreateSchema.parse(vars.payload);
      return await pb.from("watchlist").create(inputs);
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
  

// Props for modifying items in a watchlist
interface CreateWatchlistItemsMutationProps {
  payload: {
    watchlistId: string;
    itemId: string;
    watchlistItem: WatchlistItemsCreate;
  };
}

/**
 * Add an item to a watchlist (PocketBase multi-relation field)
 */
export function addItemToWatchlistMutationOptions() {
  return mutationOptions({
    mutationFn: async ({ payload }: CreateWatchlistItemsMutationProps) => {
      const inputs = z
        .object({
          watchlistId: z.string().nonempty("Watchlist ID is required"),
          itemId: z.string().nonempty("Item ID is required"),
          watchlistItem: WatchlistItemsCreateSchema,
        })
        .parse(payload);
      // Cast to any to allow multi-relation update operator
      await pb.from("watchlist_items").create(inputs.watchlistItem);
      return await pb
        .from("watchlist")
        .update(inputs.watchlistId, { "items+": [inputs.itemId] } as any);
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
      return await pb.from("watchlist").update(
        inputs.watchlistId,
        { "items-": [inputs.itemId] } as any
      );
    },
  });
}

