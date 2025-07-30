import { myWatchlistCollection } from "@/data/watchlist/collections";
import { ilike } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import React from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";

import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { useWatchlistSearch } from "../hooks";
import { WatchlistCard } from "../shared/WatchlistCard";

export function MyWatchlistScreen() {
  const { searchQuery } = useWatchlistSearch();
  const {
    data: watchlist,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query
        .from({
          watchlist: myWatchlistCollection(),
        })
        .where(({ watchlist }) => ilike(watchlist.title, `%${searchQuery}%`)),
    [searchQuery]
  );

  const { colors } = useTheme();
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
  if (!watchlist || watchlist.length === 0) {
    return (
      <WatchlistScreenScafold>
        <View style={styles.statesContainer}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <EmptyRoadSVG />
            </View>
            <Text
              variant="headlineSmall"
              style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No watchlists found
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              {searchQuery 
                ? "Try adjusting your search terms to find more watchlists"
                : "Create your first watchlist to get started"
              }
            </Text>
          </View>
        </View>
      </WatchlistScreenScafold>
    );
  }

  return (
    <WatchlistScreenScafold>
      <FlatList
        data={watchlist}
        renderItem={({ item }) => (
          <WatchlistCard 
            watchlist={item} 
            showUser={false}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    paddingTop: 8,
    paddingBottom: 16,
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
