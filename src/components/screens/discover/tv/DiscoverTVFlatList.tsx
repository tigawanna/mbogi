import type { TMDBTVShow } from '@/data/discover/discover-zod-schema';
import { FlatList, StyleSheet } from 'react-native';
import { DiscoverTVCard } from './DiscoverTVCard';

interface DiscoverTVFlatListProps {
    list: TMDBTVShow[];
}

export function DiscoverTVFlatList({list}: DiscoverTVFlatListProps) {
  const renderItem = ({ item }: { item: TMDBTVShow }) => (
    <DiscoverTVCard item={item} />
  );

  const keyExtractor = (item: TMDBTVShow) => item.id.toString();

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
