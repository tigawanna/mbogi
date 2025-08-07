import { eq, useLiveQuery, inArray } from "@tanstack/react-db";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { discoverMoviesCollection } from "@/data/discover/discover-query-collection";

import { useQueryClient } from "@tanstack/react-query";
import { useDiscoverFiltersStore } from "../filters/discover-fliters-store";
import { DiscoverMoviesFlatList } from "./DiscoverMoviesFlatList";
import { myWatchlistsCollection } from "@/data/watchlist/my-watchlist";
import { logger } from "@/utils/logger";
// import { myWatchlistCollection } from "@/data/watchlist/collections";

export function DiscoverMoviesScreen() {
  const { colors } = useTheme();
  const { movieFilters } = useDiscoverFiltersStore();
  const qc = useQueryClient();

  // Pagination state (removed pagination as per requirements)
  const currentPage = 1;

  const { data: myWatchList } = useLiveQuery((query) => {
    return query.from({
      inwatchlist: myWatchlistsCollection(qc),
    });
  });

  // Fetch data using TanStack DB live query
  const {
    data: queryResult,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query.from({
        movies: discoverMoviesCollection({
          filters: movieFilters,
          enabled: true,
        }),
      }),

    [currentPage, movieFilters]
  );

  // Extract movies data (no pagination as per requirements)
  const data = queryResult.map((item) => {
    const itemId = item.id.toString();
    const watchLst = myWatchList?.find((wl) => wl.items.includes(itemId));
    return {
      ...item,
      watchlistTitle: watchLst?.title,
      watchlistId: watchLst?.id,
    };
  });

  // logger.log(data);
  if (isLoading) {
    return (
      <DiscoverMoviesScreenScaffold>
        <View style={styles.statesContainer}>
          <LoadingIndicatorDots />
        </View>
      </DiscoverMoviesScreenScaffold>
    );
  }

  if (isError) {
    return (
      <DiscoverMoviesScreenScaffold>
        <View style={styles.statesContainer}>
          {__DEV__ ? (
            <View>
              <Text variant="titleMedium" style={{ color: colors.error }}>
                Failed to load
              </Text>
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
                Something went wrong
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <EmptyRoadSVG />
              </View>
              <Text
                variant="headlineSmall"
                style={[styles.emptyTitle, { color: colors.onSurface }]}>
                Something went wrong
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
                Try adjusting your filters or search terms to discover more content
              </Text>
            </View>
          )}
        </View>
      </DiscoverMoviesScreenScaffold>
    );
  }

  if (!data || data.length === 0) {
    return (
      <DiscoverMoviesScreenScaffold>
        <View style={styles.statesContainer}>
          {__DEV__ ? (
            <View>
              <Text variant="titleMedium" style={{ color: colors.error }}>
                No items found
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <EmptyRoadSVG />
              </View>
              <Text
                variant="headlineSmall"
                style={[styles.emptyTitle, { color: colors.onSurface }]}>
                No items found
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
                Try adjusting your filters or search terms to discover more content
              </Text>
            </View>
          )}
        </View>
      </DiscoverMoviesScreenScaffold>
    );
  }

  return (
    <DiscoverMoviesScreenScaffold>
      <DiscoverMoviesFlatList list={data} />
    </DiscoverMoviesScreenScaffold>
  );
}

interface DiscoverMoviesScreenScaffoldProps {
  children: React.ReactNode;
}

export function DiscoverMoviesScreenScaffold({ children }: DiscoverMoviesScreenScaffoldProps) {
  return <View style={styles.scaffoldContainer}>{children}</View>;
}

export function useDiscoverMoviesScreenSearch() {
  const { query } = useLocalSearchParams<{ query: string }>();
  return {
    searchQuery: query || "",
    setSearchQuery: (query: string) => {
      router.setParams({ query });
    },
  };
}

const styles = StyleSheet.create({
  scaffoldContainer: {
    flex: 1,
    width: "100%",
  },
  statesContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  emptyIconContainer: {
    opacity: 0.6,
    marginBottom: 8,
  },
  emptyTitle: {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  emptySubtitle: {
    textAlign: "center",
    opacity: 0.8,
    maxWidth: 280,
    lineHeight: 20,
  },
});
