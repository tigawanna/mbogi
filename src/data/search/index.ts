/**
 * @fileoverview Search Query Collections - Index
 * 
 * This file exports all the search query collections and types for TMDB search functionality.
 */

// Export all search collection functions
export {
  searchMoviesCollection, searchPersonCollection, searchTVCollection
} from './search-query-collection';

// Export all types and interfaces
export type {
  SearchMoviesCollectionProps, SearchMoviesFilters, SearchPersonCollectionProps, SearchPersonFilters, SearchTVCollectionProps, SearchTVFilters
} from './search-query-collection';

