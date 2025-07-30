import { queryOptions } from "@tanstack/react-query";
import { TMDBMovieDetails, TMDBTVDetails } from "./discover-zod-schema";
import { createTMDBSDK } from "./discover-sdk";
import { pb } from "@/lib/pb/client";

const tmdb = createTMDBSDK(pb);

export function movieDetailsQueryOptions(movieId: number, params?: Record<string, any>) {
  return queryOptions({
    queryKey: ["tmdb", "movie", "details", movieId, params],
    queryFn: async (): Promise<TMDBMovieDetails> => {
      return await tmdb.getMovieDetails(movieId, params);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function tvDetailsQueryOptions(tvId: number, params?: Record<string, any>) {
  return queryOptions({
    queryKey: ["tmdb", "tv", "details", tvId, params],
    queryFn: async (): Promise<TMDBTVDetails> => {
      return await tmdb.getTVDetails(tvId, params);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function discoverMoviesQueryOptions(params?: Record<string, any>) {
  return queryOptions({
    queryKey: ["tmdb", "discover", "movies", params],
    queryFn: async () => {
      return await tmdb.discoverMovies(params);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function discoverTVQueryOptions(params?: Record<string, any>) {
  return queryOptions({
    queryKey: ["tmdb", "discover", "tv", params],
    queryFn: async () => {
      return await tmdb.discoverTV(params);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function searchQueryOptions(query: string, params?: Record<string, any>) {
  return queryOptions({
    queryKey: ["tmdb", "search", query, params],
    queryFn: async () => {
      return await tmdb.search({ query, ...params });
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}
