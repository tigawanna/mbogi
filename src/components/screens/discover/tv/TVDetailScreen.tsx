import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { tvDetailsQueryOptions } from "@/data/discover/discover-query-options";
import { getOptimizedImageUrl } from "@/data/discover/discover-sdk";
import { UnifiedMediaItem } from "@/data/discover/types/unified-media";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";

interface TVDetailScreenProps {
  tvId: number;
  onAddToWatchlist?: (watchlistId: string, mediaItem: UnifiedMediaItem) => void;
}

export function TVDetailScreen({ tvId, onAddToWatchlist }: TVDetailScreenProps) {
  const { colors } = useTheme();

  const {
    data: tvShow,
    isLoading,
    error,
  } = useQuery({
    ...tvDetailsQueryOptions(tvId, {
      append_to_response: "credits,similar,videos,keywords,recommendations",
    }),
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Card style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.statusContent}>
              <LoadingIndicatorDots />
              <Text variant="titleMedium" style={[styles.statusTitle, { color: colors.onSurface }]}>
                Loading TV Show Details
              </Text>
              <Text variant="bodyMedium" style={[styles.statusMessage, { color: colors.onSurfaceVariant }]}>
                Please wait while we fetch the information...
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  if (error || !tvShow) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Card style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.statusContent}>
              <Text variant="displaySmall" style={[styles.statusIcon, { color: colors.error }]}>
                😞
              </Text>
              <Text variant="titleLarge" style={[styles.statusTitle, { color: colors.error }]}>
                Failed to load TV show details
              </Text>
              <Text variant="bodyMedium" style={[styles.statusMessage, { color: colors.onSurfaceVariant }]}>
                {error?.message || "Unknown error occurred"}
              </Text>
              <Button 
                mode="outlined" 
                onPress={() => window.location.reload()}
                style={styles.retryButton}
              >
                Try Again
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  const posterUrl = getOptimizedImageUrl(tvShow.poster_path, "poster", "large");
  const backdropUrl = getOptimizedImageUrl(tvShow.backdrop_path, "backdrop", "large");

  const formatDateRange = (): string => {
    const firstYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : null;
    const lastYear = tvShow.last_air_date ? new Date(tvShow.last_air_date).getFullYear() : null;

    if (!firstYear) return "Unknown";
    if (!lastYear || firstYear === lastYear) {
      return tvShow.in_production ? `${firstYear} - Present` : firstYear.toString();
    }
    return `${firstYear} - ${lastYear}`;
  };

  const formatEpisodeRuntime = (runtimes: number[]): string => {
    if (!runtimes || runtimes.length === 0) return "Unknown";
    if (runtimes.length === 1) return `${runtimes[0]} min`;
    const min = Math.min(...runtimes);
    const max = Math.max(...runtimes);
    return min === max ? `${min} min` : `${min}-${max} min`;
  };

  return (
    <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false}>
      {/* Backdrop Image */}
      {backdropUrl ? (
        <Image source={{ uri: backdropUrl }} style={styles.backdrop} contentFit="cover" />
      ) : null}

      {/* Main Content */}
      <View style={styles.content}>
        <Card style={[styles.mainCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            {/* Poster and Basic Info */}
            <View style={styles.headerSection}>
              {posterUrl ? (
                <Image
                  source={{ uri: posterUrl }}
                  style={styles.poster}
                  contentFit="cover"
                  placeholder={require("@/assets/images/poster-placeholder.jpeg")}
                />
              ) : (
                <Image
                  source={require("@/assets/images/poster-placeholder.jpeg")}
                  style={styles.poster}
                  contentFit="cover"
                />
              )}

              <View style={styles.basicInfo}>
                <Text variant="headlineSmall" style={styles.title}>
                  {tvShow.name}
                </Text>

                {tvShow.original_name !== tvShow.name ? (
                  <Text
                    variant="titleMedium"
                    style={[styles.originalTitle, { color: colors.onSurfaceVariant }]}>
                    {tvShow.original_name}
                  </Text>
                ) : null}

                {tvShow.tagline ? (
                  <Text
                    variant="bodyMedium"
                    style={[styles.tagline, { color: colors.onSurfaceVariant }]}>
                    &ldquo;{tvShow.tagline}&rdquo;
                  </Text>
                ) : null}

                <View style={styles.metadata}>
                  <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                    {formatDateRange()} • {formatEpisodeRuntime(tvShow.episode_run_time)} •{" "}
                    {tvShow.status}
                  </Text>
                </View>

                <View style={styles.seasonsInfo}>
                  <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                    {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? "s" : ""} •{" "}
                    {tvShow.number_of_episodes} Episode{tvShow.number_of_episodes !== 1 ? "s" : ""}
                  </Text>
                </View>

                <View style={styles.rating}>
                  <Text variant="titleLarge" style={{ color: colors.primary }}>
                    ⭐ {tvShow.vote_average.toFixed(1)}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    ({tvShow.vote_count} votes)
                  </Text>
                </View>
              </View>
            </View>

            {/* Last Episode Info */}
            {tvShow.last_episode_to_air ? (
              <View style={styles.lastEpisodeSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Latest Episode
                </Text>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  S{tvShow.last_episode_to_air.season_number}E
                  {tvShow.last_episode_to_air.episode_number}: {tvShow.last_episode_to_air.name}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                  Aired: {new Date(tvShow.last_episode_to_air.air_date).toLocaleDateString()}
                </Text>
                {tvShow.last_episode_to_air.overview ? (
                  <Text variant="bodyMedium" style={styles.episodeOverview}>
                    {tvShow.last_episode_to_air.overview}
                  </Text>
                ) : null}
              </View>
            ) : null}

            {/* Genres */}
            {tvShow.genres && tvShow.genres.length > 0 ? (
              <View style={styles.genresSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Genres
                </Text>
                <View style={styles.chipContainer}>
                  {tvShow.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      mode="outlined"
                      style={styles.chip}
                      textStyle={{ color: colors.onSurfaceVariant }}>
                      {genre.name}
                    </Chip>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Networks */}
            {tvShow.networks && tvShow.networks.length > 0 ? (
              <View style={styles.networksSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Networks
                </Text>
                <View style={styles.chipContainer}>
                  {tvShow.networks.map((network) => (
                    <Chip
                      key={network.id}
                      mode="outlined"
                      style={styles.chip}
                      textStyle={{ color: colors.onSurfaceVariant }}>
                      {network.name}
                    </Chip>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Watchlist Actions */}
            <View style={styles.actionsSection}>
              {/* <WatchlistDropdown
                mediaItem={unifiedTVShow}
                onAddToWatchlist={onAddToWatchlist}
              /> */}
            </View>

            <Divider style={styles.divider} />

            {/* Overview */}
            {tvShow.overview ? (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Overview
                </Text>
                <Text variant="bodyMedium" style={styles.overview}>
                  {tvShow.overview}
                </Text>
              </View>
            ) : null}

            {/* Production Details */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Production Details
              </Text>

              {tvShow.created_by && tvShow.created_by.length > 0 ? (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Created by:
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {tvShow.created_by.map((creator) => creator.name).join(", ")}
                  </Text>
                </View>
              ) : null}

              {tvShow.production_companies && tvShow.production_companies.length > 0 ? (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Studios:
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {tvShow.production_companies.map((company) => company.name).join(", ")}
                  </Text>
                </View>
              ) : null}

              {tvShow.production_countries && tvShow.production_companies.length > 0 ? (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Countries:
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {tvShow.production_countries.map((country) => country.name).join(", ")}
                  </Text>
                </View>
              ) : null}

              {tvShow.origin_country && tvShow.origin_country.length > 0 ? (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Origin:
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {tvShow.origin_country.join(", ")}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* External Links */}
            {tvShow.homepage ? (
              <View style={styles.section}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    // Handle external link
                  }}
                  style={styles.externalLink}>
                  Visit Official Website
                </Button>
              </View>
            ) : null}

            {/* Similar TV Shows */}
            {tvShow.recommendations &&
            tvShow.recommendations.results &&
            tvShow.recommendations.results.length > 0 ? (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Similar TV Shows
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.similarScroll}>
                  {tvShow.recommendations.results.slice(0, 10).map((similarShow) => (
                    <Link key={similarShow.id} href={`/tv/${similarShow.id}`} asChild>
                      <TouchableOpacity style={styles.similarCard}>
                        <Image
                          source={{
                            uri: similarShow.poster_path
                              ? `https://image.tmdb.org/t/p/w200${similarShow.poster_path}`
                              : require("@/assets/images/poster-placeholder.jpeg"),
                          }}
                          style={styles.similarPoster}
                          contentFit="cover"
                          placeholder={require("@/assets/images/poster-placeholder.jpeg")}
                        />
                        <Text
                          variant="bodySmall"
                          numberOfLines={2}
                          style={[styles.similarTitle, { color: colors.onSurface }]}>
                          {"title" in similarShow ? similarShow.title : similarShow.name}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={[styles.similarYear, { color: colors.onSurfaceVariant }]}>
                          {"release_date" in similarShow
                            ? similarShow.release_date
                              ? new Date(similarShow.release_date).getFullYear()
                              : "TBD"
                            : similarShow.first_air_date
                            ? new Date(similarShow.first_air_date).getFullYear()
                            : "TBD"}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={[styles.similarRating, { color: colors.primary }]}>
                          ⭐ {similarShow.vote_average.toFixed(1)}
                        </Text>
                      </TouchableOpacity>
                    </Link>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statusCard: {
    elevation: 4,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  statusContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  statusMessage: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 8,
  },
  backdrop: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
    marginTop: -50,
  },
  mainCard: {
    elevation: 4,
  },
  headerSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  basicInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  originalTitle: {
    marginBottom: 4,
  },
  tagline: {
    fontStyle: "italic",
    marginBottom: 8,
  },
  metadata: {
    marginBottom: 4,
  },
  seasonsInfo: {
    marginBottom: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  lastEpisodeSection: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  episodeOverview: {
    marginTop: 4,
    lineHeight: 16,
  },
  genresSection: {
    marginBottom: 16,
  },
  networksSection: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginVertical: 2,
  },
  actionsSection: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  overview: {
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: "600",
    marginRight: 8,
    minWidth: 80,
    flexShrink: 0,
  },
  detailValue: {
    flex: 1,
    flexWrap: 'wrap',
  },
  externalLink: {
    marginTop: 8,
  },
  similarScroll: {
    marginTop: 8,
  },
  similarCard: {
    width: 120,
    marginRight: 12,
  },
  similarPoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 4,
  },
  similarTitle: {
    textAlign: "center",
    marginBottom: 2,
  },
  similarYear: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 2,
  },
  similarRating: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
});
