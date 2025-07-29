import PocketBase from "pocketbase";

// ============================================================================
// TMDB API SDK Types
// ============================================================================

/**
 * Base TMDB response structure
 */
export interface TMDBBaseResponse {
  page: number;
  total_results: number;
  total_pages: number;
}

/**
 * TMDB Movie object
 */
export interface TMDBMovie {
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

/**
 * TMDB TV Show object
 */
export interface TMDBTVShow {
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

/**
 * TMDB Person object
 */
export interface TMDBPerson {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
  known_for: (TMDBMovie | TMDBTVShow)[];
}

/**
 * TMDB Search result item (union type)
 */
export type TMDBSearchResult = (TMDBMovie | TMDBTVShow | TMDBPerson) & {
  media_type: "movie" | "tv" | "person";
};

/**
 * Discover Movies Response
 */
export interface TMDBDiscoverMoviesResponse extends TMDBBaseResponse {
  results: TMDBMovie[];
}

/**
 * Discover TV Shows Response
 */
export interface TMDBDiscoverTVResponse extends TMDBBaseResponse {
  results: TMDBTVShow[];
}

/**
 * Search Response
 */
export interface TMDBSearchResponse extends TMDBBaseResponse {
  results: TMDBSearchResult[];
}

/**
 * Movie Details Response
 */
export interface TMDBMovieDetails extends Omit<TMDBMovie, "genre_ids"> {
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
}

/**
 * TV Show Details Response
 */
export interface TMDBTVDetails extends Omit<TMDBTVShow, "genre_ids"> {
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  } | null;
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  type: string;
}

// ============================================================================
// Request Parameter Types
// ============================================================================

/**
 * Discover Movies Parameters
 */
export interface DiscoverMoviesParams {
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
 */
export interface DiscoverTVParams {
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

/**
 * Search Parameters
 */
export interface SearchParams {
  query: string;
  page?: number;
  include_adult?: boolean;
  language?: string;
  region?: string;
}

/**
 * Details Parameters
 */
export interface DetailsParams {
  language?: string;
  append_to_response?: string;
}

// ============================================================================
// TMDB SDK Class
// ============================================================================

/**
 * TMDB SDK for PocketBase integration
 * Provides methods to interact with TMDB API through PocketBase custom routes
 */
export class TMDBSDK {
  private pb: PocketBase;

  constructor(pocketbaseInstance: PocketBase) {
    this.pb = pocketbaseInstance;
  }

  /**
   * Discover movies with various filtering options
   * @param params - Discovery parameters for filtering movies
   * @returns Promise resolving to discover movies response
   *
   * @example
   * ```typescript
   * const movies = await tmdb.discoverMovies({
   *   with_genres: '28,12', // Action, Adventure
   *   year: '2023',
   *   'vote_average.gte': 7.0,
   *   page: 1
   * });
   * ```
   */
  async discoverMovies(
    params: DiscoverMoviesParams = {}
  ): Promise<TMDBDiscoverMoviesResponse> {
    const queryString = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, String(value));
      }
    });

    const url = `/api/tmdb/discover/movies${
      queryString.toString() ? `?${queryString.toString()}` : ""
    }`;

    // Development logging
    if (__DEV__) {
      console.log(`🎬 TMDB Discover Movies: ${this.pb.baseUrl}${url}`);
    }

