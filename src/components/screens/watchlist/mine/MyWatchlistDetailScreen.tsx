import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { mySingleWatchlistItemsCollection, myWatchlistsCollection } from "@/data/watchlist/my-watchlist";
import { analyzeWatchlistGenres } from "@/utils/genre-utils";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Chip, IconButton, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WatchlistItemCard } from "../shared/WatchlistItemCard";

interface MyWatchlistDetailScreenProps {
  watchlistId: string;
}

export function MyWatchlistDetailScreen({ watchlistId }: MyWatchlistDetailScreenProps) { 
  const qc = useQueryClient();
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const myWatchlistCollection = myWatchlistsCollection;

  const {
    data: thisWatchlist,
    isLoading: isLoadingWatchlist,
    isError: isErrorWatchlist,
  } = useLiveQuery(
    (query) =>
      query
        .from({
          watchlist: myWatchlistCollection(qc),
        })
        .where(({ watchlist }) => eq(watchlist.id, watchlistId)),
    [watchlistId]
  );

  const {
    data: watchlistItems,
    isLoading: isLoadingWatchlistData,
    isError: isErrorWatchlistData,
  } = useLiveQuery(
    (query) =>
      query.from({
        watchlist: mySingleWatchlistItemsCollection(qc, watchlistId),
      }),
    [watchlistId]
  );


  const watchlist = thisWatchlist?.[0];
  const items = watchlistItems;
  const isLoading = isLoadingWatchlist || isLoadingWatchlistData;
  const isError = isErrorWatchlist || isErrorWatchlistData;
  console.log("This  Watchlist :>> ", watchlist.id,watchlistId);
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "earth";
      case "private":
        return "lock";
      case "followers_only":
        return "account-group";
      default:
        return "earth";
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "public":
        return colors.primary;
      case "private":
        return colors.error;
      case "followers_only":
        return colors.tertiary;
      default:
        return colors.onSurfaceVariant;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: top }]}>
        <View style={styles.statesContainer}>
          <Card style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.statusContent}>
              <LoadingIndicatorDots />
              <Text variant="titleMedium" style={[styles.statusTitle, { color: colors.onSurface }]}>
                Loading Watchlist
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.statusMessage, { color: colors.onSurfaceVariant }]}>
                Please wait while we fetch the watchlist details...
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  if (isError || !watchlist) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: top }]}>
        <View style={styles.statesContainer}>
          <Card style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.statusContent}>
              <Text variant="displaySmall" style={[styles.statusIcon, { color: colors.error }]}>
                📋
              </Text>
              <Text variant="titleLarge" style={[styles.statusTitle, { color: colors.error }]}>
                Watchlist not found
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.statusMessage, { color: colors.onSurfaceVariant }]}>
                The watchlist you&apos;re looking for doesn&apos;t exist or you don&apos;t have
                access to it.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Card style={[styles.headerCard, { backgroundColor: colors.surface }]}>
        <Card.Content>
          {/* Title and Visibility */}
          <View style={styles.titleRow}>
            <Text variant="headlineSmall" style={[styles.title, { color: colors.onSurface }]}>
              {watchlist.title}
            </Text>
            <IconButton
              icon={getVisibilityIcon(watchlist.visibility)}
              iconColor={getVisibilityColor(watchlist.visibility)}
              size={24}
            />
          </View>

          {/* Overview */}
          {watchlist.overview && (
            <Text
              variant="bodyMedium"
              style={[styles.overview, { color: colors.onSurfaceVariant }]}>
              {watchlist.overview}
            </Text>
          )}

          {/* Genre Analysis */}
          {items.length > 0 && (
            <Text
              variant="bodyMedium"
              style={[styles.genreAnalysis, { color: colors.tertiary }]}>
              {analyzeWatchlistGenres(items)}
            </Text>
          )}

          {/* Metadata */}
          <View style={styles.metadataContainer}>
            <Chip
              compact
              style={[styles.itemsChip, { backgroundColor: colors.primaryContainer }]}
              textStyle={{ color: colors.onPrimaryContainer }}>
              {items.length} {items.length === 1 ? "item" : "items"}
            </Chip>
            {watchlist.is_collaborative && (
              <Chip
                compact
                style={[styles.collaborativeChip, { backgroundColor: colors.tertiaryContainer }]}
                textStyle={{ color: colors.onTertiaryContainer }}>
                Collaborative
              </Chip>
            )}
            <Text variant="bodySmall" style={[styles.date, { color: colors.onSurfaceVariant }]}>
              Last updated: {formatDate(watchlist.updated)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer]}>
        <EmptyRoadSVG height={120} />
      </View>
      <Text variant="headlineSmall" style={[styles.emptyTitle, { color: colors.onSurface }]}>
        No items in this watchlist
      </Text>
      <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
        This watchlist is empty. Add some movies or TV shows to get started!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: 16 }]}>
      <FlatList
        data={items}
        renderItem={({ item,index }) => {
          console.log("Item in watchlist: ", item.id);
          return(
          <WatchlistItemCard
            item={item}
            watchListName={watchlist.title}
            watchlistId={watchlist.id}
          />
        )}}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statesContainer: {
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
    alignItems: "center",
    paddingVertical: 20,
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusTitle: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  statusMessage: {
    textAlign: "center",
    lineHeight: 18,
  },
  listContainer: {
    paddingBottom: 16,
  },
  headerContainer: {
    paddingBottom: 8,
  },
  headerCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: "600",
    marginRight: 8,
  },
  overview: {
    lineHeight: 20,
    marginBottom: 12,
  },
  genreAnalysis: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
    opacity: 0.9,
    fontWeight: '500',
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  itemsChip: {
    height: 28,
  },
  collaborativeChip: {
    height: 28,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
    marginTop: 40,
  },
  emptyIconContainer: {
    opacity: 0.6,
    marginBottom: 8,
  },
  emptyTitle: {
    textAlign: "center",
    fontWeight: "600",
  },
  emptySubtitle: {
    textAlign: "center",
    opacity: 0.8,
    maxWidth: 280,
    lineHeight: 20,
  },
});
