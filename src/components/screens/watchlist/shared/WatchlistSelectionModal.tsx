import { getUserWatchListFromQueryClient, myWatchlistCollection } from '@/data/watchlist/my-watchlist';
import {
    MutationSource,
    useAddItemToWatchlistMutation,
    useCreateWatchlistMutation,
    useRemoveItemFromWatchlistMutation
} from '@/data/watchlist/watchlist-muttions';
import { pb } from '@/lib/pb/client';
import { useLiveQuery } from '@tanstack/react-db';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    Chip,
    Divider,
    IconButton,
    Modal,
    Portal,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';

interface WatchlistSelectionModalProps {
  visible: boolean;
  onDismiss: () => void;
  itemId: string;
  itemTitle: string;
  source: MutationSource;
  currentWatchlistId?: string; // If the item is already in a watchlist
}

export function WatchlistSelectionModal({
  visible,
  onDismiss,
  itemId,
  itemTitle,
  source,
  currentWatchlistId
}: WatchlistSelectionModalProps) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const userId = pb.authStore.record?.id;
  

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newWatchlistTitle, setNewWatchlistTitle] = React.useState('');

  const addItemMutation = useAddItemToWatchlistMutation({ source });
  const removeItemMutation = useRemoveItemFromWatchlistMutation({ source });
  const createWatchlistMutation = useCreateWatchlistMutation({ source });

  // Load user's watchlists when modal opens
  const qc = useQueryClient();
  const {
    data: watchlists,
    isLoading,
  } = useLiveQuery((query) =>
    query.from({
      watchlist: myWatchlistCollection(qc),
    })
  );

  const handleAddToWatchlist = async (watchlistId: string) => {
    try {
      await addItemMutation.mutateAsync({ watchlistId, itemId });
      onDismiss();
    } catch (error) {
      console.error('Failed to add item to watchlist:', error);
    }
  };

  const handleRemoveFromWatchlist = async (watchlistId: string) => {
    try {
      await removeItemMutation.mutateAsync({ watchlistId, itemId });
      onDismiss();
    } catch (error) {
      console.error('Failed to remove item from watchlist:', error);
    }
  };

  const handleCreateWatchlist = async () => {
    if (!newWatchlistTitle.trim() || !userId) return;

    try {
      const newWatchlist = await createWatchlistMutation.mutateAsync({
        user_id: userId,
        title: newWatchlistTitle.trim(),
        visibility: 'public',
        overview: `Watchlist for ${itemTitle}`
      });

      // Add the item to the newly created watchlist
      await addItemMutation.mutateAsync({ 
        watchlistId: newWatchlist.id, 
        itemId 
      });

      setShowCreateForm(false);
      setNewWatchlistTitle('');
      onDismiss();
    } catch (error) {
      console.error('Failed to create watchlist:', error);
    }
  };

  const isItemInWatchlist = (watchlistId: string) => {
    const watchlist = watchlists.find(w => w.id === watchlistId);
    return watchlist?.items?.includes(itemId) || false;
  };

  const renderWatchlistItem = ({ item: watchlist }: { item: any }) => {
    const isInThisWatchlist = isItemInWatchlist(watchlist.id);
    const isCurrentWatchlist = currentWatchlistId === watchlist.id;

    return (
      <Card style={[styles.watchlistCard, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.watchlistInfo}>
            <Text variant="titleMedium" numberOfLines={1}>
              {watchlist.title}
            </Text>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              {watchlist.items?.length || 0} items
            </Text>
          </View>
          
          <View style={styles.actions}>
            {isCurrentWatchlist && (
              <Chip
                icon="playlist-check"
                mode="flat"
                style={[styles.currentChip, { backgroundColor: colors.primaryContainer }]}
                textStyle={{ color: colors.onPrimaryContainer }}
              >
                Current
              </Chip>
            )}
            
            {isInThisWatchlist ? (
              <IconButton
                icon="minus-circle"
                mode="contained-tonal"
                iconColor={colors.error}
                onPress={() => handleRemoveFromWatchlist(watchlist.id)}
                disabled={removeItemMutation.isPending}
              />
            ) : (
              <IconButton
                icon="plus-circle"
                mode="contained-tonal"
                iconColor={colors.primary}
                onPress={() => handleAddToWatchlist(watchlist.id)}
                disabled={addItemMutation.isPending}
              />
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (!userId) {
    return null;
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Manage &ldquo;{itemTitle}&rdquo;
        </Text>

        {showCreateForm ? (
          <View style={styles.createForm}>
            <TextInput
              label="New Watchlist Title"
              value={newWatchlistTitle}
              onChangeText={setNewWatchlistTitle}
              mode="outlined"
              style={styles.input}
            />
            <View style={styles.createActions}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowCreateForm(false);
                  setNewWatchlistTitle('');
                }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleCreateWatchlist}
                loading={createWatchlistMutation.isPending}
                disabled={!newWatchlistTitle.trim()}
              >
                Create & Add
              </Button>
            </View>
          </View>
        ) : (
          <>
            <Button
              mode="outlined"
              icon="plus"
              onPress={() => setShowCreateForm(true)}
              style={styles.createButton}
            >
              Create New Watchlist
            </Button>

            <Divider style={styles.divider} />

            {isLoading ? (
              <View style={styles.loading}>
                <Text>Loading watchlists...</Text>
              </View>
            ) : watchlists.length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>
                  No watchlists found
                </Text>
                <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                  Create your first watchlist to get started
                </Text>
              </View>
            ) : (
              <FlatList
                data={watchlists}
                renderItem={renderWatchlistItem}
                keyExtractor={item => item.id}
                style={styles.list}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        )}

        <Button
          mode="text"
          onPress={onDismiss}
          style={styles.closeButton}
        >
          Close
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    marginBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
  createForm: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  list: {
    maxHeight: 300,
  },
  watchlistCard: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  watchlistInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentChip: {
    marginRight: 8,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  closeButton: {
    marginTop: 16,
  },
});
