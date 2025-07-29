/**
 * @fileoverview Discover Query Collections - Index
 * 
 * This file exports all the query collections and types for TMDB discover functionality.
 * It provides a centralized location for importing discover-related collections and types.
 */

// Export all collection functions
export {
  discoverMoviesCollection,
  discoverTVCollection,
  // Popular/Trending collections
  popularMoviesCollection,
  topRatedMoviesCollection,
  nowPlayingMoviesCollection,
  popularTVCollection,
  topRatedTVCollection,
  airingTodayTVCollection,
  // Genre-based collections
  moviesByGenreCollection,
  tvShowsByGenreCollection,
} from './discover-query-collection';

// Export all types and interfaces
export type {
  DiscoverMoviesFilters,
  DiscoverTVFilters,
  DiscoverMoviesCollectionProps,
  DiscoverTVCollectionProps,
} from './discover-query-collection';

// Re-export relevant schema types for convenience
export type {
  TMDBMovie,
  TMDBTVShow,
  TMDBDiscoverMoviesResponse,
  TMDBDiscoverTVResponse,
  Genre,
  TMDBBaseResponse,
} from './discover-zod-schema';
