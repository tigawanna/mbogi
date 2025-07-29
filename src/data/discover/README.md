# TMDB Discover Query Collections

This module provides TanStack DB query collections for discovering movies and TV shows using the TMDB API. These collections are designed to work with `useLiveQuery` in React components and provide efficient, reactive data management.

## Features

- ✅ **Type-safe**: Full TypeScript support with centralized type definitions
- ✅ **Reactive**: Live queries that update automatically when filters change
- ✅ **Filtered**: Support for all TMDB discover API filters
- ✅ **Pre-configured**: Common use cases like popular movies, top rated, etc.
- ✅ **Validated**: Zod schema validation for all API responses
- ✅ **Cached**: Built-in caching and deduplication via TanStack Query

## Basic Usage

### Discover Movies

```typescript
import { useLiveQuery } from '@tanstack/react-db';
import { discoverMoviesCollection } from '@/data/discover';

function MoviesScreen() {
  const { data: movies, isLoading } = useLiveQuery(
    (query) =>
      query.from({
        movies: discoverMoviesCollection({
          filters: {
            with_genres: '28,12', // Action, Adventure
            year: '2023',
            'vote_average.gte': 7.0,
            page: 1
          }
        })
      }),
    []
  );

  if (isLoading) return <LoadingSpinner />;
  
  return (
    <FlatList
      data={movies}
      renderItem={({ item }) => <MovieCard movie={item} />}
    />
  );
}
```

### Discover TV Shows

```typescript
import { useLiveQuery } from '@tanstack/react-db';
import { discoverTVCollection } from '@/data/discover';

function TVShowsScreen() {
  const { data: tvShows } = useLiveQuery(
    (query) =>
      query.from({
        tvShows: discoverTVCollection({
          filters: {
            with_genres: '18,10765', // Drama, Sci-Fi & Fantasy
            first_air_date_year: '2023',
            with_networks: '213', // Netflix
            page: 1
          }
        })
      }),
    []
  );

  return (
    <FlatList
      data={tvShows}
      renderItem={({ item }) => <TVShowCard show={item} />}
    />
  );
}
```

## Pre-configured Collections

For common use cases, use the pre-configured collections:

```typescript
import { 
  popularMoviesCollection,
  topRatedMoviesCollection,
  nowPlayingMoviesCollection,
  popularTVCollection,
  topRatedTVCollection,
  airingTodayTVCollection
} from '@/data/discover';

// Popular movies
const { data: popularMovies } = useLiveQuery(
  (query) => query.from({ movies: popularMoviesCollection(1) }),
  []
);

// Top rated TV shows
const { data: topRatedTV } = useLiveQuery(
  (query) => query.from({ tvShows: topRatedTVCollection(1) }),
  []
);
```

## Genre-based Collections

```typescript
import { moviesByGenreCollection, tvShowsByGenreCollection } from '@/data/discover';

// Action and Adventure movies
const { data: actionMovies } = useLiveQuery(
  (query) => query.from({ 
    movies: moviesByGenreCollection([28, 12], 1) // Action, Adventure
  }),
  []
);

// Drama TV shows
const { data: dramaTVShows } = useLiveQuery(
  (query) => query.from({ 
    tvShows: tvShowsByGenreCollection([18], 1) // Drama
  }),
  []
);
```

## Advanced Filtering

### Movie Filters

```typescript
const advancedMovieFilters: DiscoverMoviesFilters = {
  sort_by: 'popularity.desc',
  page: 1,
  with_genres: '28,12', // Action, Adventure
  year: '2023',
  primary_release_year: '2023',
  'vote_average.gte': 7.0,
  'vote_count.gte': 1000,
  with_cast: '3223,31', // Robert Downey Jr., Tom Hanks
  with_crew: '1081', // James Cameron
  with_companies: '420', // Marvel Studios
  with_keywords: '9715', // Superhero
  include_adult: false,
  include_video: false,
  language: 'en-US',
  region: 'US',
  'release_date.gte': '2023-01-01',
  'release_date.lte': '2023-12-31',
  with_original_language: 'en',
  without_genres: '27', // Exclude Horror
  'with_runtime.gte': 90,
  'with_runtime.lte': 180
};
```

