import { pb } from "@/lib/pb/client";
import {
  createTMDBSDK,
  DiscoverMoviesParams,
  DiscoverTVParams,
  SearchParams,
  TMDBDiscoverMoviesResponse,
  TMDBDiscoverTVResponse,
  TMDBMovie,
  TMDBTVShow,
} from "./sdk-via-pb";
import { useQuery } from "@tanstack/react-query";
import { getUserWatchedlistQueryOptions, getUserWatchlistQueryOptions } from "./operations-options";


// Create TMDB SDK instance
const tmdb = createTMDBSDK(pb);

/**
 * Helper function to find all watchlists that contain a specific TMDB ID
 * @param watchlists - Array of watchlist records
 * @param tmdbId - The TMDB ID to search for
 * @returns Array of watchlist names that contain the TMDB ID
 */
function findWatchlistsContainingTmdbId(watchlists: any[], tmdbId: string | number): string[] {
  if (!watchlists || watchlists.length === 0) {
    return [];
  }
  // console.log(" unfiltered ===", watchlists);
  // console.log("==  ilter tets  ==",filterTest)
  const watchListsWithTheId = watchlists.filter((watchlist) => {
    // Check if the TMDB ID exists in the items array (converted to string for comparison)
    return watchlist.items?.some((itemId: any) => String(itemId) === String(tmdbId));
  });
  // console.log("watchListsWithTheId ===>> ", watchListsWithTheId);
  const watchlistInRecords = watchListsWithTheId.map(
    (watchlist) =>{
      // console.log("watchlist ===>> ", watchlist);
      return watchlist.title || watchlist.name || `Watchlist ${watchlist.id}`
    }
  );
  // console.log("watchlistInRecords ===>> ", watchlistInRecords);
  return watchlistInRecords;
}

// Extended types with watched status
export type TMDBMovieWithWatched = TMDBMovie & {
  watched?: boolean;
  inWatchList?: string[]; // Array of watchlist names this item is in
};
export type TMDBTVShowWithWatched = TMDBTVShow & {
  watched?: boolean;
  inWatchList?: string[]; // Array of watchlist names this item is in
};

export type TMDBDiscoverMoviesResponseWithWatched = Omit<TMDBDiscoverMoviesResponse, "results"> & {
  results: TMDBMovieWithWatched[];
};

export type TMDBDiscoverTVResponseWithWatched = Omit<TMDBDiscoverTVResponse, "results"> & {
  results: TMDBTVShowWithWatched[];
};

export type TMDBDiscoverResponseWithWatched =
  | TMDBDiscoverMoviesResponseWithWatched
  | TMDBDiscoverTVResponseWithWatched;

export type TMDBDiscoverItemResponse = TMDBTVShowWithWatched | TMDBMovieWithWatched;

// ============================================================================
// TMDB Hooks
// ============================================================================

/**
 * Hook to discover movies
 */
export function useTMDBDiscoverMovies(params: DiscoverMoviesParams = {}) {
  return useQuery({
    queryKey: ["tmdb", "discover", "movies", params],
    queryFn: () =>
      tmdb.discoverMovies({
        sort_by: "popularity.desc",
        page: 1,
        ...params,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to discover TV shows
 */
export function useTMDBDiscoverTV(params: DiscoverTVParams = {}) {
  return useQuery({
    queryKey: ["tmdb", "discover", "tv", params],
    queryFn: () =>
      tmdb.discoverTV({
        sort_by: "popularity.desc",
        page: 1,
        ...params,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Unified discover response type
 */
export type TMDBDiscoverResponse = TMDBDiscoverMoviesResponse | TMDBDiscoverTVResponse;

/**
 * Unified discover hook for both movies and TV shows
 */
export function useTMDBDiscover({
  type,
  params,
}: {
  type: "movie" | "tv";
  params?: DiscoverMoviesParams | DiscoverTVParams;
}) {
  const userId = pb.authStore.record?.id;
  const {
    data: userWatchedList,
    isLoading: isLoadingUserWatchedList,
  } = useQuery({
    ...getUserWatchedlistQueryOptions({ userId: userId! }),
  });

  const {
    data: userWatchlist,
    isLoading: isLoadingUserWatchlist,
  } = useQuery({
    ...getUserWatchlistQueryOptions({ userId: userId! }),
    enabled: !!userId,
  });
  // console.log({ dataUpdatedAtUserWatchedList, dataUpdatedAtUserWatchlist });

  const query = useQuery<TMDBDiscoverResponseWithWatched>({
    queryKey: ["tmdb", "discover", type, params],
    queryFn: async (): Promise<TMDBDiscoverResponse> => {
      if (type === "movie") {
        return await tmdb.discoverMovies({
          sort_by: "popularity.desc",
          page: 1,
          ...params,
        } as DiscoverMoviesParams);
      } else {
        return await tmdb.discoverTV({
          sort_by: "popularity.desc",
          page: 1,
          ...params,
        } as DiscoverTVParams);
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !isLoadingUserWatchedList && !isLoadingUserWatchlist && !!userId,
    select: (data): TMDBDiscoverResponseWithWatched => {
      return {
        ...data,
        results: data.results.map((item) => {
          // Check if item is in watched list by comparing TMDB IDs
          const isWatched =
            userWatchedList?.some((watchedItem) => {
              return watchedItem === String(item.id);
            }) || false;
          // Check which watchlists contain this item
          const inWatchList = findWatchlistsContainingTmdbId(userWatchlist?.items || [], item.id);

          // console.log(" === userWatchlist ==>> ", userWatchlist);
          // console.log("inWatchList === >> ", inWatchList);
          return {
            ...item,
            watched: isWatched,
            inWatchList: inWatchList,
          };
        }),
      } as TMDBDiscoverResponseWithWatched;
    },
  });
  return {
    ...query,
    isLoading: query.isLoading || isLoadingUserWatchedList || isLoadingUserWatchlist,
  };
}

/**
 * Hook to search TMDB content
 */
export function useTMDBSearch(params: SearchParams) {
  return useQuery({
    queryKey: ["tmdb", "search", params],
    queryFn: () => tmdb.search(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get trending movies (using discover with popularity sort)
 */
export function useTMDBTrendingMovies() {
  return useQuery({
    queryKey: ["tmdb", "trending", "movies"],
    queryFn: () =>
      tmdb.discoverMovies({
        sort_by: "popularity.desc",
        "vote_count.gte": 100,
        page: 1,
      }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to get trending TV shows (using discover with popularity sort)
 */
export function useTMDBTrendingTV() {
  return useQuery({
    queryKey: ["tmdb", "trending", "tv"],
    queryFn: () =>
      tmdb.discoverTV({
        sort_by: "popularity.desc",
        "vote_count.gte": 50,
        page: 1,
      }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to get top rated movies
 */
export function useTMDBTopRatedMovies() {
  return useQuery({
    queryKey: ["tmdb", "top-rated", "movies"],
    queryFn: () =>
      tmdb.discoverMovies({
        sort_by: "vote_average.desc",
        "vote_count.gte": 1000,
        "vote_average.gte": 7.0,
        page: 1,
      }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to get top rated TV shows
 */
export function useTMDBTopRatedTV() {
  return useQuery({
    queryKey: ["tmdb", "top-rated", "tv"],
    queryFn: () =>
      tmdb.discoverTV({
        sort_by: "vote_average.desc",
        "vote_count.gte": 500,
        "vote_average.gte": 7.5,
        page: 1,
      }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
