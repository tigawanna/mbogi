import type { TMDBMovie } from "@/data/discover/discover-zod-schema";
import { useDiscoverMoviesViewMode } from "@/store/view-preferences-store";
import { FlatList, StyleSheet } from "react-native";
import { DiscoverMoviesCard } from "./DiscoverMoviesCard";

interface DiscoverMoviesFlatListProps {
  list: TMDBMovie[];
}

export function DiscoverMoviesFlatList({ list }: DiscoverMoviesFlatListProps) {
  const { viewMode } = useDiscoverMoviesViewMode();
  
  const renderItem = ({ item, index }: { item: TMDBMovie; index: number }) => (
    <DiscoverMoviesCard item={item} viewMode={viewMode} />
  );

  const keyExtractor = (item: TMDBMovie) => item.id.toString();

  const isGridView = viewMode === "grid";

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
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
