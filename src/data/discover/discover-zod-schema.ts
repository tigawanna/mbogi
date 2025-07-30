import { z } from "zod";

// ============================================================================
// Base TMDB Schemas
// ============================================================================

/**
 * Base response structure for paginated TMDB endpoints
 */
export const TMDBBaseResponseSchema = z.object({
  page: z.number(),
  total_results: z.number(),
  total_pages: z.number(),
});

/**
 * Genre schema used in both movies and TV shows
 */
export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

/**
 * Production company schema
 */
export const ProductionCompanySchema = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
});

/**
 * Production country schema
 */
export const ProductionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
});

/**
 * Spoken language schema
 */
export const SpokenLanguageSchema = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
});

/**
 * Network schema for TV shows
 */
export const NetworkSchema = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
});

// ============================================================================
// Cast and Crew Schemas
// ============================================================================

/**
 * Cast member schema
 */
export const CastMemberSchema = z.object({
  adult: z.boolean(),
  cast_id: z.number().optional(),
  character: z.string(),
  credit_id: z.string(),
  gender: z.number(),
  id: z.number(),
  known_for_department: z.string(),
  name: z.string(),
  order: z.number(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
});

/**
 * Crew member schema
 */
export const CrewMemberSchema = z.object({
  adult: z.boolean(),
  credit_id: z.string(),
  department: z.string(),
  gender: z.number(),
  id: z.number(),
  job: z.string(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
});

/**
 * Credits schema containing cast and crew
 */
export const CreditsSchema = z.object({
  cast: z.array(CastMemberSchema),
  crew: z.array(CrewMemberSchema),
});

// ============================================================================
// Video Schemas
// ============================================================================

/**
 * Video result schema
 */
export const VideoResultSchema = z.object({
  id: z.string(),
  iso_3166_1: z.string(),
  iso_639_1: z.string(),
  key: z.string(),
  name: z.string(),
  official: z.boolean(),
  published_at: z.string(),
  site: z.string(),
  size: z.number(),
  type: z.string(),
});

/**
 * Videos container schema
 */
export const VideosSchema = z.object({
  results: z.array(VideoResultSchema),
});

// ============================================================================
// Movie Schemas
// ============================================================================

/**
 * Basic movie schema for discover/search results
 */
export const TMDBMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  adult: z.boolean(),
  genre_ids: z.array(z.number()),
  original_language: z.string(),
  popularity: z.number(),
  vote_average: z.number(),
  vote_count: z.number(),
  video: z.boolean(),
  watchListName: z.string().optional(),
});

// ============================================================================
// TV Show Schemas
// ============================================================================

/**
 * Basic TV show schema for discover/search results
 */
export const TMDBTVShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  original_name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  first_air_date: z.string(),
  genre_ids: z.array(z.number()),
  original_language: z.string(),
  popularity: z.number(),
  vote_average: z.number(),
  vote_count: z.number(),
  origin_country: z.array(z.string()),
  adult: z.boolean(),
  watchListName: z.string().optional(),
});

// ============================================================================
// Recommendations Schema
// ============================================================================

/**
 * Recommendations response schema
 * Contains similar movies/TV shows based on the current item
 * Note: Results include media_type field to distinguish between movies and TV shows
 */
export const RecommendationsSchema = TMDBBaseResponseSchema.extend({
  results: z.array(
    z.union([
      TMDBMovieSchema.extend({ media_type: z.literal("movie") }),
      TMDBTVShowSchema.extend({ media_type: z.literal("tv") }),
    ])
  ),
});

/**
 * Movie details schema with extended information
 */
export const TMDBMovieDetailsSchema = TMDBMovieSchema.omit({
  genre_ids: true,
}).extend({
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullable(),
      backdrop_path: z.string().nullable(),
    })
    .nullable(),
  budget: z.number(),
  genres: z.array(GenreSchema),
  homepage: z.string().nullable(),
  imdb_id: z.string().nullable(),
  origin_country: z.array(z.string()),
  production_companies: z.array(ProductionCompanySchema),
  production_countries: z.array(ProductionCountrySchema),
  revenue: z.number(),
  runtime: z.number().nullable(),
  spoken_languages: z.array(SpokenLanguageSchema),
  status: z.string(),
  tagline: z.string().nullable(),
  // Optional extended data (when append_to_response is used)
  credits: CreditsSchema.optional(),
  videos: VideosSchema.optional(),
  recommendations: RecommendationsSchema.optional(),
});

/**
 * Discover movies response schema
 */
