import type { TMDBPerson } from '@/data/discover/discover-zod-schema';
import { FlatList, StyleSheet } from 'react-native';
import { SearchPersonCard } from '../person/DiscoverPersonCard';


interface SearchPersonFlatListProps {
    list: TMDBPerson[];
}

export function SearchPersonFlatList({list}: SearchPersonFlatListProps) {
  const renderItem = ({ item }: { item: TMDBPerson }) => (
    <SearchPersonCard item={item} />
  );

  const keyExtractor = (item: TMDBPerson) => item.id.toString();

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
