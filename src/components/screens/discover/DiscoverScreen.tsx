import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";

import { router, useLocalSearchParams } from "expo-router";
import {
  DiscoverFeedFilters,
  FilterButton,
  useHasActiveFilters,
} from "./filters/DiscoverFeedFilters";
import { DiscoverMoviesScreen } from "./movies/DiscoverMoviesScreen";
import { SearchResultsScreen } from "./search/SearchResultsScreen";
import { DiscoverTVScreen } from "./tv/DiscoverTVScreen";

export function DiscoverScreen() {
  const { colors } = useTheme();
  const { searchQuery } = useDiscoverScreenSearch();

  // Show search results if there's a search query
  if (searchQuery.trim().length > 0) {
    return (
      <DiscoverScreenScaffold>
        <View style={styles.container}>
          <SearchResultsScreen searchQuery={searchQuery} />
        </View>
      </DiscoverScreenScaffold>
    );
  }

  // Show discover tabs when no search query
  return (
    <DiscoverScreenScaffold>
      <View style={styles.container}>
        <TabsProvider defaultIndex={0}>
          <Tabs mode="fixed" style={{ backgroundColor: colors.surface }}>
            <TabScreen label="Movies" icon="movie">
              <DiscoverMoviesScreen />
            </TabScreen>
            <TabScreen label="TV Shows" icon="television">
              <DiscoverTVScreen />
            </TabScreen>
          </Tabs>
        </TabsProvider>
      </View>
    </DiscoverScreenScaffold>
  );
}

interface DiscoverScreenProps {
  children: React.ReactNode;
}

export function DiscoverScreenScaffold({ children }: DiscoverScreenProps) {
  const { colors } = useTheme();
  const { searchQuery, setSearchQuery } = useDiscoverScreenSearch();

  const hasActiveFilters = useHasActiveFilters();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View style={styles.scaffoldContainer}>
      <View style={[styles.searchContainer, { width: "99%" }]}>
        <Searchbar
          placeholder="Search "
          onChangeText={(term) => setSearchQuery(term)}
          value={searchQuery}
          style={[styles.searchBar, { width: "75%" }]}
          inputStyle={styles.searchInput}
          iconColor={colors.onSurfaceVariant}
          placeholderTextColor={colors.onSurfaceVariant}
        />
        <FilterButton onPress={() => setShowFilters(true)} hasActiveFilters={hasActiveFilters} />
        <DiscoverFeedFilters 
          visible={showFilters} 
          onDismiss={() => setShowFilters(false)} 
        />
      </View>
      {children}
    </View>
  );
}

export function useDiscoverScreenSearch() {
  const { query } = useLocalSearchParams<{ query: string }>();
  return {
    searchQuery: query || "",
    setSearchQuery: (query: string) => {
      router.setParams({ query });
    },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scaffoldContainer: {
    flex: 1,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  searchBar: {
    elevation: 0,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    width: "100%",
  },
});
