import { addPocketbaseMetadata } from "@/lib/pb/client";
import { WatchlistItemsResponse, WatchlistResponse } from "@/lib/pb/types/pb-types";
import { logger } from "@/utils/logger";
import { QueryClient } from "@tanstack/react-query";
import { DiscoverListResultItem, getMediaTitle } from "../discover/discover-zod-schema";
import { communityWatchlistsCollection } from "./community-watchlist";
import { myWatchlistsCollection } from "./my-watchlist";

type WatchlistFormData = {
  title: string;
  visibility: "public" | "private" | "followers_only";
  user_id: string;
  items?: string | string[] | undefined;
  is_collaborative?: boolean | undefined;
  created?: string | Date | undefined;
  updated?: string | Date | undefined;
  overview?: string | undefined;
  id?: string | undefined;
};

interface CreateOrUpdateWatchlistProps {
  editingWatchlist?: WatchlistResponse | null;
  type: "mine" | "community";
  qc: QueryClient;
  data: WatchlistFormData;
  keyword?: string;
  page?: number;
}
export function createOrUpdateWatchlist({
  editingWatchlist,
  qc,
  type,
  data,
  keyword,
  page,
}: CreateOrUpdateWatchlistProps) {
  // console.log(
  //   "\n\ncreateOrUpdateWatchlist called with data: >> ",
  //   data,
  //   "\n\ntype:",
  //   type,
  //   "\n\neditingWatchlist:",
  //   editingWatchlist
  // );
  try {
    if (type === "mine") {
      if (editingWatchlist) {
        //  update my watchlist and call remote saving
        myWatchlistsCollection(qc).update(
          editingWatchlist.id,
          {
            //   metadata: {
            //     update_type: "local",
            //   },
          },
          (draft) => {
            Object.assign(draft, data);
          }
        );
        // mirror changes but don't call remote saving
        communityWatchlistsCollection({ qc, keyword, page }).update(
          editingWatchlist.id,
          {
            metadata: {
              update_type: "local",
            },
          },
          (draft) => {
            Object.assign(draft, data);
          }
        );
      } else {
        const newWatchlist = {
          ...addPocketbaseMetadata(data),
          collectionName: "watchlist",
          overview: data.overview || "",
          items: typeof data.items === "string" ? [data.items] : data.items || [],
          is_collaborative: data.is_collaborative ? true : false,
        } as const;
        myWatchlistsCollection(qc).insert(newWatchlist);
        // mirror changes but don't call remote saving
        communityWatchlistsCollection({ qc, keyword, page }).insert(newWatchlist, {
          metadata: {
            update_type: "local",
          },
        });
      }
    }
    if (type === "community") {
      if (editingWatchlist) {
        //  update community collection
        communityWatchlistsCollection({ qc, keyword, page }).update(
          editingWatchlist.id,
          {
            // metadata: {
            //   update_type: "local",
            // },
          },
          (draft) => {
            Object.assign(draft, data);
          }
        );
        // mirror into my watchlist but don't call remote persistor (pocketbase save)
        myWatchlistsCollection(qc).update(
          editingWatchlist.id,
          {
            metadata: {
              update_type: "local",
            },
          },
          (draft) => {
            Object.assign(draft, data);
          }
        );
      } else {
        const newWatchlist = {
          ...addPocketbaseMetadata(data),
          collectionName: "watchlist",
          overview: data.overview || "",
          items: typeof data.items === "string" ? [data.items] : data.items || [],
          is_collaborative: data.is_collaborative ? true : false,
        } as const;
        //  insert into community collection
        communityWatchlistsCollection({ qc, keyword, page }).insert(newWatchlist, {
          // metadata: {
          //   update_type: "local",
          // },
        });
        // mirror into my watchlist but don't call remote persistor (pocketbase save)
        myWatchlistsCollection(qc).insert(newWatchlist, {
          metadata: {
            update_type: "local",
          },
        });
      }
    }
  } catch (error) {
    console.error("Error in createOrUpdateWatchlist:", error);
    throw error;
  }
}

