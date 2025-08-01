import { WatchlistSelectionModal } from '@/components/screens/watchlist/shared/WatchlistSelectionModal';
import { TMDBSearchResponse } from '@/data/discover/discover-zod-schema';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, IconButton, useTheme } from 'react-native-paper';

type ResultItem = TMDBSearchResponse["results"][number] & {
  watchlistTitle?: string;
  watchlistId?: string;
};

interface DiscoverCardActionProps {
  type: "movies" | "tv" | "person";
  item: ResultItem;
}

export function DiscoverCardAction({ type, item }: DiscoverCardActionProps) {
  const theme = useTheme();
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);

  if (item.media_type === "person") {
    return null;
  }

  const isInWatchlist = !!item.watchlistTitle;
  
  // Helper function to get item title based on media type
  const getItemTitle = (item: ResultItem): string => {
    if ('title' in item) return item.title;
    if ('name' in item) return item.name;
    return 'Unknown';
  };

  // Get item ID as string for watchlist operations
  const getItemId = (): string => {
    return item.id.toString();
  };

  return (
    <View style={styles.container}>
      {isInWatchlist ? (
        <Chip
          icon="playlist-check"
          mode="flat"
          onPress={() => setShowWatchlistModal(true)}
          style={[styles.watchlistChip, { backgroundColor: theme.colors.primaryContainer }]}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          {item.watchlistTitle}
        </Chip>
      ) : (
        <IconButton
          icon="playlist-plus"
          mode="contained-tonal"
          size={20}
          onPress={() => setShowWatchlistModal(true)}
          style={styles.addButton}
        />
      )}

      <WatchlistSelectionModal
        visible={showWatchlistModal}
        onDismiss={() => setShowWatchlistModal(false)}
        itemId={getItemId()}
        itemTitle={getItemTitle(item)}
        currentWatchlistId={item.watchlistId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchlistChip: {
    borderRadius: 16,
  },
  addButton: {
    margin: 0,
  },
});
