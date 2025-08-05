import { myWatchlistsCollection } from "@/data/watchlist/my-watchlist";
import { ilike } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, FAB, Searchbar, Text, useTheme } from "react-native-paper";

import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";

import { useRefreshControl } from "@/hooks/useRefreshControl";
import type { WatchlistResponse } from "@/lib/pb/types/pb-types";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWatchlistSearch } from "../hooks";
import { WatchlistCard } from "../shared/WatchlistCard";
import { WatchlistFormModal } from "../shared/WatchlistFormModal";
import { createOrUpdateWatchlist } from "@/data/watchlist/watchlist-collection-mutations";

export function MyWatchlistScreen() {
  const qc = useQueryClient();
  const { searchQuery } = useWatchlistSearch();
  const { bottom } = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWatchlist, setEditingWatchlist] = useState<WatchlistResponse | null>(null);
  // const createMutation = useMutation(createWatchListMutationOptions())
  // const updateMutation = useMutation(updateWatchListMutationOptions())

  const {
    data: watchlist,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query
        .from({
          watchlist: myWatchlistsCollection(qc),
        })
        .where(({ watchlist }) => ilike(watchlist.title, `%${searchQuery}%`)),
    [searchQuery]
  );
  const { refreshing, onRefresh } = useRefreshControl(() => {
    return qc.invalidateQueries({ queryKey: ["watchlist", "mine"] });
  });

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
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <EmptyRoadSVG />
            </View>
            <Text variant="headlineSmall" style={[styles.emptyTitle, { color: colors.onSurface }]}>
              Something went wrong
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              Try adjusting your filters or search terms to discover more content
            </Text>
            {/* Add refresh button to error PROD state */}
            <Button
              mode="contained"
              onPress={onRefresh}
              style={{ marginTop: 16 }}
              loading={refreshing}>
              Refresh
            </Button>
          </View>
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
            <Text variant="headlineSmall" style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No watchlists found
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              Try adjusting your filters or search terms to discover more content
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                setEditingWatchlist(null);
                setModalVisible(true);
              }}
              style={{ marginTop: 16 }}>
              Create Watchlist
            </Button>
            {/* Add manual refresh button to empty state */}
            <Button
              mode="outlined"
              onPress={onRefresh}
              style={{ marginTop: 16 }}
              loading={refreshing}>
              Refresh
            </Button>
          </View>
          <WatchlistFormModal
            visible={modalVisible}
            onDismiss={() => {
              setModalVisible(false);
              setEditingWatchlist(null);
            }}
            initialValues={editingWatchlist || undefined}
            onSubmit={(data) => {
              // create inserts only
              myWatchlistsCollection(qc).insert(data as any);
              setModalVisible(false);
              setEditingWatchlist(null);
            }}
            submitLabel={editingWatchlist ? "Update" : "Create"}
          />
        </View>
      </WatchlistScreenScafold>
    );
  }

  return (
    <WatchlistScreenScafold>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={watchlist}
        renderItem={({ item }) => (
          <WatchlistCard
            watchlist={item}
            onEdit={() => {
              setEditingWatchlist(item);
              setModalVisible(true);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <WatchlistFormModal
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setEditingWatchlist(null);
        }}
        initialValues={editingWatchlist || undefined}
        onSubmit={(data) => {
          // if (editingWatchlist) {
          //   myWatchlistsCollection(qc)
          //   .update(editingWatchlist.id,
          //     {metadata:{
          //       update:"local-only"
          //     }},
          //     (draft) => {
          //     Object.assign(draft, data);
          //   });
          // } else {
          //   myWatchlistsCollection(qc).insert(data as any);
          //   // myWatchlistsCollection.delete
          // }
          createOrUpdateWatchlist({
            qc,
            type: "mine",
            data,
            editingWatchlist,
          });
          setModalVisible(false);
          setEditingWatchlist(null);
        }}
        submitLabel={editingWatchlist ? "Update" : "Create"}
      />
      <FAB
        icon="plus"
        onPress={() => {
          setEditingWatchlist(null);
          setModalVisible(true);
        }}
        style={{ position: "absolute", right: 16, bottom: bottom + 16 }}
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
