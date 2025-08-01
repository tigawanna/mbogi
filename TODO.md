Implement optimistic mutations 
# TODO: TanStack DB Optimistic Mutations and Architecture

This document outlines the plan for refactoring our watchlist feature to fully leverage TanStack DB's optimistic mutations and live queries.

## 1. Understanding TanStack DB Concepts

- **Collections**: These are our primary data stores on the client. We will have collections for "my watchlists" and "community watchlists". Data is loaded into these collections via TanStack Query.
- **Live Queries**: We will use the `useLiveQuery` hook to read data from our collections. This ensures that our UI automatically updates whenever the underlying data in the collection changes, without needing manual refetching.
- **Optimistic Mutations**: When a user performs an action (e.g., adding a movie to a watchlist), the change will be applied *optimistically* to the local collection first. This provides an instant UI update. In the background, a handler (`onInsert`, `onUpdate`, `onDelete`) will be called to make the actual API request. If the API request fails, TanStack DB will automatically roll back the optimistic update.

## 2. Game Plan for Implementation

### Step 1: Standardize Collections and Query Keys

- **DONE**: We have already refactored our collections to `myWatchlistsCollection` and `communityWatchlistsCollection`.
- **DONE**: Query keys are now hierarchical and non-colliding.

### Step 2: Implement Optimistic Mutations

We will implement `onInsert`, `onUpdate`, and `onDelete` handlers for our watchlist collections.

**Example `onUpdate` handler:**

```typescript
// src/data/watchlist/my-watchlist.ts

// ...
onUpdate: async ({ transaction }) => {
  const { original, modified, changes } = transaction.mutations[0];
  // 'original' is the state before the update
  // 'modified' is the full object after the update
  // 'changes' is just the fields that were changed

  // Here we would call our actual API to update the watchlist
  // For example:
  // await pocketbase.collection('watchlists').update(original.id, changes);

  // If the API call throws an error, TanStack DB will automatically
  // roll back the optimistic update.
},
// ...
```

### Step 3: Mutation Source Annotation

To correctly update our caches and UI, we need to know *where* a mutation was triggered from. For example, adding a movie from a "Discover" screen card should behave differently than adding it from within a specific watchlist screen.

**Strategy:** We will pass a `source` metadata property with our mutations.

**Example of an annotated mutation:**

```typescript
// In a component, e.g., a Discover movie card
myWatchlistsCollection.update(
  watchlistId,
  (draft) => {
    draft.items.push(newItem);
  },
  {
    metadata: {
      source: 'discover-card',
      itemId: newItem.id
    }
  }
);
```

The `onUpdate` handler can then access this metadata:

```typescript
// src/data/watchlist/my-watchlist.ts
onUpdate: async ({ transaction }) => {
  const { metadata } = transaction.mutations[0];
  if (metadata?.source === 'discover-card') {
    // Special logic for this source
  }
  // ...
},
```

### Step 4: Handling Cross-Collection Updates

When an action in one part of the app affects data that might be present in multiple collections, we need to update all of them.

**Example Scenario:** A user adds a movie to their "Favorites" watchlist from the Discover screen. This movie might also be in a community watchlist that the user is viewing.

**Solution:**
The mutation will be triggered on `myWatchlistsCollection`. The `onUpdate` handler for `myWatchlistsCollection` will be responsible for the API call. After a successful API call, we need a way to invalidate or update the `communityWatchlistsCollection`.

Since TanStack DB collections used with `queryCollectionOptions` are powered by TanStack Query, we can use the `queryClient` to invalidate queries associated with the community watchlist.

```typescript
// In the onUpdate handler of myWatchlistsCollection, after a successful API call
import { queryClient } from '@/lib/tanstack/query/client';

// ... after successful API update
queryClient.invalidateQueries({ queryKey: ['watchlist', 'community'] });
```
This will cause any active `useLiveQuery` hooks for community watchlists to get the latest data.

## 3. Best Practices and Reference

- **Keep Handlers Lean**: The `on...` handlers should primarily be responsible for making the API call. Complex logic should be abstracted elsewhere.
- **Hierarchical Query Keys**: Continue using descriptive and hierarchical query keys to make invalidation precise.
- **Metadata is Key**: Use the `metadata` option for passing contextual information to mutation handlers.
- **Refer to Docs**: For more advanced scenarios, always refer to the official [TanStack DB Documentation](https://tanstack.com/db/latest/docs/overview).

This plan will be our guide to ensure a consistent, robust, and highly responsive watchlist feature.
