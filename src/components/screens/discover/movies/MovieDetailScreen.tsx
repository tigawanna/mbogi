import { movieToUnified, UnifiedMediaItem } from "@/data/discover/types/unified-media";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Chip,
    Divider,
    Text,
    useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getOptimizedImageUrl } from "@/data/discover/discover-sdk";
import { movieDetailsQueryOptions } from "@/data/discover/discover-query-options";

interface MovieDetailScreenProps {
  movieId: number;
  onAddToWatchlist?: (watchlistId: string, mediaItem: UnifiedMediaItem) => void;
}

export function MovieDetailScreen({ movieId, onAddToWatchlist }: MovieDetailScreenProps) {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  const { data: movie, isLoading, error } = useQuery({
    ...movieDetailsQueryOptions(movieId, {
      append_to_response: "credits,similar,videos,keywords",
    }),
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={styles.loadingContainer}>
          <Text variant="headlineSmall">Loading movie details...</Text>
        </View>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={{ color: colors.error }}>
            Failed to load movie details
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            {error?.message || "Unknown error occurred"}
          </Text>
        </View>
      </View>
    );
  }

  // const unifiedMovie = movieToUnified(movie);
  const posterUrl = getOptimizedImageUrl(movie.poster_path, "poster", "large");
  const backdropUrl = getOptimizedImageUrl(movie.backdrop_path, "backdrop", "large");

  const formatRuntime = (minutes: number | null): string => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Backdrop Image */}
      {backdropUrl ? (
        <Image
          source={{ uri: backdropUrl }}
          style={styles.backdrop}
          contentFit="cover"
        />
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
                  {movie.title}
                </Text>

                {movie.original_title !== movie.title ? (
                  <Text
                    variant="titleMedium"
                    style={[styles.originalTitle, { color: colors.onSurfaceVariant }]}
                  >
                    {movie.original_title}
                  </Text>
                ) : null}

                {movie.tagline ? (
                  <Text
                    variant="bodyMedium"
                    style={[styles.tagline, { color: colors.onSurfaceVariant }]}
                  >
                    &ldquo;{movie.tagline}&rdquo;
                  </Text>
                ) : null}

                <View style={styles.metadata}>
                  <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "Unknown year"}{" "}
                    • {formatRuntime(movie.runtime)} • {movie.status}
                  </Text>
                </View>

                <View style={styles.rating}>
                  <Text variant="titleLarge" style={{ color: colors.primary }}>
                    ⭐ {movie.vote_average.toFixed(1)}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    ({movie.vote_count} votes)
                  </Text>
                </View>
              </View>
            </View>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 ? (
              <View style={styles.genresSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Genres
                </Text>
                <View style={styles.chipContainer}>
                  {movie.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      mode="outlined"
                      style={styles.chip}
                      textStyle={{ color: colors.onSurfaceVariant }}
                    >
                      {genre.name}
                    </Chip>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Watchlist Actions */}
            <View style={styles.actionsSection}>
              {/* <WatchlistDropdown
                mediaItem={unifiedMovie}
                onAddToWatchlist={onAddToWatchlist}
              /> */}
            </View>

            <Divider style={styles.divider} />

            {/* Overview */}
            {movie.overview ? (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Overview
                </Text>
                <Text variant="bodyMedium" style={styles.overview}>
                  {movie.overview}
                </Text>
              </View>
            ) : null}

            {/* Production Details */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Production Details
              </Text>
              
              {movie.budget > 0 ? (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Budget:
                  </Text>
                  <Text variant="bodyMedium">{formatCurrency(movie.budget)}</Text>
                </View>
              ) : null}

              {movie.revenue > 0 ? (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Revenue:
                  </Text>
                  <Text variant="bodyMedium">{formatCurrency(movie.revenue)}</Text>
                </View>
              ) : null}

              {movie.production_companies && movie.production_companies.length > 0 ? (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Studios:
                  </Text>
                  <Text variant="bodyMedium">
                    {movie.production_companies.map((company) => company.name).join(", ")}
                  </Text>
                </View>
              ) : null}

              {movie.production_countries && movie.production_countries.length > 0 ? (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>
                    Countries:
                  </Text>
                  <Text variant="bodyMedium">
                    {movie.production_countries.map((country) => country.name).join(", ")}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* External Links */}
            {movie.homepage ? (
              <View style={styles.section}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    // Handle external link
                  }}
                  style={styles.externalLink}
                >
                  Visit Official Website
                </Button>
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
  backdrop: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
    marginTop: -50, // Overlap with backdrop
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
    marginBottom: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  genresSection: {
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
  },
  externalLink: {
    marginTop: 8,
  },
});