export const TMDBDiscoverMoviesResponseSchema = TMDBBaseResponseSchema.extend({
  results: z.array(TMDBMovieSchema),
});

/**
 * Episode schema for TV show details
 */
export const EpisodeSchema = z.object({
  air_date: z.string(),
  episode_number: z.number(),
  episode_type: z.string(),
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  production_code: z.string(),
  runtime: z.number().nullable(),
  season_number: z.number(),
  show_id: z.number(),
  still_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
});

/**
 * Season schema for TV show details
 */
export const SeasonSchema = z.object({
  air_date: z.string(),
  episode_count: z.number(),
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  season_number: z.number(),
  vote_average: z.number().optional(),
});

/**
 * TV show details schema with extended information
 */
export const TMDBTVDetailsSchema = TMDBTVShowSchema.omit({
  genre_ids: true,
}).extend({
  created_by: z.array(
    z.object({
      id: z.number(),
      credit_id: z.string(),
      name: z.string(),
      gender: z.number(),
      profile_path: z.string().nullable(),
    })
  ),
  episode_run_time: z.array(z.number()),
  genres: z.array(GenreSchema),
  homepage: z.string(),
  in_production: z.boolean(),
  languages: z.array(z.string()),
  last_air_date: z.string(),
  last_episode_to_air: EpisodeSchema.nullable(),
  next_episode_to_air: EpisodeSchema.nullable().optional(),
  networks: z.array(NetworkSchema),
  number_of_episodes: z.number(),
  number_of_seasons: z.number(),
  production_companies: z.array(ProductionCompanySchema),
  production_countries: z.array(ProductionCountrySchema),
  seasons: z.array(SeasonSchema),
  spoken_languages: z.array(SpokenLanguageSchema),
  status: z.string(),
  tagline: z.string(),
  type: z.string(),
  // Optional extended data (when append_to_response is used)
  credits: CreditsSchema.optional(),
  videos: VideosSchema.optional(),
  recommendations: RecommendationsSchema.optional(),
});

/**
 * Discover TV shows response schema
 */
export const TMDBDiscoverTVResponseSchema = TMDBBaseResponseSchema.extend({
  results: z.array(TMDBTVShowSchema),
});

// ============================================================================
// Season Details Schema
// ============================================================================

/**
 * Season episode with crew details
 */
export const SeasonEpisodeSchema = EpisodeSchema.extend({
  crew: z.array(CrewMemberSchema),
  guest_stars: z.array(CastMemberSchema),
});

/**
 * TV show season details response schema
 */
export const TMDBTVSeasonDetailsSchema = z.object({
  _id: z.string(),
  air_date: z.string(),
  episodes: z.array(SeasonEpisodeSchema),
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  season_number: z.number(),
  vote_average: z.number(),
});

// ============================================================================
// Search Schemas
// ============================================================================

/**
 * Person schema for search results
 */
export const TMDBPersonSchema = z.object({
  id: z.number(),
  name: z.string(),
  original_name: z.string(),
  profile_path: z.string().nullable(),
  adult: z.boolean(),
  popularity: z.number(),
  known_for_department: z.string(),
  known_for: z.array(z.union([TMDBMovieSchema, TMDBTVShowSchema])),
  watchListName: z.string().optional(),
});

/**
 * Search result item schema (discriminated union)
 */
export const TMDBSearchResultSchema = z.discriminatedUnion("media_type", [
  TMDBMovieSchema.extend({ media_type: z.literal("movie") }),
  TMDBTVShowSchema.extend({ media_type: z.literal("tv") }),
  TMDBPersonSchema.extend({ media_type: z.literal("person") }),
]);

/**
 * Search response schema
 */
export const TMDBSearchResponseSchema = TMDBBaseResponseSchema.extend({
  results: z.array(TMDBSearchResultSchema),
});

// ============================================================================
// Unified Content Schema (Movies + TV Shows)
// ============================================================================

/**
 * Unified content schema that can represent either a movie or TV show
 */
export const TMDBContentSchema = z.union([
  TMDBMovieSchema.extend({ content_type: z.literal("movie") }),
  TMDBTVShowSchema.extend({ content_type: z.literal("tv") }),
]);

/**
 * Unified content details schema
 */
export const TMDBContentDetailsSchema = z.union([
  TMDBMovieDetailsSchema.extend({ content_type: z.literal("movie") }),
  TMDBTVDetailsSchema.extend({ content_type: z.literal("tv") }),
]);

/**
 * Unified discover response schema
 */
