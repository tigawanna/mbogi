import { TMDBSearchResponse } from '@/data/discover/discover-zod-schema';
import { useSearchResultsViewMode } from '@/store/view-preferences-store';
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
    const { viewMode } = useSearchResultsViewMode();
  
  const renderItem = ({ item, index }: { item: SearchResultItem; index: number }) => {
    if (item.media_type === 'movie') {
      return (
        <DiscoverMoviesCard item={item} viewMode={viewMode} />
      );
    }
    if (item.media_type === 'tv') {
      return (
        <DiscoverTVCard item={item} viewMode={viewMode} />
      );
    }
    if (item.media_type === 'person') {
      return <DiscoverPersonCard item={item} viewMode={viewMode} />;
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No results found</Text>
      </View>
    );
  };

  const keyExtractor = (item: { id: number }) => item.id.toString();

  const isGridView = viewMode === "grid";

  return (
    <FlatList
      data={searchresults}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      numColumns={isGridView ? 2 : 1}
      columnWrapperStyle={isGridView && searchresults.length > 1 ? styles.row : undefined}
      key={viewMode} // Force re-render when view mode changes
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
