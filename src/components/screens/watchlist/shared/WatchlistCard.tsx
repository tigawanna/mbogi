import { WatchlistResponse } from '@/lib/pb/types/pb-types';
import { WatchlistItemsResponse } from '@/lib/pb/types/pb-zod';
import { analyzeWatchlistGenres } from '@/utils/genre-utils';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';

interface WatchlistCardProps {
  watchlist: WatchlistResponse & {
    expand?: {
      user_id?: { id: string; name: string; email: string }[];
      items?: WatchlistItemsResponse[];
    };
  };
  community?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WatchlistCard({ watchlist, community = false, onEdit, onDelete }: WatchlistCardProps) {
  const { colors } = useTheme();

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'earth';
      case 'private':
        return 'lock';
      case 'followers_only':
        return 'account-group';
      default:
        return 'earth';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return colors.primary;
      case 'private':
        return colors.error;
      case 'followers_only':
        return colors.tertiary;
      default:
        return colors.onSurfaceVariant;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const itemCount = watchlist.expand?.items?.length || watchlist.items?.length || 0;
  const genreAnalysis = watchlist.expand?.items ? analyzeWatchlistGenres(watchlist.expand.items) : '';

  return (
    <Link
      href={community ? `/watchlist/community/${watchlist.id}` : `/watchlist/mine/${watchlist.id}`}
      asChild>
      <TouchableOpacity>
        <Card style={[styles.container, { backgroundColor: colors.surface }]} elevation={4}>
          <Card.Content style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text variant="titleMedium" style={[styles.title, { color: colors.onSurface }]}>
                  {watchlist.title}
                </Text>
                {community && watchlist.expand?.user_id?.[0] && (
                  <Text
                    variant="bodySmall"
                    style={[styles.author, { color: colors.onSurfaceVariant }]}>
                    by {watchlist.expand.user_id[0].name || watchlist.expand.user_id[0].email}
                  </Text>
                )}
              </View>
              <View style={styles.headerRight}>
                <IconButton
                  icon={getVisibilityIcon(watchlist.visibility)}
                  iconColor={getVisibilityColor(watchlist.visibility)}
                  size={20}
                  style={styles.visibilityIcon}
                />
                {onEdit && (
                  <IconButton
                    icon="pencil"
                    iconColor={colors.primary}
                    size={20}
                    style={styles.visibilityIcon}
                    onPress={onEdit}
                  />
                )}
              </View>
            </View>

            {/* Overview */}
            {watchlist.overview && (
              <Text
                variant="bodyMedium"
                numberOfLines={2}
                style={[styles.overview, { color: colors.onSurfaceVariant }]}>
                {watchlist.overview}
              </Text>
            )}

            {/* Genre Analysis */}
            {genreAnalysis && (
              <Text
                variant="bodySmall"
                style={[styles.genreAnalysis, { color: colors.tertiary }]}>
                {genreAnalysis}
              </Text>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <Chip
                  compact
                  style={[styles.itemChip, { backgroundColor: colors.primaryContainer }]}
                  textStyle={{ color: colors.onPrimaryContainer }}>
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </Chip>
                {watchlist.is_collaborative && (
                  <Chip
                    compact
                    style={[
                      styles.collaborativeChip,
                      { backgroundColor: colors.tertiaryContainer },
                    ]}
                    textStyle={{ color: colors.onTertiaryContainer }}>
                    Collaborative
                  </Chip>
                )}
              </View>
              <Text variant="bodySmall" style={[styles.date, { color: colors.onSurfaceVariant }]}>
                {formatDate(watchlist.updated)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  content: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  headerRight: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  author: {
    fontSize: 12,
    opacity: 0.8,
  },
  visibilityIcon: {
    margin: 0,
  },
  overview: {
    lineHeight: 18,
    marginBottom: 12,
  },
  genreAnalysis: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
    opacity: 0.9,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  itemChip: {
    height: 28,
  },
  collaborativeChip: {
    height: 28,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
});
