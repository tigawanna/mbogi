import { useLiveQuery } from '@tanstack/react-db';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { EmptyRoadSVG } from '@/components/shared/svg/empty';
import { LoadingIndicatorDots } from '@/components/state-screens/LoadingIndicatorDots';
import { searchTVCollection } from '@/data/search';
import { DiscoverTVFlatList } from '../tv/DiscoverTVFlatList';

interface SearchTVScreenProps {
  searchQuery: string;
}

export function SearchTVScreen({ searchQuery }: SearchTVScreenProps) {
  const { colors } = useTheme();

  // Search data using TanStack DB live query
  const { data: queryResult, isLoading, isError } = useLiveQuery(
    (query) =>
      query.from({
        tv: searchTVCollection({
          filters: { query: searchQuery, page: 1 },
          enabled: searchQuery.length > 0,
        }),
      }),
    [searchQuery]
  );

  // Extract TV shows data
  const data = queryResult || [];

  if (searchQuery.length === 0) {
    return (
      <View style={styles.statesContainer}>
        <View style={styles.emptyContainer}>
          <Text
            variant='headlineSmall'
            style={[styles.emptyTitle, { color: colors.onSurface }]}>
            Search TV Shows
          </Text>
          <Text
            variant='bodyMedium'
            style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
            Enter a TV show title to start searching
          </Text>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.statesContainer}>
        <LoadingIndicatorDots />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.statesContainer}>
        {__DEV__ ? (
          <View>
            <Text variant='titleMedium' style={{ color: colors.error }}>
              Failed to search TV shows
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
              Search failed
            </Text>
            <Text
              variant='bodyMedium'
              style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              Please try again with a different search term
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.statesContainer}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <EmptyRoadSVG />
          </View>
          <Text
            variant='headlineSmall'
            style={[styles.emptyTitle, { color: colors.onSurface }]}>
            No TV shows found
          </Text>
          <Text
            variant='bodyMedium'
            style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
            Try adjusting your search term to find more TV shows
          </Text>
        </View>
      </View>
    );
  }

  return <DiscoverTVFlatList list={data} />;
}

const styles = StyleSheet.create({
  statesContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