### TV Show Filters

```typescript
const advancedTVFilters: DiscoverTVFilters = {
  sort_by: 'vote_average.desc',
  page: 1,
  with_genres: '18,10765', // Drama, Sci-Fi & Fantasy
  first_air_date_year: '2023',
  'vote_average.gte': 8.0,
  'vote_count.gte': 500,
  with_networks: '213,1024', // Netflix, Amazon Prime
  with_companies: '1957', // Warner Bros
  with_keywords: '6075', // Space
  language: 'en-US',
  timezone: 'America/New_York',
  'first_air_date.gte': '2023-01-01',
  'first_air_date.lte': '2023-12-31',
  with_original_language: 'en',
  without_genres: '27', // Exclude Horror
  screened_theatrically: false,
  with_status: '2', // Returning Series
  with_type: '2' // Scripted
};
```

## Combining with Live Queries

You can combine multiple collections and apply additional filtering:

```typescript
import { ilike, eq } from '@tanstack/db';
import { discoverMoviesCollection, discoverTVCollection } from '@/data/discover';

function SearchableContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: allContent } = useLiveQuery(
    (query) => {
      const moviesQuery = query.from({
        movies: discoverMoviesCollection({
          filters: { 'vote_average.gte': 7.0 }
        })
      }).select(({ movies }) => ({
        id: movies.id,
        title: movies.title,
        type: 'movie' as const,
        poster_path: movies.poster_path,
        vote_average: movies.vote_average
      }));

      const tvQuery = query.from({
        tv: discoverTVCollection({
          filters: { 'vote_average.gte': 7.0 }
        })
      }).select(({ tv }) => ({
        id: tv.id,
        title: tv.name,
        type: 'tv' as const,
        poster_path: tv.poster_path,
        vote_average: tv.vote_average
      }));

      // Union both queries and filter by search term
      return query.union(moviesQuery, tvQuery)
        .where((item) => 
          searchTerm ? ilike(item.title, `%${searchTerm}%`) : true
        );
    },
    [searchTerm]
  );

  return (
    <View>
      <SearchBar onChangeText={setSearchTerm} />
      <FlatList
        data={allContent}
        renderItem={({ item }) => (
          <ContentCard content={item} />
        )}
      />
    </View>
  );
}
```

## Type Definitions

All types are centralized and exported from the main module:

```typescript
import type {
  DiscoverMoviesFilters,
  DiscoverTVFilters,
  DiscoverMoviesCollectionProps,
  DiscoverTVCollectionProps,
  TMDBMovie,
  TMDBTVShow,
  Genre
} from '@/data/discover';
```

## Error Handling

The collections include automatic error handling and validation:

```typescript
const { data, isLoading, isError, error } = useLiveQuery(
  (query) => query.from({ 
    movies: discoverMoviesCollection({ filters: { page: 1 } })
  }),
  []
);

if (isError) {
  console.error('Failed to load movies:', error);
  return <ErrorMessage />;
}
```

## Performance Notes

- Collections are automatically cached and deduplicated
- Use stable filter objects to prevent unnecessary re-fetches
- Consider pagination for large datasets
- Enable/disable collections based on component lifecycle

```typescript
// Good: Stable filter object
const stableFilters = useMemo(() => ({
  with_genres: '28',
  page: currentPage
}), [currentPage]);

// Good: Conditional enabling
const { data } = useLiveQuery(
  (query) => query.from({
    movies: discoverMoviesCollection({
      filters: stableFilters,
      enabled: isVisible // Only fetch when component is visible
    })
  }),
  [stableFilters, isVisible]
);
```
