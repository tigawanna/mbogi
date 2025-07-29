/**
 * @fileoverview Discover Query Collections - Index
 * 
 * This file exports all the query collections and types for TMDB discover functionality.
 * It provides a centralized location for importing discover-related collections and types.
 */

// Export all collection functions
export {
    airingTodayTVCollection, discoverMoviesCollection,
    discoverTVCollection,
    // Genre-based collections
    moviesByGenreCollection, nowPlayingMoviesCollection,
    // Popular/Trending collections
    popularMoviesCollection, popularTVCollection, topRatedMoviesCollection, topRatedTVCollection, tvShowsByGenreCollection
} from './discover-query-collection';

// Export all types and interfaces
export type {
    DiscoverMoviesCollectionProps, DiscoverMoviesFilters, DiscoverTVCollectionProps, DiscoverTVFilters
} from './discover-query-collection';

// Re-export relevant schema types for convenience
export type {
    Genre,
    TMDBBaseResponse, TMDBDiscoverMoviesResponse,
    TMDBDiscoverTVResponse, TMDBMovie,
    TMDBTVShow
} from './discover-zod-schema';

