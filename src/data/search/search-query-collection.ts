import { pb } from "@/lib/pb/client";
import { queryClient } from "@/lib/tanstack/query/client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
  isMovieResult,
  isPersonResult,
  isTVShowResult,
  TMDBSearchResponseSchema,
  type TMDBMovie,
  type TMDBPerson,
  type TMDBSearchResponse,
  type TMDBTVShow
} from "../discover/discover-zod-schema";

// ============================================================================
// Search Filter Interfaces
// ============================================================================

/**
 * Search Movies Parameters
 */
export interface SearchMoviesFilters {
  query: string;
  page?: number;
  include_adult?: boolean;
  region?: string;
  year?: string;
  primary_release_year?: string;
}

/**
 * Search TV Shows Parameters
 */
export interface SearchTVFilters {
  query: string;
  page?: number;
  include_adult?: boolean;
  first_air_date_year?: string;
}

/**
 * Search People Parameters
 */
export interface SearchPersonFilters {
  query: string;
  page?: number;
  include_adult?: boolean;
}

// ============================================================================
// Collection Options
// ============================================================================

/**
 * Props for Search Movies Collection
 */
export interface SearchMoviesCollectionProps {
  filters: SearchMoviesFilters;
  enabled?: boolean;
}

/**
 * Props for Search TV Shows Collection  
 */
export interface SearchTVCollectionProps {
  filters: SearchTVFilters;
  enabled?: boolean;
}

/**
 * Props for Search People Collection  
 */
export interface SearchPersonCollectionProps {
  filters: SearchPersonFilters;
  enabled?: boolean;
}

// ============================================================================
// Search Query Collections
// ============================================================================

/**
 * Creates a query collection for searching movies
 */
export const searchMoviesCollection = ({ 
  filters, 
  enabled = true 
}: SearchMoviesCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["tmdb", "search", "movies", filters],
      queryFn: async (): Promise<TMDBMovie[]> => {
        // Build query string from filters
        const queryString = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryString.append(key, String(value));
          }
        });

        const url = `/api/tmdb/search/movie${
          queryString.toString() ? `?${queryString.toString()}` : ""
        }`;

        // Development logging
        if (__DEV__) {
          console.log(`🔍 TMDB Search Movies Collection: ${url}`);
        }

        // Make API call using PocketBase
        const data: TMDBSearchResponse = await pb.send(url, {
          method: "GET",
        });
        
        // Validate response with Zod schema
        const validatedData = TMDBSearchResponseSchema.parse(data);
        
        // Filter only movie results
        const movieResults = validatedData.results.filter(isMovieResult);
        
        return movieResults.map(result => ({
          id: result.id,
          title: result.title,
          original_title: result.original_title,
          overview: result.overview,
          poster_path: result.poster_path,
          backdrop_path: result.backdrop_path,
          release_date: result.release_date,
          adult: result.adult,
          genre_ids: result.genre_ids,
          original_language: result.original_language,
          popularity: result.popularity,
          vote_average: result.vote_average,
          vote_count: result.vote_count,
          video: result.video,
        }));
      },
      queryClient,
      enabled,
      getKey: (movie: TMDBMovie) => movie.id.toString(),
      schema: TMDBSearchResponseSchema.shape.results,
    })
  );
};

/**
 * Creates a query collection for searching TV shows
 */
export const searchTVCollection = ({ 
  filters, 
  enabled = true 
}: SearchTVCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["tmdb", "search", "tv", filters],
      queryFn: async (): Promise<TMDBTVShow[]> => {
        // Build query string from filters
        const queryString = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryString.append(key, String(value));
          }
        });

        const url = `/api/tmdb/search/tv${
          queryString.toString() ? `?${queryString.toString()}` : ""
        }`;

        // Development logging
        if (__DEV__) {
          console.log(`🔍 TMDB Search TV Collection: ${url}`);
        }

        // Make API call using PocketBase
        const data: TMDBSearchResponse = await pb.send(url, {
          method: "GET",
        });
        
        // Validate response with Zod schema
        const validatedData = TMDBSearchResponseSchema.parse(data);
        
        // Filter only TV show results
        const tvResults = validatedData.results.filter(isTVShowResult);
        
        return tvResults.map(result => ({
          id: result.id,
          name: result.name,
          original_name: result.original_name,
          overview: result.overview,
          poster_path: result.poster_path,
          backdrop_path: result.backdrop_path,
          first_air_date: result.first_air_date,
          genre_ids: result.genre_ids,
          original_language: result.original_language,
          popularity: result.popularity,
          vote_average: result.vote_average,
          vote_count: result.vote_count,
          origin_country: result.origin_country,
          adult: result.adult,
        }));
      },
      queryClient,
      enabled,
      getKey: (tvShow: TMDBTVShow) => tvShow.id.toString(),
      schema: TMDBSearchResponseSchema.shape.results,
    })
  );
};

/**
 * Creates a query collection for searching people
 */
export const searchPersonCollection = ({ 
  filters, 
  enabled = true 
}: SearchPersonCollectionProps) => {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["tmdb", "search", "person", filters],
      queryFn: async (): Promise<TMDBPerson[]> => {
        // Build query string from filters
        const queryString = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryString.append(key, String(value));
          }
        });

        const url = `/api/tmdb/search/person${
          queryString.toString() ? `?${queryString.toString()}` : ""
        }`;

        // Development logging
        if (__DEV__) {
          console.log(`🔍 TMDB Search Person Collection: ${url}`);
        }

        // Make API call using PocketBase
        const data: TMDBSearchResponse = await pb.send(url, {
          method: "GET",
        });
        
        // Validate response with Zod schema
        const validatedData = TMDBSearchResponseSchema.parse(data);
        
        // Filter only person results
        const personResults = validatedData.results.filter(isPersonResult);
        
        return personResults.map(result => ({
          id: result.id,
          name: result.name,
          original_name: result.original_name,
          profile_path: result.profile_path,
          adult: result.adult,
          popularity: result.popularity,
          known_for_department: result.known_for_department,
          known_for: result.known_for,
        }));
      },
      queryClient,
      enabled,
      getKey: (person: TMDBPerson) => person.id.toString(),
      schema: TMDBSearchResponseSchema.shape.results,
    })
  );
};
