import type { TMDBTVShow } from '@/data/discover/discover-zod-schema';
import { ViewMode } from '@/store/view-preferences-store';
import { FlatList, StyleSheet } from 'react-native';
import { DiscoverTVCard } from './DiscoverTVCard';

interface DiscoverTVFlatListProps {
    list: TMDBTVShow[];
    viewMode?: ViewMode;
}

export function DiscoverTVFlatList({list, viewMode = 'grid'}: DiscoverTVFlatListProps) {
  const renderItem = ({ item }: { item: TMDBTVShow }) => (
    <DiscoverTVCard item={item} viewMode={viewMode} />
  );

  const keyExtractor = (item: TMDBTVShow) => item.id.toString();

  const isGridView = viewMode === 'grid';

  return (
    <FlatList
      data={list}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      numColumns={isGridView ? 2 : 1}
      columnWrapperStyle={isGridView && list.length > 1 ? styles.row : undefined}
      key={viewMode} // Force re-render when view mode changes
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
