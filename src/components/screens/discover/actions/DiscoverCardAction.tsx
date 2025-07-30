import { TMDBSearchResponse } from '@/data/discover/discover-zod-schema';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Modal, Portal, Surface, Text, useTheme } from 'react-native-paper';

type ResultItem = TMDBSearchResponse["results"][number] & {
  watchlistTitle?: string;
};

interface DiscoverCardActionProps {
  type: "movies" | "tv" | "person";
  item: ResultItem;
}

export function DiscoverCardAction({ type, item }: DiscoverCardActionProps) {
  const theme = useTheme();
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

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

  return (
    <View style={styles.container}>
      {isInWatchlist ? (
        <Chip
          icon="playlist-check"
          mode="flat"
          onPress={() => setShowManageModal(true)}
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

      {/* Add to Watchlist Modal */}
      <AddToWatchlistModal
        visible={showWatchlistModal}
        onDismiss={() => setShowWatchlistModal(false)}
        item={item}
        getItemTitle={getItemTitle}
      />

      {/* Manage Watchlist Modal */}
      <ManageWatchlistModal
        visible={showManageModal}
        onDismiss={() => setShowManageModal(false)}
        item={item}
        currentWatchlist={item.watchlistTitle || ""}
        getItemTitle={getItemTitle}
      />
    </View>
  );
}

// Modal for adding item to a watchlist
interface AddToWatchlistModalProps {
  visible: boolean;
  onDismiss: () => void;
  item: ResultItem;
  getItemTitle: (item: ResultItem) => string;
}

function AddToWatchlistModal({ visible, onDismiss, item, getItemTitle }: AddToWatchlistModalProps) {
  const theme = useTheme();

  // TODO: Replace with actual watchlist data
  const availableWatchlists = [
    { id: "1", name: "Want to Watch" },
    { id: "2", name: "Favorites" },
    { id: "3", name: "Action Movies" },
  ];

  const handleAddToWatchlist = (watchlistName: string) => {
    // TODO: Implement actual add to watchlist logic
    console.log(`Adding ${getItemTitle(item)} to ${watchlistName}`);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Surface style={styles.modalSurface}>
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall">Add to Watchlist</Text>
            <IconButton icon="close" onPress={onDismiss} />
          </View>
          
          <View style={styles.modalContent}>
            <Text variant="bodyMedium" style={{ marginBottom: 16, color: theme.colors.onSurfaceVariant }}>
              Choose a watchlist for &quot;{getItemTitle(item)}&quot;
            </Text>
            
            {availableWatchlists.map((watchlist) => (
              <Button
                key={watchlist.id}
                mode="outlined"
                onPress={() => handleAddToWatchlist(watchlist.name)}
                style={styles.watchlistOption}
                contentStyle={styles.watchlistOptionContent}
                icon="playlist-plus"
              >
                {watchlist.name}
              </Button>
            ))}
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}

// Modal for managing existing watchlist item
interface ManageWatchlistModalProps {
  visible: boolean;
  onDismiss: () => void;
  item: ResultItem;
  currentWatchlist: string;
  getItemTitle: (item: ResultItem) => string;
}

function ManageWatchlistModal({ visible, onDismiss, item, currentWatchlist, getItemTitle }: ManageWatchlistModalProps) {
  const theme = useTheme();

  // TODO: Replace with actual watchlist data
  const availableWatchlists = [
    { id: "1", name: "Want to Watch" },
    { id: "2", name: "Favorites" },
    { id: "3", name: "Action Movies" },
  ].filter(w => w.name !== currentWatchlist);

  const handleRemoveFromWatchlist = () => {
    // TODO: Implement actual remove from watchlist logic
    console.log(`Removing ${getItemTitle(item)} from ${currentWatchlist}`);
    onDismiss();
  };

  const handleMoveToWatchlist = (watchlistName: string) => {
    // TODO: Implement actual move to watchlist logic
    console.log(`Moving ${getItemTitle(item)} from ${currentWatchlist} to ${watchlistName}`);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Surface style={styles.modalSurface}>
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall">Manage Watchlist</Text>
            <IconButton icon="close" onPress={onDismiss} />
          </View>
          
          <View style={styles.modalContent}>
            <Text variant="bodyMedium" style={{ marginBottom: 16, color: theme.colors.onSurfaceVariant }}>
              &quot;{getItemTitle(item)}&quot; is in &quot;{currentWatchlist}&quot;
            </Text>
            
            <Button
              mode="outlined"
              onPress={handleRemoveFromWatchlist}
              style={[styles.watchlistOption, { borderColor: theme.colors.error }]}
              contentStyle={styles.watchlistOptionContent}
              textColor={theme.colors.error}
              icon="playlist-remove"
            >
              Remove from {currentWatchlist}
            </Button>

            {availableWatchlists.length > 0 && (
              <>
                <Text variant="titleSmall" style={{ marginTop: 24, marginBottom: 12 }}>
                  Or move to another watchlist:
                </Text>
                {availableWatchlists.map((watchlist) => (
                  <Button
                    key={watchlist.id}
                    mode="outlined"
                    onPress={() => handleMoveToWatchlist(watchlist.name)}
                    style={styles.watchlistOption}
                    contentStyle={styles.watchlistOptionContent}
                    icon="playlist-play"
                  >
                    Move to {watchlist.name}
                  </Button>
                ))}
              </>
            )}
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    height:'100%',
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
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 20,
  },
  modalSurface: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 0,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  modalContent: {
    padding: 20,
    width: '100%',
  },
  watchlistOption: {
    marginVertical: 4,
  },
  watchlistOptionContent: {
    height: 48,
    justifyContent: 'center',
  },
});
