
import { DiscoverMoviesParams, DiscoverTVParams } from "@/data/discover/discover-sdk";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Separate filter interfaces for movies and TV
export interface MovieDiscoverFilters {
  sort_by: string;
  with_genres?: string;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  year?: string;
  primary_release_year?: string;
  language?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
}

export interface TVDiscoverFilters {
  sort_by: string;
  with_genres?: string;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  first_air_date_year?: string;
  language?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
}

// Combined interface for backwards compatibility
export interface DiscoverFilters {
  mediaType: "movie" | "tv" | "both";
  sort_by: string;
  with_genres?: string;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  year?: string;
  language?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
}

// Sort options that work for both movies and TV
export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular", mediaType: undefined },
  { value: "popularity.asc", label: "Least Popular", mediaType: undefined },
  { value: "vote_average.desc", label: "Highest Rated", mediaType: undefined },
  { value: "vote_average.asc", label: "Lowest Rated", mediaType: undefined },
  { value: "vote_count.desc", label: "Most Voted", mediaType: undefined },
  { value: "vote_count.asc", label: "Least Voted", mediaType: undefined },
  // Movie specific
  { value: "release_date.desc", label: "Newest Movies", mediaType: "movie" },
  { value: "release_date.asc", label: "Oldest Movies", mediaType: "movie" },
  // TV specific
  { value: "first_air_date.desc", label: "Newest TV Shows", mediaType: "tv" },
  { value: "first_air_date.asc", label: "Oldest TV Shows", mediaType: "tv" },
] as const;

// Common genres that exist for both movies and TV
export const COMMON_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
] as const;

interface DiscoverFiltersState {
  // Separate filters for movies and TV
  movieFilters: MovieDiscoverFilters;
  tvFilters: TVDiscoverFilters;
  
  // Active tab
  activeTab: "movie" | "tv";
  setActiveTab: (tab: "movie" | "tv") => void;
  
  // Movie filter methods
  setMovieFilters: (filters: Partial<MovieDiscoverFilters>) => void;
  resetMovieFilters: () => void;
  
  // TV filter methods  
  setTVFilters: (filters: Partial<TVDiscoverFilters>) => void;
  resetTVFilters: () => void;
  
  // Legacy methods for backwards compatibility
  filters: DiscoverFilters;
  setFilters: (filters: Partial<DiscoverFilters>) => void;
  resetFilters: () => void;
  getMovieParams: () => DiscoverMoviesParams;
  getTVParams: () => DiscoverTVParams;

  // Genre helpers (now tab-aware)
  selectedGenres: number[];
  toggleGenre: (genreId: number) => void;
  clearGenres: () => void;
}

const DEFAULT_MOVIE_FILTERS: MovieDiscoverFilters = {
  sort_by: "popularity.desc",
  language: "en-US",
};

const DEFAULT_TV_FILTERS: TVDiscoverFilters = {
  sort_by: "popularity.desc", 
  language: "en-US",
};

