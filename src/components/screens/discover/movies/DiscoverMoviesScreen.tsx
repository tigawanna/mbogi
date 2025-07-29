import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { DataTable, Searchbar, Text, useTheme } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';

import { LoadingIndicatorDots } from '@/components/state-screens/LoadingIndicatorDots';
import { EmptyRoadSVG } from '@/components/shared/svg/empty';

export function DiscoverMoviesScreen() {
  const { colors } = useTheme();

  // TODO: Replace with actual data fetching
  const { isLoading, isError, data } = {
    isLoading: false,
    isError: false,
    data: [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '3', title: 'Item 3' },
    ],
  };

  // TODO: Replace with actual pagination logic
  const { page, setPage, totalPages } = {
    totalPages: 3,
    page: 1,
    setPage: (page: number) => {},
  };

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
      <View style={styles.container}>
        {/* TODO: Replace with actual list rendering */}
        {data.map((item) => {
          return <Text key={item.id}>{item.title}</Text>;
        })}
      </View>
      {totalPages > 1 && (
        <DataTable.Pagination
          page={page}
          numberOfPages={totalPages}
          onPageChange={(page) => {
            setPage(page - 1);
          }}
          label={`Page ${page + 1} of totalPages`}
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
