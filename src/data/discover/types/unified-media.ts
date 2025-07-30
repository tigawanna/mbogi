import { TMDBMovie, TMDBMovieDetails, TMDBTVDetails, TMDBTVShow } from "../discover-zod-schema";


/**
 * Unified media item that can represent both movies and TV shows
 * This type will be used consistently across the app for display and storage
 */
export interface UnifiedMediaItem {
  // Required fields present in both movie and TV
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  media_type: "movie" | "tv";

  // Title fields (movie uses 'title', TV uses 'name')
  title?: string; // For movies
  name?: string; // For TV shows
  original_title?: string; // For movies
  original_name?: string; // For TV shows

  // Date fields
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
  last_air_date?: string; // For TV shows (from details)

  // Movie-specific fields
  adult?: boolean;
  video?: boolean;
  runtime?: number | null; // From details
  budget?: number; // From details
  revenue?: number; // From details

  // TV-specific fields
  origin_country?: string[];
  number_of_seasons?: number; // From details
  number_of_episodes?: number; // From details
  episode_run_time?: number[]; // From details
  in_production?: boolean; // From details
  last_episode_to_air?: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  } | null;
  networks?: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];

  // Common detail fields
  homepage?: string | null;
  production_companies?: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries?: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages?: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status?: string;
  tagline?: string | null;

  // User-specific fields (for when stored in PocketBase)
  watched_status?: boolean;
  personal_rating?: number;
  notes?: string;
  added_date?: string;
  user_id?: string;
  watchlist_id?: string;
  watchlist_item_id?: string; // PocketBase record ID
}

/**
 * Type guard to check if a unified media item is a movie
 */
export function isMovie(item: UnifiedMediaItem): item is UnifiedMediaItem & { media_type: "movie" } {
  return item.media_type === "movie";
}

/**
 * Type guard to check if a unified media item is a TV show
 */
export function isTVShow(item: UnifiedMediaItem): item is UnifiedMediaItem & { media_type: "tv" } {
  return item.media_type === "tv";
}

/**
 * Convert TMDB Movie to UnifiedMediaItem
 */
export function movieToUnified(movie: TMDBMovie | TMDBMovieDetails): UnifiedMediaItem {
  const unified: UnifiedMediaItem = {
    ...movie,
    media_type: "movie" as const,
  };
  
  // Remove TV-specific fields for type safety
  delete (unified as any).name;
  delete (unified as any).original_name;
  delete (unified as any).first_air_date;
  delete (unified as any).last_air_date;
  delete (unified as any).origin_country;
  delete (unified as any).number_of_seasons;
  delete (unified as any).number_of_episodes;
  delete (unified as any).episode_run_time;
  delete (unified as any).in_production;
  delete (unified as any).last_episode_to_air;
  delete (unified as any).networks;
  
  return unified;
}

/**
 * Convert TMDB TV Show to UnifiedMediaItem
 */
export function tvToUnified(tv: TMDBTVShow | TMDBTVDetails): UnifiedMediaItem {
  const unified: UnifiedMediaItem = {
    ...tv,
    media_type: "tv" as const,
    title: tv.name, // Map name to title for consistent access
    original_title: tv.original_name, // Map original_name to original_title
    release_date: tv.first_air_date, // Map first_air_date to release_date for consistent access
  };
  
  // Remove movie-specific fields for type safety
  delete (unified as any).adult;
  delete (unified as any).video;
  delete (unified as any).runtime;
  delete (unified as any).budget;
  delete (unified as any).revenue;
  
  return unified;
}

/**
 * Get the display title for any unified media item
 */
export function getDisplayTitle(item: UnifiedMediaItem): string {
  if (isMovie(item)) {
    return item.title || item.original_title || "Unknown Movie";
  } else {
    return item.name || item.original_name || "Unknown TV Show";
  }
}

/**
 * Get the original title for any unified media item
 */
export function getOriginalTitle(item: UnifiedMediaItem): string {
  if (isMovie(item)) {
    return item.original_title || item.title || "Unknown Movie";
  } else {
    return item.original_name || item.name || "Unknown TV Show";
  }
}

/**
 * Get the primary release date for any unified media item
 */
export function getReleaseDate(item: UnifiedMediaItem): string | undefined {
  if (isMovie(item)) {
    return item.release_date;
  } else {
    return item.first_air_date;
  }
}

/**
 * Get the release year for any unified media item
 */
export function getReleaseYear(item: UnifiedMediaItem): string | undefined {
  const date = getReleaseDate(item);
  if (!date) return undefined;
  return new Date(date).getFullYear().toString();
}

/**
 * Get formatted date information for display
 */
export function getFormattedDateInfo(item: UnifiedMediaItem): {
  primaryDate: string | undefined;
  primaryYear: string | undefined;
  secondaryDate?: string | undefined;
  secondaryYear?: string | undefined;
  displayText: string;
} {
  if (isMovie(item)) {
    const primaryDate = item.release_date;
    const primaryYear = primaryDate ? new Date(primaryDate).getFullYear().toString() : undefined;
    
    return {
      primaryDate,
      primaryYear,
      displayText: primaryYear || "Unknown year",
    };
  } else {
    const primaryDate = item.first_air_date;
    const primaryYear = primaryDate ? new Date(primaryDate).getFullYear().toString() : undefined;
    const secondaryDate = item.last_air_date;
    const secondaryYear = secondaryDate ? new Date(secondaryDate).getFullYear().toString() : undefined;
    
    let displayText = "";
    if (primaryYear && secondaryYear && primaryYear !== secondaryYear) {
      displayText = `${primaryYear} - ${secondaryYear}`;
    } else if (primaryYear) {
      displayText = primaryYear;
      if (item.in_production) {
        displayText += " - Present";
      }
    } else {
      displayText = "Unknown year";
    }
    
    return {
      primaryDate,
      primaryYear,
      secondaryDate,
      secondaryYear,
      displayText,
    };
  }
}

/**
 * Get media type display text
 */
export function getMediaTypeText(item: UnifiedMediaItem): string {
  return isMovie(item) ? "Movie" : "TV Show";
}

/**
 * Get navigation route for the media item
 */
export function getNavigationRoute(item: UnifiedMediaItem): string {
  return isMovie(item) 
    ? `/(container)/${item.id}?type=movie` 
    : `/(container)/${item.id}?type=tv`;
}
