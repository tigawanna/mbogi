# TMDB SDK Documentation

A comprehensive TypeScript SDK for interacting with TMDB (The Movie Database) API through PocketBase custom routes.

## Table of Contents

- [Installation & Setup](#installation--setup)
- [Quick Start](#quick-start)
- [API Methods](#api-methods)
- [TypeScript Types](#typescript-types)
- [Examples](#examples)
- [Error Handling](#error-handling)

## Installation & Setup

### Prerequisites

- PocketBase server with TMDB custom routes configured
- TMDB API key stored in PocketBase `secrets` collection
- PocketBase client library

### Basic Setup

```typescript
import PocketBase from 'pocketbase';
import { createTMDBSDK, TMDBSDK } from './sdk/pb';

// Initialize PocketBase client
const pb = new PocketBase('http://localhost:8090');

// Create TMDB SDK instance
const tmdb = createTMDBSDK(pb);

// Or create directly
const tmdbDirect = new TMDBSDK(pb);
```

## Quick Start

```typescript
// Search for movies and TV shows
const searchResults = await tmdb.search({ query: 'The Matrix' });

// Discover popular movies
const popularMovies = await tmdb.discoverMovies({ 
  sort_by: 'popularity.desc',
  page: 1 
});

// Get movie details
const movieDetails = await tmdb.getMovieDetails(550); // Fight Club

// Discover TV shows by genre
const sciFiShows = await tmdb.discoverTV({ 
  with_genres: '10765', // Sci-Fi & Fantasy
  sort_by: 'vote_average.desc'
});
```

## API Methods

### 1. Discover Movies

**Method:** `discoverMovies(params?: DiscoverMoviesParams)`

Discover movies with various filtering and sorting options.

#### Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `sort_by` | `string` | Sort results by field | `'popularity.desc'`, `'vote_average.desc'` |
| `page` | `number` | Page number (default: 1) | `1`, `2`, `3` |
| `with_genres` | `string` | Comma-separated genre IDs | `'28,12'` (Action, Adventure) |
| `year` | `string` | Release year | `'2023'` |
| `primary_release_year` | `string` | Primary release year | `'2023'` |
| `vote_average.gte` | `number` | Minimum vote average | `7.0` |
| `vote_count.gte` | `number` | Minimum vote count | `100` |
| `with_cast` | `string` | Comma-separated person IDs | `'500,6193'` |
| `with_crew` | `string` | Comma-separated person IDs | `'525,578'` |
| `with_companies` | `string` | Comma-separated company IDs | `'420'` (Marvel Studios) |
| `with_keywords` | `string` | Comma-separated keyword IDs | `'9715,1701'` |
| `include_adult` | `boolean` | Include adult content | `false` |
| `language` | `string` | Language code | `'en-US'`, `'es-ES'` |
| `region` | `string` | Region code | `'US'`, `'GB'` |

#### Example

```typescript
const movies = await tmdb.discoverMovies({
  with_genres: '28,12', // Action, Adventure
  year: '2023',
  'vote_average.gte': 7.0,
  sort_by: 'popularity.desc',
  page: 1
});

console.log(`Found ${movies.total_results} movies`);
movies.results.forEach(movie => {
  console.log(`${movie.title} (${movie.release_date})`);
});
```

### 2. Discover TV Shows

**Method:** `discoverTV(params?: DiscoverTVParams)`

Discover TV shows with various filtering and sorting options.

#### Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `sort_by` | `string` | Sort results by field | `'popularity.desc'`, `'first_air_date.desc'` |
| `page` | `number` | Page number (default: 1) | `1`, `2`, `3` |
| `with_genres` | `string` | Comma-separated genre IDs | `'18,10765'` (Drama, Sci-Fi) |
| `first_air_date_year` | `string` | First air date year | `'2023'` |
| `vote_average.gte` | `number` | Minimum vote average | `8.0` |
| `with_networks` | `string` | Comma-separated network IDs | `'213'` (Netflix) |
| `with_companies` | `string` | Comma-separated company IDs | `'1957'` (HBO) |
| `language` | `string` | Language code | `'en-US'` |

#### Example

```typescript
const tvShows = await tmdb.discoverTV({
  with_genres: '18,10765', // Drama, Sci-Fi & Fantasy
  first_air_date_year: '2023',
  with_networks: '213', // Netflix
  'vote_average.gte': 8.0,
  sort_by: 'vote_average.desc'
});

tvShows.results.forEach(show => {
  console.log(`${show.name} - Rating: ${show.vote_average}`);
});
```

### 3. Search

**Method:** `search(params: SearchParams)`

Search for movies, TV shows, and people across TMDB database.

#### Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `query` | `string` | ✅ | Search query string | `'The Matrix'` |
| `page` | `number` | ❌ | Page number (default: 1) | `1` |
| `include_adult` | `boolean` | ❌ | Include adult content (default: false) | `false` |
| `language` | `string` | ❌ | Language code (default: 'en-US') | `'en-US'` |
| `region` | `string` | ❌ | Region code | `'US'` |

#### Example

```typescript
const results = await tmdb.search({
  query: 'Christopher Nolan',
  page: 1,
  include_adult: false
});

results.results.forEach(result => {
  if (result.media_type === 'movie') {
    console.log(`Movie: ${result.title}`);
  } else if (result.media_type === 'tv') {
    console.log(`TV Show: ${result.name}`);
  } else if (result.media_type === 'person') {
    console.log(`Person: ${result.name}`);
  }
});
```

### 4. Get Movie Details

**Method:** `getMovieDetails(id: number, params?: DetailsParams)`

Get detailed information about a specific movie.

#### Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | `number` | ✅ | TMDB movie ID | `550` |
| `language` | `string` | ❌ | Language code (default: 'en-US') | `'en-US'` |
| `append_to_response` | `string` | ❌ | Additional data to include | `'credits,videos,images'` |

#### Example

```typescript
const movie = await tmdb.getMovieDetails(550, {
  append_to_response: 'credits,videos,images'
});

console.log(`Title: ${movie.title}`);
console.log(`Runtime: ${movie.runtime} minutes`);
console.log(`Budget: $${movie.budget.toLocaleString()}`);
console.log(`Revenue: $${movie.revenue.toLocaleString()}`);
console.log(`Genres: ${movie.genres.map(g => g.name).join(', ')}`);
```

### 5. Get TV Show Details

**Method:** `getTVDetails(id: number, params?: DetailsParams)`

Get detailed information about a specific TV show.

#### Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | `number` | ✅ | TMDB TV show ID | `1399` |
| `language` | `string` | ❌ | Language code (default: 'en-US') | `'en-US'` |
| `append_to_response` | `string` | ❌ | Additional data to include | `'credits,videos,images'` |

#### Example

```typescript
const tvShow = await tmdb.getTVDetails(1399, {
  append_to_response: 'credits,videos'
});

console.log(`Name: ${tvShow.name}`);
console.log(`Seasons: ${tvShow.number_of_seasons}`);
console.log(`Episodes: ${tvShow.number_of_episodes}`);
console.log(`Status: ${tvShow.status}`);
console.log(`Networks: ${tvShow.networks.map(n => n.name).join(', ')}`);
```

### 6. Generic Get Details

**Method:** `getDetails(type: 'movie' | 'tv', id: number, params?: DetailsParams)`

Generic method to get details for either movies or TV shows.

#### Example

```typescript
// Get movie details
const movie = await tmdb.getDetails('movie', 550);

// Get TV show details
const tvShow = await tmdb.getDetails('tv', 1399);
```

## TypeScript Types

### Response Types

```typescript
// Base response structure
interface TMDBBaseResponse {
  page: number;
  total_results: number;
  total_pages: number;
}

// Movie object
interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
}

// TV Show object
interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

// Person object
interface TMDBPerson {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
  known_for: (TMDBMovie | TMDBTVShow)[];
}
```

### Parameter Types

```typescript
// Discover Movies parameters
interface DiscoverMoviesParams {
  sort_by?: string;
  page?: number;
  with_genres?: string;
  year?: string;
  primary_release_year?: string;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  // ... more parameters
}

// Search parameters
interface SearchParams {
  query: string;
  page?: number;
  include_adult?: boolean;
  language?: string;
  region?: string;
}

// Details parameters
interface DetailsParams {
  language?: string;
  append_to_response?: string;
}
```

## Utility Functions

### Type Guards

Use these functions to safely check the type of search results:

```typescript
import { isMovie, isTVShow, isPerson } from './sdk/pb';

const results = await tmdb.search({ query: 'Marvel' });

results.results.forEach(result => {
  if (isMovie(result)) {
    console.log(`Movie: ${result.title} (${result.release_date})`);
  } else if (isTVShow(result)) {
    console.log(`TV Show: ${result.name} (${result.first_air_date})`);
  } else if (isPerson(result)) {
    console.log(`Person: ${result.name} (${result.known_for_department})`);
  }
});
```

## Error Handling

The SDK throws standard JavaScript errors that you should handle appropriately:

```typescript
try {
  const movie = await tmdb.getMovieDetails(999999); // Non-existent ID
} catch (error) {
  if (error.message.includes('not found')) {
    console.log('Movie not found');
  } else {
    console.error('API Error:', error.message);
  }
}

try {
  const results = await tmdb.search({ query: '' }); // Empty query
} catch (error) {
  console.error('Search Error:', error.message); // "Search query is required"
}
```

## Common Use Cases

### 1. Building a Movie Recommendation System

```typescript
// Get popular movies from specific genres
const actionMovies = await tmdb.discoverMovies({
  with_genres: '28', // Action
  'vote_average.gte': 7.0,
  'vote_count.gte': 1000,
  sort_by: 'popularity.desc',
  page: 1
});

// Get similar movies by checking production companies
const marvelMovies = await tmdb.discoverMovies({
  with_companies: '420', // Marvel Studios
  sort_by: 'release_date.desc'
});
```

### 2. Creating a Search Interface

```typescript
async function searchContent(query: string) {
  const results = await tmdb.search({ query });
  
  const movies = results.results.filter(isMovie);
  const tvShows = results.results.filter(isTVShow);
  const people = results.results.filter(isPerson);
  
  return { movies, tvShows, people };
}
```

### 3. Building a Watchlist Feature

```typescript
async function getContentDetails(type: 'movie' | 'tv', id: number) {
  const details = await tmdb.getDetails(type, id, {
    append_to_response: 'credits,videos,images'
  });
  
  return {
    ...details,
    type,
    // Add custom fields for your watchlist
    addedAt: new Date(),
    watched: false
  };
}
```

## Rate Limiting & Best Practices

1. **Respect API Limits**: TMDB has rate limits, so implement appropriate delays between requests
2. **Cache Results**: Cache frequently accessed data to reduce API calls
3. **Error Handling**: Always wrap API calls in try-catch blocks
4. **Type Safety**: Use the provided TypeScript types for better development experience
5. **Parameter Validation**: The SDK validates required parameters, but additional validation is recommended

## Support

For issues related to:
- **SDK functionality**: Check this documentation and examples
- **TMDB API**: Refer to [TMDB API Documentation](https://developer.themoviedb.org/docs)
- **PocketBase**: Refer to [PocketBase Documentation](https://pocketbase.io/docs/)

---

*This SDK provides a type-safe, easy-to-use interface for accessing TMDB data through your PocketBase backend.*
## TMDB 
Image Handling

TMDB API returns image paths (like `/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg`) that need to be converted to full URLs for display.

### Image URL Structure

```
https://image.tmdb.org/t/p/{size}/{image_path}
```

### Available Image Sizes

#### Poster Images
- `w92` - 92px width (tiny thumbnail)
- `w154` - 154px width (small thumbnail)
- `w185` - 185px width (thumbnail)
- `w342` - 342px width (small)
- `w500` - 500px width (medium)
- `w780` - 780px width (large)
- `original` - Full resolution

#### Backdrop Images
- `w300` - 300px width (small)
- `w780` - 780px width (medium)
- `w1280` - 1280px width (large)
- `original` - Full resolution

#### Profile Images (People)
- `w45` - 45px width (tiny)
- `w185` - 185px width (medium)
- `h632` - 632px height (large)
- `original` - Full resolution

### SDK Image Utilities

The SDK provides several utility functions for handling images:

#### Basic Image URL Building

```typescript
import { buildTMDBImageUrl } from './sdk/pb';

// Basic usage
const posterUrl = buildTMDBImageUrl('/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg', 'w500');
// Returns: "https://image.tmdb.org/t/p/w500/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg"

// Original quality
const originalUrl = buildTMDBImageUrl('/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg', 'original');
// Returns: "https://image.tmdb.org/t/p/original/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg"

// Handles null paths safely
const safeUrl = buildTMDBImageUrl(null, 'w500');
// Returns: null
```

#### Optimized Image URLs

```typescript
import { getOptimizedImageUrl } from './sdk/pb';

// Get optimized poster URLs
const thumbnailUrl = getOptimizedImageUrl('/poster.jpg', 'poster', 'thumbnail'); // w185
const mediumUrl = getOptimizedImageUrl('/poster.jpg', 'poster', 'medium');    // w500
const largeUrl = getOptimizedImageUrl('/poster.jpg', 'poster', 'large');      // w780

// Get optimized backdrop URLs
const backdropSmall = getOptimizedImageUrl('/backdrop.jpg', 'backdrop', 'small');  // w300
const backdropLarge = getOptimizedImageUrl('/backdrop.jpg', 'backdrop', 'large');  // w1280

// Get optimized profile URLs
const profileSmall = getOptimizedImageUrl('/profile.jpg', 'profile', 'small');   // w45
const profileLarge = getOptimizedImageUrl('/profile.jpg', 'profile', 'large');   // h632
```

#### Multiple Image URLs

```typescript
import { buildTMDBImageUrls } from './sdk/pb';

// Generate multiple sizes for responsive images
const urls = buildTMDBImageUrls('/poster.jpg', ['w300', 'w500', 'w780']);
// Returns: {
//   w300: "https://image.tmdb.org/t/p/w300/poster.jpg",
//   w500: "https://image.tmdb.org/t/p/w500/poster.jpg",
//   w780: "https://image.tmdb.org/t/p/w780/poster.jpg"
// }
```

#### Responsive Images (srcset)

```typescript
import { generateImageSrcSet } from './sdk/pb';

// Generate srcset for responsive images
const srcset = generateImageSrcSet('/poster.jpg', 'poster');
// Returns: "https://image.tmdb.org/t/p/w185/poster.jpg 185w, https://image.tmdb.org/t/p/w342/poster.jpg 342w, https://image.tmdb.org/t/p/w500/poster.jpg 500w, https://image.tmdb.org/t/p/w780/poster.jpg 780w"
```

### Practical Examples

#### React Component Example

```typescript
import React from 'react';
import { buildTMDBImageUrl, generateImageSrcSet } from './sdk/pb';

interface MoviePosterProps {
  movie: TMDBMovie;
  size?: 'small' | 'medium' | 'large';
}

const MoviePoster: React.FC<MoviePosterProps> = ({ movie, size = 'medium' }) => {
  const sizeMap = {
    small: 'w342',
    medium: 'w500',
    large: 'w780'
  };

  const posterUrl = buildTMDBImageUrl(movie.poster_path, sizeMap[size]);
  const srcset = generateImageSrcSet(movie.poster_path, 'poster');

  if (!posterUrl) {
    return <div className="poster-placeholder">No Image</div>;
  }

  return (
    <img
      src={posterUrl}
      srcSet={srcset}
      sizes="(max-width: 768px) 185px, (max-width: 1024px) 342px, 500px"
      alt={movie.title}
      loading="lazy"
    />
  );
};
```

#### Vue Component Example

```vue
<template>
  <div class="movie-card">
    <img
      v-if="posterUrl"
      :src="posterUrl"
      :srcset="srcset"
      :alt="movie.title"
      sizes="(max-width: 768px) 185px, (max-width: 1024px) 342px, 500px"
      loading="lazy"
    />
    <div v-else class="poster-placeholder">
      No Image Available
    </div>
    
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.overview }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buildTMDBImageUrl, generateImageSrcSet, type TMDBMovie } from './sdk/pb';

interface Props {
  movie: TMDBMovie;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
});

const sizeMap = {
  small: 'w342',
  medium: 'w500',
  large: 'w780'
};

const posterUrl = computed(() => 
  buildTMDBImageUrl(props.movie.poster_path, sizeMap[props.size])
);

const srcset = computed(() => 
  generateImageSrcSet(props.movie.poster_path, 'poster')
);
</script>
```

#### Processing API Response

```typescript
// Process discover movies response with image URLs
const processMoviesResponse = async () => {
  const response = await tmdb.discoverMovies({ with_genres: '28' });
  
  const moviesWithImages = response.results.map(movie => ({
    ...movie,
    images: {
      poster: {
        thumbnail: buildTMDBImageUrl(movie.poster_path, 'w185'),
        small: buildTMDBImageUrl(movie.poster_path, 'w342'),
        medium: buildTMDBImageUrl(movie.poster_path, 'w500'),
        large: buildTMDBImageUrl(movie.poster_path, 'w780'),
        original: buildTMDBImageUrl(movie.poster_path, 'original')
      },
      backdrop: {
        small: buildTMDBImageUrl(movie.backdrop_path, 'w300'),
        medium: buildTMDBImageUrl(movie.backdrop_path, 'w780'),
        large: buildTMDBImageUrl(movie.backdrop_path, 'w1280'),
        original: buildTMDBImageUrl(movie.backdrop_path, 'original')
      }
    }
  }));
  
  return moviesWithImages;
};
```

### Image Size Recommendations

#### Use Cases and Recommended Sizes

| Use Case | Image Type | Recommended Size | Alternative |
|----------|------------|------------------|-------------|
| Movie grid/list thumbnails | Poster | `w185` | `w154` |
| Movie cards | Poster | `w342` | `w500` |
| Movie detail page | Poster | `w500` | `w780` |
| Hero/banner images | Backdrop | `w1280` | `original` |
| Mobile thumbnails | Poster | `w154` | `w185` |
| Profile pictures | Profile | `w185` | `h632` |
| High-DPI displays | Any | `original` | Next size up |

#### Performance Considerations

```typescript
// Good: Use appropriate sizes for context
const thumbnailUrl = buildTMDBImageUrl(movie.poster_path, 'w185'); // For grid view
const detailUrl = buildTMDBImageUrl(movie.poster_path, 'w500');    // For detail view

// Avoid: Using original for thumbnails (unnecessary bandwidth)
const inefficientUrl = buildTMDBImageUrl(movie.poster_path, 'original'); // Too large for thumbnails

// Good: Responsive images with srcset
const responsiveImage = (
  <img
    src={buildTMDBImageUrl(movie.poster_path, 'w500')}
    srcSet={generateImageSrcSet(movie.poster_path, 'poster')}
    sizes="(max-width: 768px) 185px, (max-width: 1024px) 342px, 500px"
    alt={movie.title}
  />
);
```

### Error Handling for Images

```typescript
// Handle missing images gracefully
const getImageWithFallback = (imagePath: string | null, size: string = 'w500') => {
  const imageUrl = buildTMDBImageUrl(imagePath, size);
  
  if (!imageUrl) {
    return '/path/to/placeholder-image.jpg'; // Your fallback image
  }
  
  return imageUrl;
};

// React component with error handling
const SafeImage: React.FC<{ src: string | null; alt: string }> = ({ src, alt }) => {
  const [error, setError] = useState(false);
  
  const imageUrl = buildTMDBImageUrl(src, 'w500');
  
  if (!imageUrl || error) {
    return <div className="image-placeholder">{alt}</div>;
  }
  
  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};
```

### Sample Response with Image Processing

Based on your sample response, here's how to process the images:

```typescript
// Sample TV show from your response
const tvShow = {
  "adult": false,
  "backdrop_path": "/sKlF9YrVu84DYMDAUZEZDCvDxK2.jpg",
  "first_air_date": "2025-07-19",
  "genre_ids": [16, 35, 18, 10765],
  "id": 244808,
  "name": "Nukitashi the Animation",
  "poster_path": "/zlybZJXfu4IpPnWXhnRtobl9BgZ.jpg",
  // ... other fields
};

// Process images
const processedShow = {
  ...tvShow,
  images: {
    poster: {
      thumbnail: buildTMDBImageUrl(tvShow.poster_path, 'w185'),
      // "https://image.tmdb.org/t/p/w185/zlybZJXfu4IpPnWXhnRtobl9BgZ.jpg"
      
      medium: buildTMDBImageUrl(tvShow.poster_path, 'w500'),
      // "https://image.tmdb.org/t/p/w500/zlybZJXfu4IpPnWXhnRtobl9BgZ.jpg"
      
      large: buildTMDBImageUrl(tvShow.poster_path, 'w780'),
      // "https://image.tmdb.org/t/p/w780/zlybZJXfu4IpPnWXhnRtobl9BgZ.jpg"
    },
    backdrop: {
      medium: buildTMDBImageUrl(tvShow.backdrop_path, 'w780'),
      // "https://image.tmdb.org/t/p/w780/sKlF9YrVu84DYMDAUZEZDCvDxK2.jpg"
      
      large: buildTMDBImageUrl(tvShow.backdrop_path, 'w1280'),
      // "https://image.tmdb.org/t/p/w1280/sKlF9YrVu84DYMDAUZEZDCvDxK2.jpg"
    }
  }
};
```

This comprehensive image handling system ensures you can efficiently display TMDB images at the right size for any use case while maintaining good performance and user experience.