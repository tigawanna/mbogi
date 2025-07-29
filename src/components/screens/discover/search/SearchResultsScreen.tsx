import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { EmptyRoadSVG } from '@/components/shared/svg/empty';
import { LoadingIndicatorDots } from '@/components/state-screens/LoadingIndicatorDots';
import { useLiveQuery } from '@tanstack/react-db';
import { discoverSearchCollection } from '@/data/discover/discover-query-collection';
import { SearchResultsFlatList } from './SearchResultsFlatList';

interface SearchResultsScreenProps{
    searchQuery: string;
}
export function SearchResultsScreen({ searchQuery }: SearchResultsScreenProps) {
  const {
    data,
    isLoading,
    isError,
  } = useLiveQuery(
    (query) =>
      query.from({
        movies: discoverSearchCollection({
          filters: { query: searchQuery },
          enabled: true,
        }),
      }),
    [searchQuery]
  );
  const { colors } = useTheme();

  // TODO: Replace with actual data fetching
  // const { isLoading, isError, data } = {
  //   isLoading: false,
  //   isError: false,
  //   data: [
  //     { id: '1', title: 'Item 1' },
  //     { id: '2', title: 'Item 2' },
  //     { id: '3', title: 'Item 3' },
  //   ],
  // };

  // TODO: Replace with actual pagination logic
  const { page, setPage, totalPages } = {
    totalPages: 3,
    page: 1,
    setPage: (page: number) => {},
  };

  if (isLoading) {
    return (
      <SearchResultsScreenScaffold>
        <View style={styles.statesContainer}>
          <LoadingIndicatorDots />
        </View>
      </SearchResultsScreenScaffold>
    );
  }

  if (isError) {
    return (
      <SearchResultsScreenScaffold>
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
      </SearchResultsScreenScaffold>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SearchResultsScreenScaffold>
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
      </SearchResultsScreenScaffold>
    );
  }

  return (
    <SearchResultsScreenScaffold>
      <SearchResultsFlatList searchresults={data} />
    </SearchResultsScreenScaffold>
  );
}

interface SearchResultsScreenScaffoldProps {
  children: React.ReactNode;
}

export function SearchResultsScreenScaffold({ children }: SearchResultsScreenScaffoldProps) {
  return (
    <View style={styles.scaffoldContainer}>
      {children}
    </View>
  );
}

export function useSearchResultsScreenSearch() {
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
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
