import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import { myWatchlistsCollection } from "./my-watchlist";
import { QueryClient } from "@tanstack/react-query";
import { communityWatchlistsCollection } from "./community-watchlist";

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
  editingWatchlist: WatchlistResponse | null;
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
        communityWatchlistsCollection({ qc, keyword, page}).update(
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
        //  create my watchlist and call remote saving
        myWatchlistsCollection(qc).insert(data as any);
        // mirror changes but don't call remote saving
        communityWatchlistsCollection({ qc, keyword, page}).insert(data as any, {
          metadata: {
            update_type: "local",
          },
        });
      }
    }
    if (type === "community") {
      if (editingWatchlist) {
        //  update community collection
        communityWatchlistsCollection({ qc, keyword, page}).update(
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

        //  insert into community collection
        communityWatchlistsCollection({ qc, keyword, page })
        .insert(data as any, {
          // metadata: {
          //   update_type: "local",
          // },
        });
        // mirror into my watchlist but don't call remote persistor (pocketbase save)
        myWatchlistsCollection(qc).insert(data as any, {
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
      await communityWatchlistsCollection({ qc, keyword, page }).delete(watchlistId,{
        metadata: {
          update_type: "local",
        },
      });
      
    } else {
      await communityWatchlistsCollection({ qc, keyword, page }).delete(watchlistId);
      await myWatchlistsCollection(qc).delete(watchlistId,{
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
