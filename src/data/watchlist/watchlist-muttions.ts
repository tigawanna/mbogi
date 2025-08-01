import { pb } from "@/lib/pb/client";
import { WatchlistCreateSchema, WatchlistUpdateSchema } from "@/lib/pb/types/pb-zod";
import { queryClient } from "@/lib/tanstack/query/client";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

// Source annotation types for optimistic mutations
export type MutationSource =
  | "discover-card"
  | "my-watchlist-card"
  | "community-watchlist-card"
  | "watchlist-detail"
  | "watchlist-form";

// Metadata for tracking mutation source
export interface MutationMetadata {
  source: MutationSource;
  timestamp: number;
  optimistic?: boolean;
}

// Enhanced optimistic update helpers with better collection management
const performOptimisticUpdates = (
  operation: "create" | "update" | "delete" | "add-item" | "remove-item",
  data: any,
  metadata: MutationMetadata
) => {
  const userId = pb.authStore.record?.id;
  if (!userId) return;

  // For React Query based collections, we need to manually update the cached data
  switch (operation) {
    case 'create':
      if (metadata.source === 'my-watchlist-card' || metadata.source === 'watchlist-form') {
        const tempId = `temp-${metadata.timestamp}`;
        
        // Update my watchlist query cache
        queryClient.setQueryData(["watchlist", userId], (oldData: any[]) => {
          if (!oldData) return [];
          
          const newWatchlist = {
            ...data,
            id: tempId,
            user_id: userId,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            items: [],
            expand: {
              user_id: pb.authStore.record,
              items: []
            }
          };
          
          return [...oldData, newWatchlist];
        });
        
        // If public, also update community watchlists cache
        if (data.visibility === 'public') {
          queryClient.setQueryData(["watchlist", "community", '', 1], (oldData: any) => {
            if (!oldData?.items) return oldData;
            
            const newWatchlist = {
              ...data,
              id: tempId,
              user_id: userId,
              created: new Date().toISOString(),
              updated: new Date().toISOString(),
              items: [],
              expand: {
                user_id: pb.authStore.record,
                items: []
              }
            };
            
            return {
              ...oldData,
              items: [...oldData.items, newWatchlist]
            };
          });
        }
      }
      break;

    case 'update':
      // Update in my watchlists cache
      if (metadata.source === 'my-watchlist-card' || metadata.source === 'watchlist-form') {
        queryClient.setQueryData(["watchlist", userId], (oldData: any[]) => {
          if (!oldData) return [];
          
          return oldData.map(watchlist => 
            watchlist.id === data.id 
              ? { ...watchlist, ...data, updated: new Date().toISOString() }
              : watchlist
          );
        });
      }
      
      // Update in community collection cache if it exists there
      queryClient.setQueryData(["watchlist", "community", '', 1], (oldData: any) => {
        if (!oldData?.items) return oldData;
        
        const hasItem = oldData.items.some((item: any) => item.id === data.id);
        if (!hasItem) return oldData;
        
        return {
          ...oldData,
          items: oldData.items.map((item: any) =>
            item.id === data.id 
              ? { ...item, ...data, updated: new Date().toISOString() }
              : item
          )
        };
      });
      break;

    case 'delete':
      if (metadata.source === 'my-watchlist-card') {
        queryClient.setQueryData(["watchlist", userId], (oldData: any[]) => {
          if (!oldData) return [];
          return oldData.filter(watchlist => watchlist.id !== data.id);
        });
      }
      
      // Remove from community collection cache if it exists there
      queryClient.setQueryData(["watchlist", "community", '', 1], (oldData: any) => {
        if (!oldData?.items) return oldData;
        
        return {
          ...oldData,
          items: oldData.items.filter((item: any) => item.id !== data.id)
        };
      });
      break;

    case 'add-item':
      // Update collections based on source
      const shouldUpdateMyCollection = metadata.source === 'discover-card' || 
                                     metadata.source === 'my-watchlist-card' ||
                                     metadata.source === 'watchlist-detail';
      
      if (shouldUpdateMyCollection) {
        queryClient.setQueryData(["watchlist", userId], (oldData: any[]) => {
          if (!oldData) return [];
          
          return oldData.map(watchlist => {
            if (watchlist.id === data.watchlistId) {
              const currentItems = watchlist.items || [];
              if (!currentItems.includes(data.itemId)) {
                return {
                  ...watchlist,
                  items: [...currentItems, data.itemId],
                  updated: new Date().toISOString()
                };
              }
            }
            return watchlist;
          });
        });
      }
      
      // Update community watchlists cache if the watchlist exists there
      queryClient.setQueryData(["watchlist", "community", '', 1], (oldData: any) => {
        if (!oldData?.items) return oldData;
        
        return {
          ...oldData,
          items: oldData.items.map((item: any) => {
            if (item.id === data.watchlistId) {
              const currentItems = item.items || [];
              if (!currentItems.includes(data.itemId)) {
                return {
                  ...item,
                  items: [...currentItems, data.itemId],
                  updated: new Date().toISOString()
                };
              }
            }
            return item;
          })
        };
      });
      break;

    case 'remove-item':
      // Update collections based on source
      const shouldUpdateMyCollectionForRemove = metadata.source === 'discover-card' || 
                                               metadata.source === 'my-watchlist-card' ||
                                               metadata.source === 'watchlist-detail';
      
      if (shouldUpdateMyCollectionForRemove) {
        queryClient.setQueryData(["watchlist", userId], (oldData: any[]) => {
          if (!oldData) return [];
          
          return oldData.map(watchlist => {
            if (watchlist.id === data.watchlistId) {
              return {
                ...watchlist,
                items: (watchlist.items || []).filter((id: string) => id !== data.itemId),
                updated: new Date().toISOString()
              };
            }
            return watchlist;
          });
        });
      }
      
      // Update community watchlists cache if the watchlist exists there
      queryClient.setQueryData(["watchlist", "community", '', 1], (oldData: any) => {
        if (!oldData?.items) return oldData;
        
        return {
          ...oldData,
          items: oldData.items.map((item: any) => {
            if (item.id === data.watchlistId) {
              return {
                ...item,
                items: (item.items || []).filter((id: string) => id !== data.itemId),
                updated: new Date().toISOString()
              };
            }
            return item;
          })
        };
      });
      break;
  }
};

