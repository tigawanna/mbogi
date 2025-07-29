import { eq, useLiveQuery } from "@tanstack/react-db";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { discoverMoviesCollection } from "@/data/discover/discover-query-collection";
import { DiscoverMoviesFlatList } from "./DiscoverMoviesFlatList";
import { useDiscoverFiltersStore } from "../filters/discover-fliters-store";
// import { myWatchlistCollection } from "@/data/watchlist/collections";

export function DiscoverMoviesScreen() {
  const { colors } = useTheme();
  const {movieFilters}= useDiscoverFiltersStore();
  // Pagination state (removed pagination as per requirements)
  const currentPage = 1;

  // Fetch data using TanStack DB live query
  const {
    data: queryResult,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query.from({
        movies: discoverMoviesCollection({
          filters:movieFilters,
          enabled: true,
        }),
      })
      // .join({
      //     watchlist:myWatchlistCollection()
      // },
      // ({ movies, watchlist }) => eq(movies.id))
        
        ,
    [currentPage, movieFilters]
  );

  // Extract movies data (no pagination as per requirements)
  const data = queryResult || [];

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