export const useDiscoverFiltersStore = create<DiscoverFiltersState>()(
  devtools(
    persist(
      (set, get) => ({
        // New tab-specific filters
        movieFilters: DEFAULT_MOVIE_FILTERS,
        tvFilters: DEFAULT_TV_FILTERS,
        activeTab: "movie",
        selectedGenres: [],

        // Tab management
        setActiveTab: (tab) => set({ activeTab: tab }),

        // Movie filter methods
        setMovieFilters: (newFilters) =>
          set((state) => ({
            movieFilters: { ...state.movieFilters, ...newFilters },
          })),

        resetMovieFilters: () =>
          set({
            movieFilters: DEFAULT_MOVIE_FILTERS,
          }),

        // TV filter methods
        setTVFilters: (newFilters) =>
          set((state) => ({
            tvFilters: { ...state.tvFilters, ...newFilters },
          })),

        resetTVFilters: () =>
          set({
            tvFilters: DEFAULT_TV_FILTERS,
          }),

        // Legacy compatibility - returns current tab's filters
        get filters() {
          const state = get();
          const activeFilters = state.activeTab === "movie" ? state.movieFilters : state.tvFilters;
          return {
            mediaType: state.activeTab,
            ...activeFilters,
          } as DiscoverFilters;
        },

        setFilters: (newFilters) => {
          const state = get();
          if (state.activeTab === "movie") {
            state.setMovieFilters(newFilters);
          } else {
            state.setTVFilters(newFilters);
          }
        },

        resetFilters: () => {
          const state = get();
          if (state.activeTab === "movie") {
            state.resetMovieFilters();
          } else {
            state.resetTVFilters();
          }
        },

        // Convert movie filters to TMDB parameters
        getMovieParams: (): DiscoverMoviesParams => {
          const { movieFilters } = get();
          const params: DiscoverMoviesParams = {
            sort_by: movieFilters.sort_by,
            language: movieFilters.language,
          };

          // Map filters to movie-specific parameters
          if (movieFilters.with_genres) params.with_genres = movieFilters.with_genres;
          if (movieFilters["vote_average.gte"])
            params["vote_average.gte"] = movieFilters["vote_average.gte"];
          if (movieFilters["vote_count.gte"])
            params["vote_count.gte"] = movieFilters["vote_count.gte"];
          if (movieFilters["with_runtime.gte"])
            params["with_runtime.gte"] = movieFilters["with_runtime.gte"];
          if (movieFilters["with_runtime.lte"])
            params["with_runtime.lte"] = movieFilters["with_runtime.lte"];

          if (movieFilters.year) {
            params.year = movieFilters.year;
            params.primary_release_year = movieFilters.year;
          }

          return params;
        },

        // Convert TV filters to TMDB parameters
        getTVParams: (): DiscoverTVParams => {
          const { tvFilters } = get();
          const params: DiscoverTVParams = {
            sort_by: tvFilters.sort_by,
            language: tvFilters.language,
          };

          // Map filters to TV-specific parameters
          if (tvFilters.with_genres) params.with_genres = tvFilters.with_genres;
          if (tvFilters["vote_average.gte"])
            params["vote_average.gte"] = tvFilters["vote_average.gte"];
          if (tvFilters["vote_count.gte"])
            params["vote_count.gte"] = tvFilters["vote_count.gte"];
          if (tvFilters["with_runtime.gte"])
            params["with_runtime.gte"] = tvFilters["with_runtime.gte"];
          if (tvFilters["with_runtime.lte"])
            params["with_runtime.lte"] = tvFilters["with_runtime.lte"];

          if (tvFilters.first_air_date_year) {
            params.first_air_date_year = tvFilters.first_air_date_year;
          }

          return params;
        },

        // Genre management (now tab-aware)
        toggleGenre: (genreId) =>
          set((state) => {
            const isSelected = state.selectedGenres.includes(genreId);
            const newSelectedGenres = isSelected
              ? state.selectedGenres.filter((id) => id !== genreId)
              : [...state.selectedGenres, genreId];

            const genreString =
              newSelectedGenres.length > 0
                ? newSelectedGenres.join(",")
                : undefined;

            // Update the appropriate filter set based on active tab
            if (state.activeTab === "movie") {
              return {
                selectedGenres: newSelectedGenres,
                movieFilters: {
                  ...state.movieFilters,
                  with_genres: genreString,
                },
              };
            } else {
              return {
                selectedGenres: newSelectedGenres,
                tvFilters: {
                  ...state.tvFilters,
                  with_genres: genreString,
                },
              };
            }
          }),

        clearGenres: () =>
          set((state) => {
            if (state.activeTab === "movie") {
              return {
                selectedGenres: [],
                movieFilters: {
                  ...state.movieFilters,
                  with_genres: undefined,
                },
              };
            } else {
              return {
                selectedGenres: [],
                tvFilters: {
                  ...state.tvFilters,
                  with_genres: undefined,
                },
              };
            }
          }),
      }),
      {
        name: "discover-filters-storage",
        partialize: (state) => ({
          movieFilters: state.movieFilters,
          tvFilters: state.tvFilters,
          activeTab: state.activeTab,
          selectedGenres: state.selectedGenres,
        }),
      }
    ),
    {
      name: "discover-filters-store",
    }
  )
);

// Helper function to get available sort options based on media type
export function getAvailableSortOptions(mediaType: "movie" | "tv" | "both") {
  if (mediaType === "both") {
    return SORT_OPTIONS.filter((option) => !option.mediaType);
  }
  return SORT_OPTIONS.filter(
    (option) => !option.mediaType || option.mediaType === mediaType
  );
}

// Helper function to format genre names from IDs
export function getGenreNames(genreIds: number[]): string[] {
  return genreIds
    .map((id) => COMMON_GENRES.find((genre) => genre.id === id)?.name)
    .filter(Boolean) as string[];
}

// Helper function to get current year for year filtering
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// Helper function to get year range for filtering
export function getYearRange(startYear: number = 1900): number[] {
  const currentYear = getCurrentYear();
  const years: number[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
}


  export const getCategoryLabel = (sortBy: string): string => {
    return sortBy
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to determine media type from sort_by
  export const getMediaTypeFromSort = (filters: DiscoverFilters): "movie" | "tv" => {
    if (filters.sort_by.includes("release_date")) return "movie";
    if (filters.sort_by.includes("first_air_date")) return "tv";
    // Default to movie for generic sorts like popularity, vote_average
    return filters.mediaType === "tv" ? "tv" : "movie";
  };
  