// Create watchlist mutation with optimistic updates
export function useCreateWatchlistMutation(options: { source?: MutationSource; optimistic?: boolean } = {}) {
  return useMutation({
    mutationFn: async (data: z.infer<typeof WatchlistCreateSchema>) => {
      const metadata: MutationMetadata = {
        source: options.source || 'watchlist-form',
        timestamp: Date.now(),
        optimistic: options.optimistic !== false
      };

      // Perform optimistic update immediately if enabled
      if (options.optimistic !== false) {
        performOptimisticUpdates('create', data, metadata);
      }

      const response = await pb.from("watchlist").create(data);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to sync with server state
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      
      // If we performed optimistic updates, we should refetch to get the real ID
      if (options.optimistic !== false) {
        const userId = pb.authStore.record?.id;
        if (userId) {
          queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
        }
        queryClient.invalidateQueries({ queryKey: ["watchlist", "community"] });
      }
    },
    onError: (error, variables) => {
      console.error("Failed to create watchlist:", error);
      // Optimistic updates will automatically rollback on error
    },
  });
}

// Update watchlist mutation with optimistic updates
export function useUpdateWatchlistMutation(options: { source?: MutationSource; optimistic?: boolean } = {}) {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<z.infer<typeof WatchlistUpdateSchema>>;
    }) => {
      const metadata: MutationMetadata = {
        source: options.source || 'watchlist-form',
        timestamp: Date.now(),
        optimistic: options.optimistic !== false
      };

      // Perform optimistic update immediately if enabled
      if (options.optimistic !== false) {
        performOptimisticUpdates("update", { id, ...data }, metadata);
      }

      // Only send non-undefined fields to the server
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
      );

      const response = await pb.from("watchlist").update(id, cleanData as any);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist", "details", variables.id] });
    },
    onError: (error, variables) => {
      console.error("Failed to update watchlist:", error);
      // Optimistic updates will automatically rollback on error
    },
  });
}

// Delete watchlist mutation with optimistic updates
export function useDeleteWatchlistMutation(options: { source?: MutationSource; optimistic?: boolean } = {}) {
  return useMutation({
    mutationFn: async (id: string) => {
      const metadata: MutationMetadata = {
        source: options.source || 'my-watchlist-card',
        timestamp: Date.now(),
        optimistic: options.optimistic !== false
      };

      // Perform optimistic update immediately if enabled
      if (options.optimistic !== false) {
        performOptimisticUpdates('delete', { id }, metadata);
      }

      const response = await pb.from("watchlist").delete(id);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
    onError: (error, variables) => {
      console.error("Failed to delete watchlist:", error);
      // Optimistic updates will automatically rollback on error
    },
  });
}

// Add item to watchlist mutation with optimistic updates
export function useAddItemToWatchlistMutation(options: {
   source?: MutationSource; optimistic?: boolean } = {}) {
  return useMutation({
    mutationFn: async ({ 
      watchlistId, 
      itemId 
    }: { 
      watchlistId: string; 
      itemId: string 
    }) => {
      const metadata: MutationMetadata = {
        source: options.source || 'discover-card',
        timestamp: Date.now(),
        optimistic: options.optimistic !== false
      };

      // Perform optimistic update immediately if enabled
      if (options.optimistic !== false) {
        performOptimisticUpdates('add-item', { watchlistId, itemId }, metadata);
      }

      // Get current watchlist to update items array
      const currentWatchlist = await pb.from("watchlist").getOne(watchlistId);
      const updatedItems = [...(currentWatchlist.items || [])];
      
      if (!updatedItems.includes(itemId)) {
        updatedItems.push(itemId);
      }

      const response = await pb.from("watchlist").update(watchlistId, {
        items: updatedItems,
      } as any);
      
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist", "details", variables.watchlistId] });
    },
    onError: (error, variables) => {
      console.error("Failed to add item to watchlist:", error);
      // Optimistic updates will automatically rollback on error
    },
  });
}

// Remove item from watchlist mutation with optimistic updates
export function useRemoveItemFromWatchlistMutation(options: { source?: MutationSource; optimistic?: boolean } = {}) {
  return useMutation({
    mutationFn: async ({ 
      watchlistId, 
      itemId 
    }: { 
      watchlistId: string; 
      itemId: string 
    }) => {
      const metadata: MutationMetadata = {
        source: options.source || 'discover-card',
        timestamp: Date.now(),
        optimistic: options.optimistic !== false
      };

      // Perform optimistic update immediately if enabled
      if (options.optimistic !== false) {
        performOptimisticUpdates('remove-item', { watchlistId, itemId }, metadata);
      }

      // Get current watchlist to update items array
      const currentWatchlist = await pb.from("watchlist").getOne(watchlistId);
      const updatedItems = (currentWatchlist.items || []).filter(id => id !== itemId);

      const response = await pb.from("watchlist").update(watchlistId, {
        items: updatedItems,
      } as any);
      
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist", "details", variables.watchlistId] });
    },
    onError: (error, variables) => {
      console.error("Failed to remove item from watchlist:", error);
      // Optimistic updates will automatically rollback on error
    },
  });
}

