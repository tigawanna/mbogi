import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { discoverTVCollection } from "@/data/discover/discover-query-collection";
import { useLiveQuery } from "@tanstack/react-db";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDiscoverFiltersStore } from "../filters/discover-fliters-store";
import { DiscoverTVFlatList } from "./DiscoverTVFlatList";
import { myWatchlistsCollection } from "@/data/watchlist/my-watchlist";
import { useQueryClient } from "@tanstack/react-query";

export function DiscoverTVScreen() {
  const { colors } = useTheme();
  const { tvFilters } = useDiscoverFiltersStore();
  const currentPage = 1;
  const qc = useQueryClient();

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
        tv: discoverTVCollection({
          filters: tvFilters,
          enabled: true,
        }),
      }),
    [currentPage, tvFilters]
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
  // const data = queryResult

  if (isLoading) {
    return (
      <DiscoverTVScreenScaffold>
        <View style={styles.statesContainer}>
          <LoadingIndicatorDots />
        </View>
      </DiscoverTVScreenScaffold>
    );
  }

  if (isError) {
    return (
      <DiscoverTVScreenScaffold>
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
      </DiscoverTVScreenScaffold>
    );
  }

  if (!data || data.length === 0) {
    return (
      <DiscoverTVScreenScaffold>
        <View style={styles.statesContainer}>
          {__DEV__ ? (
            <View>
              <Text variant="titleMedium" style={{ color: colors.error }}>
                No TV shows found
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
                No TV shows found
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
                Try adjusting your filters or search terms to discover more content
              </Text>
            </View>
          )}
        </View>
      </DiscoverTVScreenScaffold>
    );
  }

  return (
    <DiscoverTVScreenScaffold>
      <DiscoverTVFlatList list={data} />
    </DiscoverTVScreenScaffold>
  );
}

interface DiscoverTVScreenScaffoldProps {
  children: React.ReactNode;
}

export function DiscoverTVScreenScaffold({ children }: DiscoverTVScreenScaffoldProps) {
  return <View style={styles.scaffoldContainer}>{children}</View>;
}

export function useDiscoverTVScreenSearch() {
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
