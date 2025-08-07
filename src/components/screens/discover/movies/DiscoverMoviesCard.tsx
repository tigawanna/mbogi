import type { TMDBMovie } from "@/data/discover/discover-zod-schema";
import { ViewMode } from "@/store/view-preferences-store";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { DiscoverCardAction } from "../actions/DiscoverCardAction";


interface DiscoverMoviesCardProps {
  item: TMDBMovie;
  viewMode?: ViewMode;
}

const { width } = Dimensions.get("window");
const gridCardWidth = (width - 48) / 2; // Account for padding and gap
const listCardWidth = width - 32; // Account for horizontal padding

export function DiscoverMoviesCard({ item, viewMode = "grid" }: DiscoverMoviesCardProps) {
  const { colors } = useTheme();
//  logger.log("DiscoverMoviesCard item: ", item);
  const imageUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;

  const isGridView = viewMode === "grid";
  const cardWidth = isGridView ? gridCardWidth : listCardWidth;

  return (
      <Card
        style={[isGridView ? styles.gridContainer : styles.listContainer, { width: cardWidth }]}>
        {isGridView ? (
          // Grid Layout (existing design)
          <View>
            <Link href={`/movies/${item.id}`} asChild>
              <TouchableOpacity style={styles.imageContainer}>
                <Image
                  source={{
                    uri: imageUrl ? imageUrl : require("@/assets/images/poster-placeholder.jpeg"),
                  }}
                  style={styles.poster}
                  contentFit="cover"
                  transition={200}
                  placeholder={require("@/assets/images/poster-placeholder.jpeg")}
                />

                {/* Watchlist Action Overlay */}
                <View style={styles.actionOverlay} pointerEvents="box-none">
                  <TouchableOpacity onPress={(e) => e.stopPropagation()}>
                    <DiscoverCardAction
                      type="movies"
                      item={{
                        ...item,
                        media_type: "movie" as const,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Link>

            <Card.Content style={styles.gridContent}>
              <Link href={`/movies/${item.id}`} asChild>
                <TouchableOpacity>
                  <Text
                    variant="titleSmall"
                    numberOfLines={2}
                    style={[styles.title, { color: colors.onSurface }]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Link>

              <Text variant="bodySmall" style={[styles.year, { color: colors.onSurfaceVariant }]}>
                {item.release_date ? new Date(item.release_date).getFullYear() : "TBD"}
              </Text>

              {item.vote_average > 0 && (
                <View style={styles.ratingContainer}>
                  <Text variant="bodySmall" style={[styles.rating, { color: colors.primary }]}>
                    ⭐ {item.vote_average.toFixed(1)}
                  </Text>
                </View>
              )}
            </Card.Content>
          </View>
        ) : (
          // List Layout (horizontal)
          <View style={styles.listContent}>
            <Link href={`/movies/${item.id}`} asChild>
              <TouchableOpacity style={styles.listImageContainer}>
                <Image
                  source={{
                    uri: imageUrl ? imageUrl : require("@/assets/images/poster-placeholder.jpeg"),
                  }}
                  style={styles.listPoster}
                  contentFit="cover"
                  transition={200}
                  placeholder={require("@/assets/images/poster-placeholder.jpeg")}
                />
              </TouchableOpacity>
            </Link>

            <View style={styles.listTextContent}>
              <View style={styles.listHeader}>
                <Link href={`/movies/${item.id}`} asChild>
                  <TouchableOpacity style={{ flex: 1 }}>
                    <Text
                      variant="titleMedium"
                      numberOfLines={2}
                      style={[styles.listTitle, { color: colors.onSurface }]}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>

              <View style={styles.listMetadata}>
                <Text
                  variant="bodyMedium"
                  style={[styles.listYear, { color: colors.onSurfaceVariant }]}>
                  {item.release_date ? new Date(item.release_date).getFullYear() : "TBD"}
                </Text>

                {item.vote_average > 0 && (
                  <Text variant="bodyMedium" style={[styles.listRating, { color: colors.primary }]}>
                    ⭐ {item.vote_average.toFixed(1)}
                  </Text>
                )}
                <View style={styles.listActionContainer}>
                  <DiscoverCardAction
                    type="movies"
                    item={{
                      ...item,
                      media_type: "movie" as const,
                    }}
                  />
                </View>
              </View>

              {item.overview && (
                <Text
                  variant="bodySmall"
                  numberOfLines={3}
                  style={[styles.listOverview, { color: colors.onSurfaceVariant }]}>
                  {item.overview}
                </Text>
              )}
            </View>
          </View>
        )}
      </Card>
  );
}

const styles = StyleSheet.create({
  // Grid styles (existing)
  gridContainer: {
    marginBottom: 8,
    elevation: 4,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3, // Movie poster aspect ratio
    position: "relative",
  },
  poster: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  actionOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContent: {
    padding: 12,
    minHeight: 80,
  },
  title: {
    fontWeight: "600",
    lineHeight: 18,
    marginBottom: 4,
  },
  year: {
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rating: {
    fontWeight: "500",
  },

  // List styles (new)
  listContainer: {
    marginBottom: 12,
    elevation: 2,
  },
  listContent: {
    flexDirection: "row",
    padding: 16,
  },
  listImageContainer: {
    width: 80,
    height: 120,
    marginRight: 16,
  },
  listPoster: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  listTextContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  listHeader: {
    // flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listTitle: {
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  listMetadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 8,
  },
  listActionContainer: {
    width: "20%",
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  listYear: {
    fontWeight: "500",
  },
  listRating: {
    fontWeight: "500",
  },
  listOverview: {
    lineHeight: 18,
    flex: 1,
  },
});
