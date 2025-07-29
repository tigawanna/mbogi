import { useLiveQuery } from '@tanstack/react-db';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { DataTable, Searchbar, Text, useTheme } from 'react-native-paper';

import { EmptyRoadSVG } from '@/components/shared/svg/empty';
import { LoadingIndicatorDots } from '@/components/state-screens/LoadingIndicatorDots';
import { popularMoviesCollection } from '@/data/discover/discover-query-collection';
import { DiscoverMoviesFlatList } from './DiscoverMoviesFlatList';

export function DiscoverMoviesScreen() {
  const { colors } = useTheme();

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);

  // Fetch data using TanStack DB live query
  const { data: queryResult, isLoading, isError } = useLiveQuery(
    (query) =>
      query.from({
        movies: popularMoviesCollection(currentPage),
      }),
    [currentPage]
  );

  // Extract movies and pagination data
  const data = queryResult || [];
  const totalPages = 3; // TODO: Get from API response metadata
  const page = currentPage - 1; // Convert to 0-based for pagination component

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
              <Text variant='titleMedium' style={{ color: colors.error }}>
                Failed to load
              </Text>
              <Text variant='bodySmall' style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
                Something went wrong
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <EmptyRoadSVG />
              </View>
              <Text
                variant='headlineSmall'
                style={[styles.emptyTitle, { color: colors.onSurface }]}>
                Something went wrong
              </Text>
              <Text
                variant='bodyMedium'
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
              <Text variant='titleMedium' style={{ color: colors.error }}>
                No items found
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <EmptyRoadSVG />
              </View>
              <Text
                variant='headlineSmall'
                style={[styles.emptyTitle, { color: colors.onSurface }]}>
                No items found
              </Text>
              <Text
                variant='bodyMedium'
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
      {totalPages > 1 && (
        <DataTable.Pagination
          page={page}
          numberOfPages={totalPages}
          onPageChange={(pageNumber) => {
            setCurrentPage(pageNumber + 1); // Convert back to 1-based
          }}
          label={`Page ${page + 1} of ${totalPages}`}
          showFastPaginationControls
        />
      )}
    </DiscoverMoviesScreenScaffold>
  );
}

interface DiscoverMoviesScreenScaffoldProps {
  children: React.ReactNode;
}

export function DiscoverMoviesScreenScaffold({ children }: DiscoverMoviesScreenScaffoldProps) {
  const { colors } = useTheme();
  const { searchQuery, setSearchQuery } = useDiscoverMoviesScreenSearch();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.scaffoldContainer}>
      <Searchbar
        placeholder='Search DiscoverMoviesScreen'
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

export function useDiscoverMoviesScreenSearch() {
  const { query } = useLocalSearchParams<{ query: string }>();
  return {
    searchQuery: query || '',
    setSearchQuery: (query: string) => {
      router.setParams({ query });
    },
  };
}

const styles = StyleSheet.create({
  scaffoldContainer: {
    flex: 1,
    width: '100%',
  },
  statesContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    elevation: 0,
  },
  searchInput: {
    fontSize: 16,
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  emptyIconContainer: {
    opacity: 0.6,
    marginBottom: 8,
  },
  emptyTitle: {
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: 280,
    lineHeight: 20,
  },
});
