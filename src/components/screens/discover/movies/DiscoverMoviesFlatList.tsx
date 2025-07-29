import type { TMDBMovie } from '@/data/discover/discover-zod-schema';
import { FlatList, StyleSheet } from 'react-native';
import { DiscoverMoviesCard } from './DiscoverMoviesCard';

interface DiscoverMoviesFlatListProps {
    list: TMDBMovie[];
}

export function DiscoverMoviesFlatList({list}: DiscoverMoviesFlatListProps) {
  const renderItem = ({ item }: { item: TMDBMovie }) => (
    <DiscoverMoviesCard item={item} />
  );

  const keyExtractor = (item: TMDBMovie) => item.id.toString();

  return (
    <FlatList
      data={list}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={list.length > 1 ? styles.row : undefined}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
