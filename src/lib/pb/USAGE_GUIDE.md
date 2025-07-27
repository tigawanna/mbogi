# Movie Social App - PocketBase Integration Guide

## Overview

This movie social app uses PocketBase as the backend with a typed client for full type safety. The app includes several collections that work together to create a comprehensive social movie/TV show tracking experience.

## Collections Overview

### 1. **Users** (`users`)
- **Purpose**: Authentication and user profiles
- **Key Features**: OAuth (Google, Trakt), profile management, Trakt API integration
- **Relations**: Referenced by all other collections as owners/authors

### 2. **Watchlists** (`watchlists`)
- **Purpose**: User-created lists of movies/TV shows
- **Key Features**: Public/private visibility, categories, cover images, tags
- **Relations**: 
  - Owned by users
  - Contains watchlist items
  - Can be liked, shared, and commented on

### 3. **Watchlist Items** (`watchlistItems`)
- **Purpose**: Individual movies/TV shows within watchlists
- **Key Features**: Trakt/TMDB/IMDB integration, personal notes, ratings, status tracking
- **Relations**: Belongs to watchlists

### 4. **User Follows** (`userFollows`)
- **Purpose**: Social following system between users
- **Key Features**: Follow/unfollow, prevent self-following
- **Relations**: Links users to users

### 5. **Watchlist Likes** (`watchlistLikes`)
- **Purpose**: Users can like/favorite watchlists
- **Key Features**: Prevents liking own watchlists
- **Relations**: Links users to watchlists

### 6. **Watchlist Shares** (`watchlistShares`)
- **Purpose**: Share watchlists with specific users
- **Key Features**: View/edit permissions, access control
- **Relations**: Links users to watchlists with permissions

### 7. **Watchlist Comments** (`watchlistComments`)
- **Purpose**: Comments and discussions on watchlists
- **Key Features**: Threaded comments (replies), rich text
- **Relations**: Links users to watchlists, supports comment threading

## Typed PocketBase Usage

### Basic Syntax
```typescript
import { pb } from '@/lib/pb/client';
import { eq, and, or } from '@tigawanna/typed-pocketbase';

// List with filtering
const result = await pb.from('watchlists').getList({
  page: 1,
  perPage: 20,
  filter: and(
    eq('isPublic', true),
    ['owner', '=', userId]
  ),
  sort: ['-created'],
  select: {
    id: true,
    title: true,
    isPublic: true,
    expand: {
      owner: {
        name: true,
        avatar: true
      }
    }
  }
});

// Get single record
const watchlist = await pb.from('watchlists').getOne(id, {
  select: {
    expand: {
      watchlistItems_via_watchlist: true,
      watchlistLikes_via_watchlist: true
    }
  }
});
```

### Key Features
- **Type Safety**: Full TypeScript support with generated types
- **Smart Filtering**: Helper functions for complex queries
- **Selective Fields**: Choose exactly which fields to return
- **Automatic Expansion**: Type-safe relation expansion
- **Query Builders**: Helper methods for common patterns

### Access Control
All collections have sophisticated API rules that automatically handle:
- **Privacy**: Public/private watchlist visibility
- **Ownership**: Users can only modify their own content
- **Sharing**: Shared watchlists respect view/edit permissions
- **Authentication**: All operations require valid user authentication

## Query Organization

Queries are organized into logical groups:
- **Watchlist Operations**: CRUD for watchlists
- **Content Operations**: Managing items within watchlists
- **Social Operations**: Follows, likes, comments
- **Sharing Operations**: Watchlist sharing and permissions

## Best Practices

1. **Always use expand** when you need related data to avoid N+1 queries
2. **Use selective fields** to minimize data transfer
3. **Leverage query keys** for proper cache invalidation
4. **Handle permissions** - the API rules will enforce access but handle errors gracefully
5. **Use filters efficiently** - combine with indexes for better performance

## Example Usage Patterns

### Get User's Dashboard Data
```typescript
// Get user's watchlists with counts
const userWatchlists = await pb.from('watchlists').getList({
  filter: eq('owner', userId),
  select: {
    id: true,
    title: true,
    isPublic: true,
    expand: {
      watchlistItems_via_watchlist: { 
        id: true // Just count
      },
      watchlistLikes_via_watchlist: {
        id: true // Just count
      }
    }
  }
});
```

### Get Public Feed
```typescript
// Get public watchlists with full details
const publicFeed = await pb.from('watchlists').getList({
  filter: eq('isPublic', true),
  sort: ['-created'],
  select: {
    expand: {
      owner: {
        name: true,
        avatar: true
      },
      watchlistItems_via_watchlist: {
        title: true,
        mediaType: true
      }
    }
  }
});
```

This architecture provides a robust, type-safe foundation for building a feature-rich movie social application.
