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
}
export function createOrUpdateWatchlist({
  editingWatchlist,
  qc,
  type,
  data,
}: CreateOrUpdateWatchlistProps) {
  if (type === "mine") {
    if (editingWatchlist) {
      //  update my watchlist and call remote saving
      myWatchlistsCollection(qc).update(
        editingWatchlist.id,
        {
          //   metadata: {
          //     update: "local",
          //   },
        },
        (draft) => {
          Object.assign(draft, data);
        }
      );
      // mirror changes but don't call remote saving
      communityWatchlistsCollection({ qc }).update(
        editingWatchlist.id,
        {
          metadata: {
            update: "local",
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
      communityWatchlistsCollection({ qc }).insert(data as any, {
        metadata: {
          update: "local",
        },
      });
    }
  }
  if (type === "community") {
    if (editingWatchlist) {
      //  update community collection
      myWatchlistsCollection(qc).update(
        editingWatchlist.id,
        {
          metadata: {
            update: "local",
          },
        },
        (draft) => {
          Object.assign(draft, data);
        }
      );
      // mirror into my watchlist but don't call remote persistor (pocketbase save)
      communityWatchlistsCollection({ qc }).update(
        editingWatchlist.id,
        {
          //   metadata: {
          //     update: "local",
          //   },
        },
        (draft) => {
          Object.assign(draft, data);
        }
      );
    } else {
      //  insert into community collection
      communityWatchlistsCollection({ qc }).insert(data as any, {
        // metadata: {
        //   update: "local",
        // },
      });
      // mirror into my watchlist but don't call remote persistor (pocketbase save)
      myWatchlistsCollection(qc).insert(data as any, {
        metadata: {
          update: "local",
        },
      });
    }
  }
}