    return await this.pb.send(url, {
      method: "GET",
    });
  }

  /**
   * Discover TV shows with various filtering options
   * @param params - Discovery parameters for filtering TV shows
   * @returns Promise resolving to discover TV shows response
   *
   * @example
   * ```typescript
   * const tvShows = await tmdb.discoverTV({
   *   with_genres: '18,10765', // Drama, Sci-Fi & Fantasy
   *   first_air_date_year: '2023',
   *   with_networks: '213', // Netflix
   *   page: 1
   * });
   * ```
   */
  async discoverTV(
    params: DiscoverTVParams = {}
  ): Promise<TMDBDiscoverTVResponse> {
    const queryString = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, String(value));
      }
    });

    const url = `/api/tmdb/discover/tv${
      queryString.toString() ? `?${queryString.toString()}` : ""
    }`;

    // Development logging
    if (__DEV__) {
      console.log(`📺 TMDB Discover TV: ${this.pb.baseUrl}${url}`);
    }

    return await this.pb.send(url, {
      method: "GET",
    });
  }

  /**
   * Search for movies, TV shows, and people
   * @param params - Search parameters including required query string
   * @returns Promise resolving to search results response
   *
   * @example
   * ```typescript
   * const results = await tmdb.search({
   *   query: 'The Matrix',
   *   page: 1,
   *   include_adult: false
   * });
   * ```
   */
  async search(params: SearchParams): Promise<TMDBSearchResponse> {
    if (!params.query || params.query.trim() === "") {
      throw new Error("Search query is required");
    }

    const queryString = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, String(value));
      }
    });

    const url = `/api/tmdb/search?${queryString.toString()}`;

    // Development logging
    if (__DEV__) {
      console.log(`🔍 TMDB Search: ${this.pb.baseUrl}${url}`);
    }

    return await this.pb.send(url, {
      method: "GET",
    });
  }

  /**
   * Get detailed information about a specific movie
   * @param id - TMDB movie ID
   * @param params - Additional parameters for the request
   * @returns Promise resolving to movie details response
   *
   * @example
   * ```typescript
   * const movie = await tmdb.getMovieDetails(550, {
   *   append_to_response: 'credits,videos,images'
   * });
   * ```
   */
  async getMovieDetails(
    id: number,
    params: DetailsParams = {}
  ): Promise<TMDBMovieDetails> {
    if (!id || id <= 0) {
      throw new Error("Valid movie ID is required");
    }

    const queryString = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, String(value));
      }
    });

    const url = `/api/tmdb/details/movie/${id}${
      queryString.toString() ? `?${queryString.toString()}` : ""
    }`;

    // Development logging
    if (__DEV__) {
      console.log(`🎭 TMDB Movie Details: ${this.pb.baseUrl}${url}`);
    }

    return await this.pb.send(url, {
      method: "GET",
    });
  }

  /**
   * Get detailed information about a specific TV show
   * @param id - TMDB TV show ID
   * @param params - Additional parameters for the request
   * @returns Promise resolving to TV show details response
   *
   * @example
   * ```typescript
   * const tvShow = await tmdb.getTVDetails(1399, {
   *   append_to_response: 'credits,videos,images'
   * });
   * ```
   */
  async getTVDetails(
    id: number,
    params: DetailsParams = {}
  ): Promise<TMDBTVDetails> {
    if (!id || id <= 0) {
      throw new Error("Valid TV show ID is required");
    }

    const queryString = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, String(value));
      }
    });

    const url = `/api/tmdb/details/tv/${id}${
      queryString.toString() ? `?${queryString.toString()}` : ""
    }`;

    // Development logging
    if (__DEV__) {
      console.log(`📻 TMDB TV Details: ${this.pb.baseUrl}${url}`);
    }

    return await this.pb.send(url, {
      method: "GET",
    });
  }

  /**
   * Generic method to get details for either movie or TV show
   * @param type - Content type: 'movie' or 'tv'
   * @param id - TMDB content ID
   * @param params - Additional parameters for the request
   * @returns Promise resolving to content details response
   *
   * @example
   * ```typescript
   * const content = await tmdb.getDetails('movie', 550);
   * const tvContent = await tmdb.getDetails('tv', 1399);
   * ```
   */
  async getDetails(
    type: "movie" | "tv",
    id: number,
    params: DetailsParams = {}
  ): Promise<TMDBMovieDetails | TMDBTVDetails> {
    if (type === "movie") {
      return this.getMovieDetails(id, params);
    } else if (type === "tv") {
      return this.getTVDetails(id, params);
    } else {
      throw new Error('Content type must be "movie" or "tv"');
    }
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a new TMDB SDK instance
 * @param pocketbaseInstance - PocketBase client instance
 * @returns New TMDB SDK instance
 *
 * @example
 * ```typescript
 * import PocketBase from 'pocketbase';
 * import { createTMDBSDK } from './sdk/pb';
 *
 * const pb = new PocketBase('http://localhost:8090');
 * const tmdb = createTMDBSDK(pb);
 * ```
 */
export function createTMDBSDK(pocketbaseInstance: PocketBase): TMDBSDK {
  return new TMDBSDK(pocketbaseInstance);
}

/**
 * Type guard to check if a search result is a movie
 */
export function isMovie(
  result: TMDBSearchResult
): result is TMDBMovie & { media_type: "movie" } {
  return result.media_type === "movie";
}

/**
 * Type guard to check if a search result is a TV show
 */
export function isTVShow(
  result: TMDBSearchResult
): result is TMDBTVShow & { media_type: "tv" } {
  return result.media_type === "tv";
}

/**
 * Type guard to check if a search result is a person
 */
export function isPerson(
  result: TMDBSearchResult
): result is TMDBPerson & { media_type: "person" } {
  return result.media_type === "person";
}
// ============================================================================
// TMDB Image Utilities
// ============================================================================

/**
 * TMDB image size options for different image types
 */
export const TMDB_IMAGE_SIZES = {
  poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
  backdrop: ["w300", "w780", "w1280", "original"],
  still: ["w92", "w185", "w300", "original"],
  profile: ["w45", "w185", "h632", "original"],
} as const;

/**
 * Common image size presets for different use cases
 */
export const TMDB_IMAGE_PRESETS = {
  poster: {
    thumbnail: "w185",
    small: "w342",
    medium: "w500",
    large: "w780",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
    original: "original",
  },
} as const;

/**
 * Build full TMDB image URL from image path
 * @param imagePath - The image path from TMDB API response (e.g., "/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg")
 * @param size - Image size (e.g., "w500", "original")
 * @returns Complete image URL or null if imagePath is null/empty
 *
 * @example
 * ```typescript
 * const posterUrl = buildTMDBImageUrl('/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg', 'w500');
 * // Returns: "https://image.tmdb.org/t/p/w500/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg"
 *
 * const originalUrl = buildTMDBImageUrl('/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg', 'original');
 * // Returns: "https://image.tmdb.org/t/p/original/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg"
 * ```
 */
export function buildTMDBImageUrl(
  imagePath: string | null,
  size: string = "w500"
): string | null {
  if (!imagePath) return null;

  const baseUrl = "https://image.tmdb.org/t/p";
  return `${baseUrl}/${size}${imagePath}`;
}

/**
 * Build multiple TMDB image URLs for responsive images
 * @param imagePath - The image path from TMDB API response
 * @param sizes - Array of sizes to generate URLs for
 * @returns Object with size as key and URL as value
 *
 * @example
 * ```typescript
 * const urls = buildTMDBImageUrls('/poster.jpg', ['w300', 'w500', 'w780']);
 * // Returns: {
 * //   w300: "https://image.tmdb.org/t/p/w300/poster.jpg",
 * //   w500: "https://image.tmdb.org/t/p/w500/poster.jpg",
 * //   w780: "https://image.tmdb.org/t/p/w780/poster.jpg"
 * // }
 * ```
 */
export function buildTMDBImageUrls(
  imagePath: string | null,
  sizes: string[]
): Record<string, string | null> {
  const urls: Record<string, string | null> = {};

  sizes.forEach((size) => {
    urls[size] = buildTMDBImageUrl(imagePath, size);
  });

  return urls;
}

/**
 * Get optimized image URL based on intended use case
 * @param imagePath - The image path from TMDB API response
 * @param type - Type of image (poster, backdrop, profile)
 * @param usage - Intended usage (varies based on type)
 * @returns Optimized image URL
 *
 * @example
 * ```typescript
 * const thumbnailUrl = getOptimizedImageUrl('/poster.jpg', 'poster', 'thumbnail');
 * // Returns: "https://image.tmdb.org/t/p/w185/poster.jpg"
 *
 * const backdropUrl = getOptimizedImageUrl('/backdrop.jpg', 'backdrop', 'large');
 * // Returns: "https://image.tmdb.org/t/p/w1280/backdrop.jpg"
 * ```
 */
export function getOptimizedImageUrl<T extends keyof typeof TMDB_IMAGE_PRESETS>(
  imagePath: string | null,
  type: T,
  usage: keyof (typeof TMDB_IMAGE_PRESETS)[T] = "medium" as keyof (typeof TMDB_IMAGE_PRESETS)[T]
): string | null {
  if (!imagePath) return null;

  const size = TMDB_IMAGE_PRESETS[type][
    usage as keyof (typeof TMDB_IMAGE_PRESETS)[T]
  ] as string;
  return buildTMDBImageUrl(imagePath, size);
}

/**
 * Generate srcset string for responsive images
 * @param imagePath - The image path from TMDB API response
 * @param type - Type of image (poster, backdrop, profile)
 * @returns srcset string for use in img elements
 *
 * @example
 * ```typescript
 * const srcset = generateImageSrcSet('/poster.jpg', 'poster');
 * // Returns: "https://image.tmdb.org/t/p/w185/poster.jpg 185w, https://image.tmdb.org/t/p/w342/poster.jpg 342w, ..."
 *
 * // Usage in HTML:
 * <img src="https://image.tmdb.org/t/p/w500/poster.jpg"
 *      srcset={srcset}
 *      sizes="(max-width: 768px) 185px, (max-width: 1024px) 342px, 500px" />
 * ```
 */
export function generateImageSrcSet(
  imagePath: string | null,
  type: keyof typeof TMDB_IMAGE_SIZES
): string | null {
  if (!imagePath) return null;

  const sizes = TMDB_IMAGE_SIZES[type];
  const srcsetParts: string[] = [];

  sizes.forEach((size) => {
    if (size === "original") return; // Skip original for srcset

    const url = buildTMDBImageUrl(imagePath, size);
    if (url) {
      // Extract width from size (e.g., 'w500' -> '500')
      const width = size.replace(/[^\d]/g, "");
      if (width) {
        srcsetParts.push(`${url} ${width}w`);
      }
    }
  });

  return srcsetParts.join(", ");
}
