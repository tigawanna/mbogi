import { TMDBSearchResponse } from '@/data/discover/discover-zod-schema';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { DiscoverMoviesCard } from '../movies/DiscoverMoviesCard';
import { DiscoverPersonCard } from '../person/DiscoverPersonCard';
import { DiscoverTVCard } from '../tv/DiscoverTVCard';

interface SearchResultsFlatListProps {
  searchresults: TMDBSearchResponse["results"];
}

type SearchResultItem = TMDBSearchResponse["results"][number];

export function SearchResultsFlatList({ searchresults }: SearchResultsFlatListProps) {
  const renderItem = ({ item }: { item: SearchResultItem }) => {
    if (item.media_type === 'movie') {
      return (
        <DiscoverMoviesCard item={item} />
      );
    }
    if (item.media_type === 'tv') {
      return (
        <DiscoverTVCard item={item} />
      );
    }
    if (item.media_type === 'person') {
      return <DiscoverPersonCard item={item} />;
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No results found</Text>
      </View>
    );
  };

  const keyExtractor = (item: { id: number }) => item.id.toString();

  return (
    <FlatList
      data={searchresults}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={searchresults.length > 1 ? styles.row : undefined}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  contentContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
