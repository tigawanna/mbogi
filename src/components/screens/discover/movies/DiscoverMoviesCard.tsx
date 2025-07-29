import type { TMDBMovie } from '@/data/discover/discover-zod-schema';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface DiscoverMoviesCardProps {
    item: TMDBMovie;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Account for padding and gap

export function DiscoverMoviesCard({ item }: DiscoverMoviesCardProps) {
  const { colors } = useTheme();
  
  const imageUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  return (
    <Card style={[styles.container, { width: cardWidth }]}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.poster}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.poster, styles.placeholderImage, { backgroundColor: colors.surfaceVariant }]}>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              No Image
            </Text>
          </View>
        )}
      </View>
      
      <Card.Content style={styles.content}>
        <Text 
          variant="titleSmall" 
          numberOfLines={2}
          style={[styles.title, { color: colors.onSurface }]}
        >
          {item.title}
        </Text>
        
        <Text 
          variant="bodySmall" 
          style={[styles.year, { color: colors.onSurfaceVariant }]}
        >
          {item.release_date ? new Date(item.release_date).getFullYear() : 'TBD'}
        </Text>
        
        {item.vote_average > 0 && (
          <View style={styles.ratingContainer}>
            <Text 
              variant="bodySmall" 
              style={[styles.rating, { color: colors.primary }]}
            >
              ⭐ {item.vote_average.toFixed(1)}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 2/3, // Movie poster aspect ratio
  },
  poster: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
    minHeight: 80,
  },
  title: {
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  year: {
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontWeight: '500',
  },
});
