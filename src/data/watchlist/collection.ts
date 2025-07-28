import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/lib/tanstack/query/client";
import z from "zod";
import { pb } from "@/lib/pb/client";


const watchlistSchema = z.object({
    id: z.string(),
    collectionId: z.string(),
    collectionName: z.literal("watchlist"),
    title: z.string(),
    overview: z.string(),
    user_id: z.array(z.string()),
    items: z.array(z.string()),
    visibility: z.array(z.enum(["public", "private", "followers_only"])),
    is_collaborative: z.boolean(),
    created: z.string(),
    updated: z.string()
});


export const watchlistCollection = createCollection(
  queryCollectionOptions({    
    queryKey: ["watchlist"],
    queryFn: async () => {
     const response =   await pb.from("watchlist").getList(1,25)
     return (await response).items
    },
    queryClient:queryClient,
    getKey: (item) => item.id,
    schema: watchlistSchema,
  })
);