interface DeleteWatchlistFromCollectionProps {
  qc: QueryClient;
  watchlistId: string;
  type: "mine" | "community";
  keyword?: string;
  page?: number;
}
export async function deleteWatchlistFromCollection({
  qc,
  watchlistId,
  type,
  keyword,
  page,
}: DeleteWatchlistFromCollectionProps) {
  try {
    if (type === "mine") {
      await myWatchlistsCollection(qc).delete(watchlistId);
      await communityWatchlistsCollection({ qc, keyword, page }).delete(watchlistId, {
        metadata: {
          update_type: "local",
        },
      });
    } else {
      await communityWatchlistsCollection({ qc, keyword, page }).delete(watchlistId);
      await myWatchlistsCollection(qc).delete(watchlistId, {
        metadata: {
          update_type: "local",
        },
      });
    }
  } catch (error) {
    console.error("Error in deleteWatchlistFromCollection:", error);
    throw error;
  }
}

interface AddToWatchlistItemsMutationProps {
  qc: QueryClient;
  watchlistId: string;
  watchlistItem: WatchlistItemsResponse;
}
export function addItemToWatchlistItemsCollection({
  qc,
  watchlistId,
  watchlistItem,
}: AddToWatchlistItemsMutationProps) {
  // mySingleWatchlistItemsCollection(qc, watchlistId).insert(watchlistItem);

  // create_item: z
  //   .object({
  //     watchlistId: z.string().nonempty("Watchlist ID is required"),
  //     watchlistItem: WatchlistItemsCreateSchema,
  //   })
  
  myWatchlistsCollection(qc).update(watchlistId, {
    metadata: {
      create_item: {
        watchlistId,
        watchlistItem,
      },
    },
  }, (draft) => {
    if (!draft.items) {
      draft.items = [];
    }
    draft.items.push(watchlistItem.id);
  });
  communityWatchlistsCollection({ qc }).update(watchlistId, (draft) => {
    if (!draft.items) {
      draft.items = [];
    }
    draft.items.push(watchlistItem.id);
  });
}

interface RemoveFromWatchlistItemsMutationProps {
  qc: QueryClient;
  watchlistId: string;
  watchlistItemId: string;
}
export function removeItemToWatchlistItemsCollection({
  qc,
  watchlistId,
  watchlistItemId,
}: RemoveFromWatchlistItemsMutationProps) {
  logger.log("Removing item from watchlist:", watchlistId, watchlistItemId);
  // Remove from
  // const collection = mySingleWatchlistItemsCollection(qc, watchlistId)
  // console.log("\n\n Current watchlist items:", collection.keys())
  // collection.delete(watchlistItemId);
    
    // delete_item: z
    //   .object({
    //     watchlistId: z.string().nonempty("Watchlist ID is required"),
    //     watchlistItemId: z.string().nonempty("Item ID is required"),
    //   })

  myWatchlistsCollection(qc).update(
    watchlistId,
    {
      metadata: {
        delete_item: {
          watchlistId,
          watchlistItemId,
        },
      },
    },
    (draft) => {
      if (draft.items) {
        draft.items = draft.items.filter((id) => id !== watchlistItemId);
      }
    }
  );
  communityWatchlistsCollection({ qc }).update(watchlistId, (draft) => {
    if (draft.items) {
      draft.items = draft.items.filter((id) => id !== watchlistItemId);
    }
  });
}

// Clean type for TMDB items without watchlist metadata
export type CleanTMDBItem = Exclude<DiscoverListResultItem, { media_type: "person" }>;

/**
 * Helper function to add PocketBase metadata to TMDB items for watchlist insertion
 * @param payload - The TMDB item data (movie or TV show)
 * @param addedBy - The user ID who added the item
 * @returns Formatted WatchlistItemsResponse object with PocketBase metadata
 */
export const createWatchlistItemWithMetadata = (
  payload: CleanTMDBItem,
  addedBy: string
): WatchlistItemsResponse => {
  const now = new Date().toISOString();

  // Handle date field based on media type
  const releaseDate =
    payload.media_type === "movie" ? payload.release_date : payload.first_air_date;

  return {
    // PocketBase required fields
    collectionId: "pbc_562143027", // Default collection ID for watchlist_items
    collectionName: "watchlist_items" as const,
    created: now,
    updated: now,

    id: String(payload.id),
    title: getMediaTitle(payload), // Cast to satisfy getMediaTitle
    tmdb_id: payload.id,
    added_by: addedBy,
    overview: payload.overview || "",
    poster_path: payload.poster_path || "",
    backdrop_path: payload.backdrop_path || "",
    release_date: releaseDate || "",
    vote_average: payload.vote_average || 0,
    genre_ids: payload.genre_ids || [],
    media_type: payload.media_type,
    notes: "",
  };
};
