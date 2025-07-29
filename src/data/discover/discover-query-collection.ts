import { pb } from "@/lib/pb/client";
import { queryClient } from "@/lib/tanstack/query/client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
  TMDBDiscoverMoviesResponseSchema,
  TMDBDiscoverTVResponseSchema,
  type TMDBMovie,
  type TMDBTVShow
} from "./discover-zod-schema";
import { createTMDBSDK, SearchParams } from "./discover-sdk";

const tmdbSdk = createTMDBSDK(pb);

// ============================================================================
// Filter Interfaces - Centralized Types
// ============================================================================

/**
 * Discover Movies Parameters
 * All possible filters for TMDB discover movies endpoint
 */
export interface DiscoverMoviesFilters {
  sort_by?: string;
  page?: number;
  with_genres?: string;
  year?: string;
  primary_release_year?: string;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  with_cast?: string;
  with_crew?: string;
  with_companies?: string;
  with_keywords?: string;
  include_adult?: boolean;
  include_video?: boolean;
  language?: string;
  region?: string;
  "release_date.gte"?: string;
  "release_date.lte"?: string;
  with_release_type?: string;
  certification_country?: string;
  certification?: string;
  "certification.lte"?: string;
  with_original_language?: string;
  without_genres?: string;
  without_keywords?: string;
  without_companies?: string;
  "vote_average.lte"?: number;
  "vote_count.lte"?: number;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
}

/**
 * Discover TV Shows Parameters
 * All possible filters for TMDB discover TV endpoint
 */
export interface DiscoverTVFilters {
  sort_by?: string;
  page?: number;
  with_genres?: string;
  first_air_date_year?: string;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  with_networks?: string;
  with_companies?: string;
  with_keywords?: string;
  include_null_first_air_dates?: boolean;
  language?: string;
  timezone?: string;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  with_original_language?: string;
  without_genres?: string;
  without_keywords?: string;
  without_companies?: string;
  "vote_average.lte"?: number;
  "vote_count.lte"?: number;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  screened_theatrically?: boolean;
  with_status?: string;
  with_type?: string;
}

// ============================================================================
// Collection Options - Query Collection Configurations
// ============================================================================

/**
 * Props for Discover Movies Collection
 */
export interface DiscoverMoviesCollectionProps {
  filters?: DiscoverMoviesFilters;
  enabled?: boolean;
}

/**
 * Props for Discover TV Shows Collection  
 */
export interface DiscoverTVCollectionProps {
  filters?: DiscoverTVFilters;
  enabled?: boolean;
}
/**
 * Props for Discover TV Shows Collection  
 */
export interface DiscoverSearchCollectionProps {
  filters?: SearchParams;
  enabled?: boolean;
}

/**
 * Creates a query collection for discovering movies with filters
 * 
 * @param props - Configuration including filters and enabled state
 * @returns Query collection for TMDB discover movies
 * 
 * @example
 * ```typescript
 * const moviesCollection = discoverMoviesCollection({
 *   filters: {
 *     with_genres: '28,12', // Action, Adventure
 *     year: '2023',
 *     'vote_average.gte': 7.0,
 *     page: 1
 *   },
 *   enabled: true
 * });
 * ```
 */
export const discoverMoviesCollection = ({ 
  filters = {}, 
  enabled = true 
}: DiscoverMoviesCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["tmdb", "discover", "movies", filters],
      queryFn: async () => {
       const response = await tmdbSdk.discoverMovies({
         sort_by: "popularity.desc",
         page: 1,
         ...filters,
       });
       return response.results
      },
      queryClient,
      enabled,
      getKey: (movie: TMDBMovie) => movie.id.toString(),
      schema: TMDBDiscoverMoviesResponseSchema.shape.results,
    })
  );
};

