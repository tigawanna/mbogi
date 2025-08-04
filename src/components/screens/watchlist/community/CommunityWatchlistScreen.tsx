import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import {
  communityWatchlistsCollection,
  getCommunityWatchlistPageOptionsQueryOptions,
} from "@/data/watchlist/community-watchlist";
import { useRefreshControl } from "@/hooks/useRefreshControl";
import { eq } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, FAB, Searchbar, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCommunityWatchlistPage, useWatchlistSearch } from "../hooks";
import { WatchlistCard } from "../shared/WatchlistCard";
// consolidated above
import { myWatchlistItemsCollection } from "@/data/watchlist/my-watchlist";
import {
  createWatchListMutationOptions,
  updateWatchListMutationOptions,
} from "@/data/watchlist/watchlist-muttions";
import type { WatchlistResponse } from "@/lib/pb/types/pb-types";
import { WatchlistFormModal } from "../shared/WatchlistFormModal";
import { CommunityListFooter } from "./CommunityListFooter";

export function CommunityWatchlistScreen() {
  const qc = useQueryClient();
  const { searchQuery } = useWatchlistSearch();
  const { page } = useCommunityWatchlistPage();
  const { colors } = useTheme();
  // Initialize safe area insets and pull-to-refresh
  const { bottom } = useSafeAreaInsets();
  const { refreshing, onRefresh } = useRefreshControl(() =>
    qc.invalidateQueries({ queryKey: ["watchlist", "community"] })
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWatchlist, setEditingWatchlist] = useState<WatchlistResponse | null>(null);
  const createMutation = useMutation(createWatchListMutationOptions());
  const updateMutation = useMutation(updateWatchListMutationOptions());


  const {
    data: watchlist,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query
        .from({
          watchlist: communityWatchlistsCollection({
            keyword: searchQuery,
            qc,
            page,
          }),
        })
        .join({ myWatchlist: myWatchlistItemsCollection(qc) }, ({ watchlist, myWatchlist }) =>
          //@ts-expect-error TODO confirm doign this with string on number isnt causing issues
          eq(watchlist.id, myWatchlist.id)
        )
        .select(({ watchlist, myWatchlist }) => ({
          ...watchlist,
          watchListName: myWatchlist?.watchlistTitle,
        })),
    [searchQuery, page]
  );
  const { data: pageOptions } = useQuery(
    getCommunityWatchlistPageOptionsQueryOptions({
      keyword: searchQuery,
      qc,
      page,
    })
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
                Something went wrong
              </Text>
              <Button mode="contained" onPress={onRefresh} loading={refreshing} style={{ marginTop: 16 }}>
                Refresh
              </Button>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <EmptyRoadSVG />
              </View>
              <Text
                variant="headlineSmall"
                style={[styles.emptyTitle, { color: colors.onSurface }]}
              >
                Something went wrong
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}
              >
                Try adjusting your filters or search terms to discover more content
              </Text>
              <Button mode="contained" onPress={onRefresh} loading={refreshing} style={{ marginTop: 16 }}>
                Refresh
              </Button>
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
            <Button
              mode="outlined"
              onPress={onRefresh}
              loading={refreshing}
              style={{ marginTop: 16 }}>
              Refresh
            </Button>
          </View>
          <WatchlistFormModal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            initialValues={editingWatchlist || undefined}
            onSubmit={(data) => {
              if (editingWatchlist) {
                updateMutation.mutate(data);
              } else {
                createMutation.mutate(data);
              }
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
        renderItem={({ item, index }) => (
          <WatchlistCard
            watchlist={item}
            community
            onEdit={() => {
              setEditingWatchlist(item);
              setModalVisible(true);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <CommunityListFooter
            totalPages={pageOptions?.totalPages}
            perPage={pageOptions?.perPage}
          />
        }
      />
      {/* Watchlist creation/edit modal and FAB */}
      <WatchlistFormModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        initialValues={editingWatchlist || undefined}
        onSubmit={(data) => {
          if (editingWatchlist) {
            updateMutation.mutate(data);
          } else {
            createMutation.mutate(data);
          }
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
