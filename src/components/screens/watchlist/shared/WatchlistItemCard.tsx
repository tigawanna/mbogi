import { WatchlistItemsResponse } from '@/lib/pb/types/pb-types';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Chip, Text, useTheme } from 'react-native-paper';

interface WatchlistItemCardProps {
  item: WatchlistItemsResponse;
}

export function WatchlistItemCard({ item }: WatchlistItemCardProps) {
  const { colors } = useTheme();

  const posterUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).getFullYear().toString();
  };

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const getMediaRoute = () => {
    return item.media_type === 'movie' ? `/movies/${item.tmdb_id}` : `/tv/${item.tmdb_id}`;
  };

  return (
    <Link href={getMediaRoute() as any} asChild>
      <TouchableOpacity>
        <Card style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.content}>
            {/* Poster */}
            <Image
              source={{
                uri: posterUrl || require('@/assets/images/poster-placeholder.jpeg')
              }}
              style={styles.poster}
              contentFit="cover"
              placeholder={require('@/assets/images/poster-placeholder.jpeg')}
            />

            {/* Content */}
            <View style={styles.details}>
              <View style={styles.header}>
                <Text 
                  variant="titleMedium" 
                  numberOfLines={2}
                  style={[styles.title, { color: colors.onSurface }]}
                >
                  {item.title}
                </Text>
                <Chip 
                  compact 
                  style={[
                    styles.mediaTypeChip, 
                    { 
                      backgroundColor: item.media_type === 'movie' 
                        ? colors.primaryContainer 
                        : colors.secondaryContainer 
                    }
                  ]}
                  textStyle={{ 
                    color: item.media_type === 'movie' 
                      ? colors.onPrimaryContainer 
                      : colors.onSecondaryContainer,
                    fontSize: 12
                  }}
                >
                  {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                </Chip>
              </View>

              {/* Overview */}
              {item.overview && (
                <Text 
                  variant="bodySmall" 
                  numberOfLines={3}
                  style={[styles.overview, { color: colors.onSurfaceVariant }]}
                >
                  {item.overview}
                </Text>
              )}

              {/* Metadata */}
              <View style={styles.metadata}>
                <View style={styles.metadataRow}>
                  <Text variant="bodySmall" style={[styles.metadataLabel, { color: colors.onSurfaceVariant }]}>
                    Year:
                  </Text>
                  <Text variant="bodySmall" style={[styles.metadataValue, { color: colors.onSurface }]}>
                    {formatDate(item.release_date)}
                  </Text>
                </View>
                <View style={styles.metadataRow}>
                  <Text variant="bodySmall" style={[styles.metadataLabel, { color: colors.onSurfaceVariant }]}>
                    Rating:
                  </Text>
                  <Text variant="bodySmall" style={[styles.metadataValue, { color: colors.onSurface }]}>
                    {formatRating(item.vote_average)} ⭐
                  </Text>
                </View>
                {item.personal_rating > 0 && (
                  <View style={styles.metadataRow}>
                    <Text variant="bodySmall" style={[styles.metadataLabel, { color: colors.onSurfaceVariant }]}>
                      My Rating:
                    </Text>
                    <Text variant="bodySmall" style={[styles.metadataValue, { color: colors.primary }]}>
                      {item.personal_rating}/10 ⭐
                    </Text>
                  </View>
                )}
              </View>

              {/* Notes */}
              {item.notes && (
                <View style={styles.notesContainer}>
                  <Text variant="bodySmall" style={[styles.notesLabel, { color: colors.onSurfaceVariant }]}>
                    Notes:
                  </Text>
                  <Text 
                    variant="bodySmall" 
                    numberOfLines={2}
                    style={[styles.notes, { color: colors.onSurface }]}
                  >
                    {item.notes}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: '600',
    marginRight: 8,
    lineHeight: 20,
  },
  mediaTypeChip: {
    height: 24,
  },
  overview: {
    lineHeight: 16,
    marginBottom: 8,
    opacity: 0.9,
  },
  metadata: {
    gap: 4,
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataLabel: {
    width: 60,
    fontSize: 12,
    opacity: 0.8,
  },
  metadataValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 4,
  },
  notesLabel: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.9,
    lineHeight: 16,
  },
});