/**
 * Creates a query collection for discovering TV shows with filters
 * 
 * @param props - Configuration including filters and enabled state
 * @returns Query collection for TMDB discover TV shows
 * 
 * @example
 * ```typescript
 * const tvShowsCollection = discoverTVCollection({
 *   filters: {
 *     with_genres: '18,10765', // Drama, Sci-Fi & Fantasy
 *     first_air_date_year: '2023',
 *     with_networks: '213', // Netflix
 *     page: 1
 *   },
 *   enabled: true
 * });
 * ```
 */
export const discoverTVCollection = ({ 
  filters = {}, 
  enabled = true 
}: DiscoverTVCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["tmdb", "discover", "tv", filters],
      queryFn: async () => {
        const response = await tmdbSdk.discoverTV({
          sort_by: "popularity.desc",
          page: 1,
          ...filters,
        });
        return response.results;
      },
      queryClient,
      enabled,
      getKey: (tvShow: TMDBTVShow) => tvShow.id.toString(),
      schema: TMDBDiscoverTVResponseSchema.shape.results,
    })
  );
};
export const discoverSearchCollection = ({ 
  filters={query:''}, 
  enabled = true 
}: DiscoverSearchCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["tmdb", "search", filters],
      queryFn: async ()=> {
        const response = await tmdbSdk.search(filters)
          return response.results;
      },
      queryClient,
      enabled,
      getKey: (result) => result.id.toString(),
      schema: TMDBDiscoverTVResponseSchema.shape.results,
    })
  );
};

// ============================================================================
// Popular/Trending Collections (Common Use Cases)
// ============================================================================

/**
 * Pre-configured collection for popular movies
 */
// export const popularMoviesCollection = (page: number = 1) => 
//   discoverMoviesCollection({
//     filters: {
//       sort_by: "popularity.desc",
//       page,
//       "vote_count.gte": 100,
//     },
//   });

// /**
//  * Pre-configured collection for top rated movies
//  */
// export const topRatedMoviesCollection = (page: number = 1) => 
//   discoverMoviesCollection({
//     filters: {
//       sort_by: "vote_average.desc",
//       page,
//       "vote_count.gte": 1000,
//     },
//   });

// /**
//  * Pre-configured collection for now playing movies
//  */
// export const nowPlayingMoviesCollection = (page: number = 1) => {
//   const today = new Date().toISOString().split('T')[0];
//   const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
//   return discoverMoviesCollection({
//     filters: {
//       sort_by: "release_date.desc",
//       page,
//       "release_date.gte": thirtyDaysAgo,
//       "release_date.lte": today,
//     },
//   });
// };

// /**
//  * Pre-configured collection for popular TV shows
//  */
// export const popularTVCollection = (page: number = 1) => 
//   discoverTVCollection({
//     filters: {
//       sort_by: "popularity.desc",
//       page,
//       "vote_count.gte": 100,
//     },
//   });

// /**
//  * Pre-configured collection for top rated TV shows
//  */
// export const topRatedTVCollection = (page: number = 1) => 
//   discoverTVCollection({
//     filters: {
//       sort_by: "vote_average.desc",
//       page,
//       "vote_count.gte": 500,
//     },
//   });

// /**
//  * Pre-configured collection for airing today TV shows
//  */
// export const airingTodayTVCollection = (page: number = 1) => {
//   const today = new Date().toISOString().split('T')[0];
  
//   return discoverTVCollection({
//     filters: {
//       sort_by: "first_air_date.desc",
//       page,
//       "first_air_date.gte": today,
//       "first_air_date.lte": today,
//     },
//   });
// };

// // ============================================================================
// // Genre-based Collections
// // ============================================================================

// /**
//  * Creates a collection for movies of specific genres
//  */
// export const moviesByGenreCollection = (genreIds: number[], page: number = 1) => 
//   discoverMoviesCollection({
//     filters: {
//       with_genres: genreIds.join(','),
//       sort_by: "popularity.desc",
//       page,
//     },
//   });

/**
 * Creates a collection for TV shows of specific genres
 */
export const tvShowsByGenreCollection = (genreIds: number[], page: number = 1) => 
  discoverTVCollection({
    filters: {
      with_genres: genreIds.join(','),
      sort_by: "popularity.desc",
      page,
    },
  });