export const TMDBDiscoverResponseSchema = z.union([
  TMDBDiscoverMoviesResponseSchema.extend({ content_type: z.literal("movie") }),
  TMDBDiscoverTVResponseSchema.extend({ content_type: z.literal("tv") }),
]);



// ============================================================================
// Type Exports
// ============================================================================

// Base types
export type TMDBBaseResponse = z.infer<typeof TMDBBaseResponseSchema>;
export type Genre = z.infer<typeof GenreSchema>;
export type ProductionCompany = z.infer<typeof ProductionCompanySchema>;
export type ProductionCountry = z.infer<typeof ProductionCountrySchema>;
export type SpokenLanguage = z.infer<typeof SpokenLanguageSchema>;
export type Network = z.infer<typeof NetworkSchema>;

// Cast and crew types
export type CastMember = z.infer<typeof CastMemberSchema>;
export type CrewMember = z.infer<typeof CrewMemberSchema>;
export type Credits = z.infer<typeof CreditsSchema>;

// Video types
export type VideoResult = z.infer<typeof VideoResultSchema>;
export type Videos = z.infer<typeof VideosSchema>;

// Recommendations type
export type Recommendations = z.infer<typeof RecommendationsSchema>;

// Movie types
export type TMDBMovie = z.infer<typeof TMDBMovieSchema>;
export type TMDBMovieDetails = z.infer<typeof TMDBMovieDetailsSchema>;
export type TMDBDiscoverMoviesResponse = z.infer<
  typeof TMDBDiscoverMoviesResponseSchema
>;

// TV show types
export type TMDBTVShow = z.infer<typeof TMDBTVShowSchema>;
export type TMDBTVDetails = z.infer<typeof TMDBTVDetailsSchema>;
export type TMDBDiscoverTVResponse = z.infer<
  typeof TMDBDiscoverTVResponseSchema
>;
export type Episode = z.infer<typeof EpisodeSchema>;
export type Season = z.infer<typeof SeasonSchema>;
export type SeasonEpisode = z.infer<typeof SeasonEpisodeSchema>;
export type TMDBTVSeasonDetails = z.infer<typeof TMDBTVSeasonDetailsSchema>;

// Search types
export type TMDBPerson = z.infer<typeof TMDBPersonSchema>;
export type TMDBSearchResult = z.infer<typeof TMDBSearchResultSchema>;
export type TMDBSearchResponse = z.infer<typeof TMDBSearchResponseSchema>;

// Unified types
export type TMDBContent = z.infer<typeof TMDBContentSchema>;
export type TMDBContentDetails = z.infer<typeof TMDBContentDetailsSchema>;
export type TMDBDiscoverResponse = z.infer<typeof TMDBDiscoverResponseSchema>;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if content is a movie
 */
export function isMovie(
  content: TMDBContent
): content is TMDBMovie & { content_type: "movie" } {
  return content.content_type === "movie";
}

/**
 * Type guard to check if content is a TV show
 */
export function isTVShow(
  content: TMDBContent
): content is TMDBTVShow & { content_type: "tv" } {
  return content.content_type === "tv";
}

/**
 * Type guard to check if search result is a movie
 */
export function isMovieResult(
  result: TMDBSearchResult
): result is TMDBMovie & { media_type: "movie" } {
  return result.media_type === "movie";
}

/**
 * Type guard to check if search result is a TV show
 */
export function isTVShowResult(
  result: TMDBSearchResult
): result is TMDBTVShow & { media_type: "tv" } {
  return result.media_type === "tv";
}

/**
 * Type guard to check if search result is a person
 */
export function isPersonResult(
  result: TMDBSearchResult
): result is TMDBPerson & { media_type: "person" } {
  return result.media_type === "person";
}

/**
 * Type guard to check if details are for a movie
 */
export function isMovieDetails(
  details: TMDBContentDetails
): details is TMDBMovieDetails & { content_type: "movie" } {
  return details.content_type === "movie";
}

/**
 * Type guard to check if details are for a TV show
 */
export function isTVDetails(
  details: TMDBContentDetails
): details is TMDBTVDetails & { content_type: "tv" } {
  return details.content_type === "tv";
}

/**
 * Type guard to check if recommendation result is a movie
 */
export function isMovieRecommendation(
  result: Recommendations["results"][0]
): result is TMDBMovie & { media_type: "movie" } {
  return result.media_type === "movie";
}

/**
 * Type guard to check if recommendation result is a TV show
 */
export function isTVRecommendation(
  result: Recommendations["results"][0]
): result is TMDBTVShow & { media_type: "tv" } {
  return result.media_type === "tv";
}
