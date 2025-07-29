import { communityWatchlistCollection } from "@/data/watchlist/collections";
import { ilike } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { DataTable, Searchbar, Text, useTheme } from "react-native-paper";

import { useWatchlistSearch } from "../hooks";
import { useCommunityWatchListPageoptionsStore } from "@/data/watchlist/watchlist-stores";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { EmptyRoadSVG } from "@/components/shared/svg/empty";


export function CommunityWatchlistScreen() {
  const { searchQuery } = useWatchlistSearch();
  const pageOptions = useCommunityWatchListPageoptionsStore((state) => state.options);
  const setPageOptions = useCommunityWatchListPageoptionsStore((state) => state.setOptions);
  const { colors } = useTheme();
  const {
    data: watchlist,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query
        .from({
          watchlist: communityWatchlistCollection({
            keyword: searchQuery,
          }),
        })
        .where(({ watchlist }) => ilike(watchlist.title, `%${searchQuery}%`)),
    [searchQuery]
  );

  // console.log("watchlist data", data);
  if (isLoading) {
    return (
      <WatchlistScreenScafold>
        <View style={styles.statesContainer}>
          <LoadingIndicatorDots />
        </View>
      </WatchlistScreenScafold>
    );
  }
  if (isError) {
    return (
      <WatchlistScreenScafold>
        <View style={styles.statesContainer}>
          {__DEV__ ? (
            <View>
              <Text variant="titleMedium" style={{ color: colors.error }}>
                Failed to load
              </Text>
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
                {/* {error instanceof Error ? error.message : "Unknown error"} */}
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
      </WatchlistScreenScafold>
    );
  }
  if (!watchlist) {
    return (
      <WatchlistScreenScafold>
        <View style={styles.statesContainer}>
          {__DEV__ ? (
            <View>
              <Text variant="titleMedium" style={{ color: colors.error }}>
                No watchlist found
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
                No watchlist found
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
                Try adjusting your filters or search terms to discover more content
              </Text>
            </View>
          )}
        </View>
      </WatchlistScreenScafold>
    );
  }
  return (
    <WatchlistScreenScafold>
      <View style={{ ...styles.container }}>
        {watchlist.map((item) => {
          return <Text key={item.id}>{item.title}</Text>;
        })}
      </View>
      {pageOptions.totalPages > 1 && (
        <DataTable.Pagination
          page={pageOptions.page}
          numberOfPages={pageOptions.totalPages}
          onPageChange={(page) => {
            setPageOptions({
              ...pageOptions,
              page: page - 1, // DataTable uses 1-based index
            });
          }}
          label={`Page ${pageOptions.page + 1} of ${pageOptions.totalPages}`}
          showFastPaginationControls
          // style={styles.pagination}
        />
      )}
    </WatchlistScreenScafold>
  );
}

interface WatchlistScreenScafoldProps {
  children: React.ReactNode;
}
export function WatchlistScreenScafold({ children }: WatchlistScreenScafoldProps) {
  const { colors } = useTheme();
  const { searchQuery, setSearchQuery } = useWatchlistSearch();
  const { width } = useWindowDimensions();
  return (
    <View style={{ ...styles.scaffoldContainer }}>
      <Searchbar
        placeholder="Search Watchlist"
        onChangeText={(term) => setSearchQuery(term)}
        value={searchQuery}
        style={[styles.searchBar, { width: width * 0.95 }]}
        inputStyle={styles.searchInput}
        iconColor={colors.onSurfaceVariant}
        placeholderTextColor={colors.onSurfaceVariant}
      />
      {children}
    </View>
  );
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
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    elevation: 0,
  },
  searchInput: {
    fontSize: 16,
    width: "100%",
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


